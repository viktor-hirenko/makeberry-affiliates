<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { WhatYouGetCard } from '@/types/content'
import { toRem } from '@/utils/units'

/**
 * Секция «What You Get» страницы-аудитории (Affiliates / Advertisers).
 *
 * Заголовок слева — sticky к --header-offset; карточки справа в потоке.
 * `min-height` rail'а = высоте последней карточки, поэтому sticky
 * отлипает ровно когда верх последней карточки достиг sticky-top
 * (см. measureLastCard + --wyg-last-card-h).
 *
 * Бейдж N/M обновляется через IntersectionObserver по пересечению
 * центра viewport.
 */
interface Props {
  title: string
  cards: WhatYouGetCard[]
}

const props = defineProps<Props>()

const activeIndex = ref(0)
const cardEls = ref<(HTMLElement | undefined)[]>([])
/** Высота последней карточки, прокидывается в --wyg-last-card-h
 * (см. min-height у .wyg__rail). */
const lastCardHeight = ref(0)

/** Узкая полоса по центру viewport: пересекающая её карточка = активная. */
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

/** Размеры/смещения стикера прокидываются в CSS-vars из card.sticker;
 * компонент остаётся универсальным, уникальные значения — в JSON. */
function cardStickerStyle(card: WhatYouGetCard): Record<string, string> {
  const sticker = card.sticker
  if (!sticker) return {}

  const vars: Record<string, string> = {
    '--st-w': toRem(sticker.desktop.size),
    '--st-h': toRem(sticker.desktop.size),
    '--st-top': toRem(sticker.desktop.top),
    '--st-right': toRem(sticker.desktop.right),
    '--st-w-m': toRem(sticker.mobile.size),
    '--st-h-m': toRem(sticker.mobile.size),
    '--st-top-m': toRem(sticker.mobile.top),
    '--st-right-m': toRem(sticker.mobile.right),
  }

  if (typeof card.stickerRotateDeg === 'number') {
    vars['--st-rotate'] = `${card.stickerRotateDeg}deg`
  }

  return vars
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
          <div
            v-if="card.sticker"
            class="wyg-card__sticker"
            :style="cardStickerStyle(card)"
            aria-hidden="true"
          >
            <img :src="card.sticker.src" :alt="card.sticker.alt" loading="lazy" decoding="async" />
          </div>

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
@use '@/assets/styles/scss/mixins' as *;

.wyg {
  position: relative;
  overflow-x: clip;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $desktop-top: to-rem(160),
    $desktop-bottom: to-rem(160)
  );
}

.wyg__inner {
  display: flex;
  flex-direction: column;
  gap: to-rem(60);

  @include container(var(--container-xl));

  @include mq($from: tablet) {
    display: grid;
    grid-template-columns: 1fr to-rem(460);
    gap: to-rem(70);
    align-items: start;
  }
}

/* Sticky к --header-offset + 70px воздуха.
 * min-height = высоте последней карточки даёт отлипание ровно когда
 * верх последней карточки доходит до sticky-top:
 * scroll_отлипания = parent.height − top − ownHeight. */
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

/* На mobile font-size задаётся вручную (рядом с h2 inline-бейдж,
 * font-section-title центрирует — не подходит). */
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

/* Badge N/M. Mobile: inline после h2;
 * desktop: абсолютом к правому-верхнему углу заголовка. */
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
    left: to-rem(357);
    display: inline-flex;
    margin-left: 0;
    font-size: to-rem(18);
    line-height: to-rem(24);
  }
}

.wyg__cards {
  display: flex;
  flex-direction: column;
  gap: to-rem(80);
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;

  @include mq($from: mobile) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: to-rem(20);
    row-gap: to-rem(80);
  }

  @include mq($from: tablet) {
    display: flex;
    width: to-rem(460);
    gap: to-rem(200);
  }
}

.wyg-card {
  position: relative;
  margin: 0;
  width: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  /* Стикеры выходят за пределы карточки → overflow: visible. */
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
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
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

/* Координаты/размер из --st-* (desktop) / --st-*-m (mobile);
 * опциональный поворот через --st-rotate (см. cardStickerStyle). */
.wyg-card__sticker {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  user-select: none;
  width: var(--st-w-m);
  height: var(--st-h-m);
  top: var(--st-top-m);
  right: var(--st-right-m);
  transform: rotate(var(--st-rotate, 0deg));

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @include mq($from: wide) {
    width: var(--st-w);
    height: var(--st-h);
    top: var(--st-top);
    right: var(--st-right);
  }
}
</style>
