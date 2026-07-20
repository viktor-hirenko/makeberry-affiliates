<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Pagination, A11y } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/pagination'

import BaseButton from '@/components/ui/BaseButton.vue'
import { BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { swiperTwoColumnBreakpoints } from '@/constants/swiper'
import { useHomeAwards } from '@/composables/useContent'
import type { HomeAwardCard } from '@/types/content'

const content = useHomeAwards()

/* Ниже tablet (1024) — Swiper, начиная с tablet — CSS-сетка 4-в-ряд.
 * Совпадает с границей переключения слайдер/сетка у HomePartners. */
const SLIDER_QUERY = `(max-width: ${BREAKPOINT_TABLET_PX - 0.02}px)`

const isSlider = ref(false)
const expanded = ref(false)

let mql: MediaQueryList | null = null

function onQueryChange(event: MediaQueryListEvent | MediaQueryList): void {
  isSlider.value = event.matches
}

onMounted(() => {
  mql = window.matchMedia(SLIDER_QUERY)
  onQueryChange(mql)
  mql.addEventListener('change', onQueryChange)
})

onUnmounted(() => {
  mql?.removeEventListener('change', onQueryChange)
})

/** Кнопка нужна только в сетке и только если карточек больше стартовых. */
const hasMore = computed(() => content.items.length > content.initialCount)

/** В слайдере показываем все; в сетке — до initialCount, пока не раскрыто. */
const gridItems = computed<HomeAwardCard[]>(() =>
  expanded.value ? content.items : content.items.slice(0, content.initialCount),
)

const toggleLabel = computed(() =>
  expanded.value ? content.viewLessLabel : content.viewMoreLabel,
)

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function cardComponent(href: string | undefined): 'a' | 'article' {
  return href ? 'a' : 'article'
}

function cardAttrs(href: string | undefined): Record<string, string> {
  if (!href) return {}
  return isExternal(href)
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }
}

function onAwardsSwiper(swiper: SwiperInstance): void {
  nextTick(() => {
    swiper.updateSize()
    swiper.updateSlides()
  })
}
</script>

<template>
  <section id="awards" class="home-awards" data-section="awards">
    <div class="home-awards__inner">
      <picture class="home-awards__glow" aria-hidden="true">
        <source media="(min-width: 1024px)" :srcset="content.glow.src" />
        <img
          :src="content.glow.mobileSrc"
          :alt="content.glow.alt"
          loading="lazy"
          decoding="async"
        />
      </picture>

      <h2 class="home-awards__title">{{ content.title }}</h2>

      <!-- <1024px: слайдер с точками -->
      <div v-if="isSlider" class="home-awards__slider-wrap">
        <Swiper
          class="home-awards__swiper"
          :modules="[Pagination, A11y]"
          breakpoints-base="window"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :pagination="{ clickable: true, el: '.home-awards__pagination' }"
          :breakpoints="swiperTwoColumnBreakpoints"
          @swiper="onAwardsSwiper"
        >
          <SwiperSlide v-for="award in content.items" :key="award.id" class="home-awards__slide">
            <component
              :is="cardComponent(award.href)"
              v-bind="cardAttrs(award.href)"
              class="home-awards__card"
            >
              <img
                :src="award.imageSrc"
                :alt="award.imageAlt"
                class="home-awards__image"
                loading="lazy"
                decoding="async"
              />
              <span class="home-awards__vignette" aria-hidden="true"></span>
            </component>
          </SwiperSlide>
        </Swiper>

        <div class="home-awards__pagination" aria-hidden="true"></div>
      </div>

      <!-- ≥1024px: сетка 4-в-ряд + View More -->
      <template v-else>
        <ul class="home-awards__grid" role="list">
          <li v-for="award in gridItems" :key="award.id" class="home-awards__grid-item">
            <component
              :is="cardComponent(award.href)"
              v-bind="cardAttrs(award.href)"
              class="home-awards__card"
            >
              <img
                :src="award.imageSrc"
                :alt="award.imageAlt"
                class="home-awards__image"
                loading="lazy"
                decoding="async"
              />
              <span class="home-awards__vignette" aria-hidden="true"></span>
            </component>
          </li>
        </ul>

        <BaseButton
          v-if="hasMore"
          variant="tetriary"
          class="home-awards__cta"
          analytics-location="home_awards"
          :analytics-label="toggleLabel"
          @click="expanded = !expanded"
        >
          {{ toggleLabel }}
        </BaseButton>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-awards {
  position: relative;
  overflow-x: clip;

  @include section-padding(to-rem(120));
}

/* Декоративный элемент (розовые дуги) — левая часть, за контентом.
 * Ассет экспортирован без поворота, угол/флип задаём через transform (см. HomeBlog__glow).
 * Лежит внутри `__inner` (не `.home-awards`), чтобы позиционироваться от центрированного
 * контейнера контента, а не от full-bleed секции — иначе на широких экранах "уезжает"
 * к краю вьюпорта вместо края карточек (см. HomeBenefits__glow / HomeContacts__glow). */
.home-awards__glow {
  position: absolute;
  z-index: 0;
  inset-block-start: to-rem(-273.42);
  inset-inline-start: to-rem(-418.33);
  width: to-rem(457.74);
  height: to-rem(858.79);
  max-width: unset;
  transform: rotate(-122.49deg);
  transform-origin: 50% 50%;
  pointer-events: none;
  user-select: none;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @include mq($from: tablet) {
    inset-block-start: to-rem(-350.35);
    inset-inline-start: to-rem(-588.06);
    width: to-rem(502.54);
    height: to-rem(1150.69);
  }
}

.home-awards__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center);
}

.home-awards__title {
  @include font-section-title;
}

/* <768: viewport bleed; 768-1023: контейнер. Слайдер живёт только <1024. */
.home-awards__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  @include slider-wrap-bleed();
}

.home-awards__swiper {
  width: 100%;
  box-sizing: border-box;

  @include slider-swiper-bleed-phone();
}

:deep(.swiper-wrapper) {
  display: flex;
}

.home-awards__slide {
  height: auto;
  display: flex;
}

/* Сетка 4-в-ряд (рендерится только ≥1024). */
.home-awards__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: to-rem(1200);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: to-rem(20);
}

.home-awards__grid-item {
  display: flex;
}

.home-awards__cta {
  align-self: center;
}

/* Карточка: фото-статуэтка на весь фон + двойной чёрный градиент-виньетка.
 * Рендерится как <a> при наличии href (см. cardComponent) — сбрасываем стили ссылки. */
.home-awards__card {
  position: relative;
  display: block;
  width: 100%;
  height: to-rem(200);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  background-color: var(--color-bg-surface);
  text-decoration: none;
  color: inherit;

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

.home-awards__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Двойная виньетка из макета (5032:12081..12084):
 * левый чёрный до 43% + нижний чёрный от 61%. */
.home-awards__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(87.73deg, rgb(0, 0, 0) 3.13%, rgba(0, 0, 0, 0) 43.13%),
    linear-gradient(90deg, rgba(0, 0, 0, 0) 60.88%, rgb(0, 0, 0) 110.35%);
}

.home-awards__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  width: 100%;

  :deep(.swiper-pagination-bullet) {
    width: to-rem(8);
    height: to-rem(8);
    margin: 0;
    background-color: var(--color-text-disabled);
    opacity: 1;
    border-radius: 50%;
    transition: background-color var(--transition-base);
    cursor: pointer;
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: var(--color-text-primary);
  }
}
</style>
