<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { WhatYouGetCard } from '@/types/content'

/**
 * Секция «What You Get» (Affiliates / Advertisers).
 *
 * Layout (Figma 2653:1227 / 2655:1576):
 * - bg-page; на desktop — 2 колонки: title слева (sticky) + колонка
 *   карточек 460px справа, gap 70.
 * - Mobile (Figma 3861:19073): title центром сверху, карточки одна
 *   под другой, gap 60.
 *
 * Поведение скролла (Figma 2697:2146):
 *   Заголовок слева `position: sticky` к `--header-offset`. Карточки
 *   справа — обычный column-flex с gap. При скролле карточки
 *   обычным потоком уходят вверх; когда низ `.wyg__cards` проходит
 *   точку залипания заголовка, sticky-rail отлипает и уезжает
 *   вместе с последней карточкой → CTA снизу.
 *   IntersectionObserver обновляет бейдж 1/5 → 5/5 по пересечению
 *   центра viewport.
 *
 * Карточка (Figma 2655:1593 / 2653:1233):
 * - bg-surface, border subtle 1px, radius 24.
 * - Header: padding 24, заголовок Headline/H4 (32/40 desktop, 24/32 mobile).
 * - Divider: 1px subtle.
 * - Content: padding 24, body 2 regular (16/24, secondary), включая
 *   list-disc (отступ 24, gap 4 между пунктами).
 * - Sticker: 3D-иллюстрация ~200×200 desktop / ~100×100 mobile,
 *   абсолютная, «вылетает» за правый-верхний угол карточки, с rotation.
 *   Параметры стикеров — в `STICKER_CONFIG` ниже (это часть дизайна,
 *   не контента, поэтому не в JSON).
 *
 * Бейдж: pill bg-surface + 2px brand pink border, rotate 10°,
 * текст `N/M`. Счётчик обновляется при пересечении центра viewport.
 */
interface Props {
  title: string
  cards: WhatYouGetCard[]
}

const props = defineProps<Props>()

const activeIndex = ref(0)
const cardEls = ref<(HTMLElement | undefined)[]>([])
/**
 * Высота последней карточки (измеряется в реальном времени).
 *
 * Прокидывается в CSS как `--wyg-last-card-h` и идёт в `min-height`
 * sticky-заголовка. Благодаря этому собственная высота rail'а становится
 * равной высоте последней карточки → sticky отклеится ровно в момент,
 * когда верх последней карточки поравняется со sticky-top, и дальше
 * заголовок поедет наверх ВМЕСТЕ с последней карточкой.
 */
const lastCardHeight = ref(0)

/** Узкая полоса по центру viewport — какая карточка её пересекает,
 *  ту и считаем активной. */
const OBSERVER_MARGIN = '-42% 0px -42% 0px'

let observer: IntersectionObserver | null = null
let cardResizeObserver: ResizeObserver | null = null

function bindCardRef(el: unknown, index: number) {
  if (!el) {
    cardEls.value[index] = undefined
    return
  }
  cardEls.value[index] = el as HTMLElement
}

function setupObserver() {
  observer?.disconnect()
  const els = cardEls.value.filter((n): n is HTMLElement => Boolean(n))
  if (!els.length) return

  observer = new IntersectionObserver(
    entries => {
      const crossing = entries.filter(e => e.isIntersecting)
      if (!crossing.length) return
      const best = crossing.reduce((a, b) => (a.intersectionRatio >= b.intersectionRatio ? a : b))
      const idx = Number((best.target as HTMLElement).dataset.cardIndex)
      if (!Number.isNaN(idx)) activeIndex.value = idx
    },
    {
      root: null,
      rootMargin: OBSERVER_MARGIN,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  )

  for (const el of els) observer.observe(el)
}

function measureLastCard() {
  const lastEl = cardEls.value[cardEls.value.length - 1]
  if (lastEl) lastCardHeight.value = lastEl.offsetHeight
}

function setupCardResizeObserver() {
  cardResizeObserver?.disconnect()
  if (typeof ResizeObserver === 'undefined') return
  cardResizeObserver = new ResizeObserver(() => measureLastCard())
  for (const el of cardEls.value) {
    if (el) cardResizeObserver.observe(el)
  }
}

onMounted(() => {
  void nextTick(() => {
    setupObserver()
    measureLastCard()
    setupCardResizeObserver()
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  cardResizeObserver?.disconnect()
  cardResizeObserver = null
})

const badgeText = computed(() => `${activeIndex.value + 1}/${Math.max(1, props.cards.length)}`)

/**
 * Sticker-конфиг для каждой карточки. Координаты/размер взяты из Figma
 * (For Affiliates desktop 2653:1227, mobile 3861:19073).
 *
 * Поворот стикера НЕ задаётся здесь: PNG-файлы экспортированы из Figma
 * уже с применённым rotation, любая попытка крутить их в CSS поверх
 * сделает только хуже.
 *
 * Значения прокидываются в шаблон через CSS-vars (`--st-*`), которые
 * читает `.wyg-card__sticker` ниже. Это позволяет описывать параметры
 * в одном месте, табличкой, и не плодить 5 BEM-модификаторов с
 * дублирующими свойствами.
 */
interface StickerConfig {
  src: string
  alt: string
  /** Размер на desktop (px). */
  size: number
  /** Размер на mobile (px). */
  sizeMobile: number
  /** Offset top desktop (px). */
  top: number
  /** Offset right desktop (px). */
  right: number
  topMobile: number
  rightMobile: number
}

const STICKER_CONFIG: Record<string, StickerConfig> = {
  hub: {
    src: '/images/affiliates/card-1-bubbles.png',
    alt: 'Makeberry Hub',
    size: 200,
    sizeMobile: 100,
    top: -81,
    right: -81,
    topMobile: -45,
    rightMobile: -25,
  },
  analytics: {
    src: '/images/affiliates/card-2-pie.png',
    alt: 'Analytics',
    size: 150,
    sizeMobile: 100,
    top: -94,
    right: -94,
    topMobile: -51,
    rightMobile: -7,
  },
  exclusive: {
    src: '/images/affiliates/card-3-ball.png',
    alt: 'Exclusive offers',
    size: 200,
    sizeMobile: 110,
    top: -147,
    right: -122,
    topMobile: -80,
    rightMobile: -40,
  },
  infrastructure: {
    src: '/images/affiliates/card-4-blocks.png',
    alt: 'Infrastructure',
    size: 150,
    sizeMobile: 100,
    top: -70,
    right: -75,
    topMobile: -45,
    rightMobile: -10,
  },
  manager: {
    src: '/images/affiliates/card-5-megaphone.png',
    alt: 'Dedicated manager',
    size: 150,
    sizeMobile: 100,
    top: -76,
    right: -61,
    topMobile: -50,
    rightMobile: -10,
  },
}

function stickerFor(card: WhatYouGetCard): StickerConfig | null {
  return card.stickerKey ? (STICKER_CONFIG[card.stickerKey] ?? null) : null
}

function stickerStyle(s: StickerConfig): Record<string, string> {
  return {
    '--st-w': `${s.size}px`,
    '--st-h': `${s.size}px`,
    '--st-top': `${s.top}px`,
    '--st-right': `${s.right}px`,
    '--st-w-m': `${s.sizeMobile}px`,
    '--st-h-m': `${s.sizeMobile}px`,
    '--st-top-m': `${s.topMobile}px`,
    '--st-right-m': `${s.rightMobile}px`,
  }
}
</script>

<template>
  <section
    class="wyg"
    data-section="what-you-get"
    :aria-label="title"
    :style="{ '--wyg-last-card-h': `${lastCardHeight}px` }"
  >
    <div class="wyg__inner">
      <header class="wyg__rail">
        <div class="wyg__heading">
          <h2 class="wyg__title">{{ title }}</h2>
          <span class="wyg__badge" aria-live="polite" aria-atomic="true">
            {{ badgeText }}
          </span>
        </div>
      </header>

      <div class="wyg__cards" role="list">
        <article
          v-for="(card, index) in cards"
          :key="card.id"
          :ref="el => bindCardRef(el, index)"
          class="wyg-card"
          role="listitem"
          :data-card-index="index"
        >
          <template v-if="stickerFor(card)">
            <div
              class="wyg-card__sticker"
              :style="stickerStyle(stickerFor(card)!)"
              aria-hidden="true"
            >
              <img
                :src="stickerFor(card)!.src"
                :alt="stickerFor(card)!.alt"
                loading="lazy"
                decoding="async"
              />
            </div>
          </template>

          <header class="wyg-card__header">
            <h3 class="wyg-card__title">{{ card.title }}</h3>
          </header>

          <div class="wyg-card__divider" aria-hidden="true" />

          <div class="wyg-card__content">
            <template v-for="(block, bi) in card.blocks" :key="bi">
              <p
                v-if="block.type === 'paragraph'"
                class="wyg-card__paragraph"
                v-html="block.html"
              />
              <ul v-else class="wyg-card__list">
                <li v-for="(item, ii) in block.items" :key="ii">{{ item }}</li>
              </ul>
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 *
 * Mobile  (Figma 3861:19073): bg-page, px 16 / py 70.
 * Desktop (Figma 2653:1227):  bg-page, px 160 / py 100.
 * `overflow-x: clip` — стикеры карточек выходят за правый край,
 * и без clip появлялся бы горизонтальный скролл.
 * ============================================================ */
.wyg {
  position: relative;
  background-color: var(--color-bg-page);
  overflow-x: clip;
  padding: to-rem(70) var(--container-pad-mobile);

  @include mq($from: tablet) {
    padding: to-rem(100) var(--container-pad-desktop);
  }

  @include mq($from: desktop) {
    padding: to-rem(100) to-rem(160);
  }
}

.wyg__inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: to-rem(60);

  @include mq($from: tablet) {
    display: grid;
    grid-template-columns: 1fr to-rem(460);
    gap: to-rem(70);
    align-items: start;
  }
}

/* ============================================================
 * Title rail
 *
 * Sticky к `--header-offset` + воздух (чтобы не наезжать на нижний
 * край floating-хедера). Значение `70` подобрано визуально под макет.
 *
 * Чтобы заголовок отлипал не в самом конце секции, а в момент,
 * когда верх ПОСЛЕДНЕЙ карточки поравнялся со sticky-top (и потом
 * ехал вверх вместе с ней) — задаём `min-height = высоте последней
 * карточки`. Высота приходит из JS через CSS-var `--wyg-last-card-h`
 * (см. `measureLastCard()` в скрипте).
 *
 * Математика sticky-удержания:
 *   scroll_отлипания = parent.height − top − ownHeight
 * При ownHeight = lastCardHeight отлипание происходит ровно когда
 * верх последней карточки достиг sticky-top.
 * ============================================================ */
.wyg__rail {
  @include mq($from: tablet) {
    position: sticky;
    top: calc(var(--header-offset) + #{to-rem(70)});
    align-self: start;
    z-index: 1;
    min-height: var(--wyg-last-card-h, 0);
  }
}

.wyg__heading {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  text-align: center;
  justify-content: center;
  width: 100%;

  @include mq($from: tablet) {
    display: block;
    text-align: left;
    width: auto;
  }
}

/* На mobile — 36/40 medium (как font-section-title, но без центрирования
 * через миксин: рядом стоит inline-бейдж). На desktop — Headline/H3. */
.wyg__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    @include font-h3;
  }
}

/* Badge (Figma 2696:2141): bg-surface + 2px brand pink, pill,
 * padding 16/8, текст 18/24 semibold white, rotate 10°.
 * Desktop: абсолютом приклеен к правому-верхнему углу заголовка
 * (как в макете «What You Get [1/5]»). Mobile: inline после h2. */
.wyg__badge {
  display: none;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(16);
  margin-left: to-rem(12);
  background-color: var(--color-bg-surface);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(16);
  line-height: to-rem(20);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  white-space: nowrap;
  rotate: 10deg;
  transform-origin: center;

  @include mq($from: tablet) {
    position: absolute;
    top: to-rem(-25);
    /* Положение из Figma (badge x=357 при title 590px шириной). */
    left: to-rem(357);
    display: inline-flex;
    margin-left: 0;
    font-size: to-rem(18);
    line-height: to-rem(24);
  }
}

/* ============================================================
 * Cards stack
 *
 * Обычный column-flex с gap. Карточки идут одна за другой и
 * скроллятся в потоке. Никаких sticky/pin-эффектов на карточках.
 * Mobile gap 60 (Figma 3861:19073), desktop тот же 60 — компактно
 * и аккуратно, заголовок остаётся sticky пока скроллим список.
 * ============================================================ */
.wyg__cards {
  display: flex;
  flex-direction: column;
  gap: to-rem(80);
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  @include mq($from: tablet) {
    width: to-rem(460);
    gap: to-rem(200);
  }
}

/* ============================================================
 * Card
 * ============================================================ */
.wyg-card {
  position: relative;
  margin: 0;
  width: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  /* Стикеры выходят за пределы карточки. */
  overflow: visible;
  display: flex;
  flex-direction: column;
}

.wyg-card__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: to-rem(24);
}

.wyg-card__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Mobile (Figma 3861:19079): 24/32, -0.01em */
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    /* Desktop (Figma 2653:1240): Headline/H4 32/40 */
    @include font-h4;
  }
}

.wyg-card__divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-border-subtle);
}

.wyg-card__content {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  padding: to-rem(24);
}

.wyg-card__paragraph {
  margin: 0;
  @include font-body-s-regular;
  color: var(--color-text-secondary);
}

.wyg-card__list {
  margin: 0;
  padding-inline-start: to-rem(24);
  list-style: disc;
  display: flex;
  flex-direction: column;
  gap: to-rem(4);
  color: var(--color-text-secondary);

  li {
    @include font-body-s-regular;
    color: var(--color-text-secondary);
  }
}

/* ============================================================
 * Sticker (3D illustration)
 *
 * Координаты/размер приходят из компонента через CSS-vars
 * (`--st-*` для desktop, `--st-*-m` для mobile), поэтому верстка
 * одна на все 5 карточек, а уникальные параметры — в `STICKER_CONFIG`.
 *
 * Поворот сюда не приходит: PNG экспортированы из Figma уже
 * повёрнутыми, дополнительный rotate в CSS будет его дублировать.
 * ============================================================ */
.wyg-card__sticker {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  width: var(--st-w-m);
  height: var(--st-h-m);
  top: var(--st-top-m);
  right: var(--st-right-m);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @include mq($from: tablet) {
    width: var(--st-w);
    height: var(--st-h);
    top: var(--st-top);
    right: var(--st-right);
  }
}
</style>
