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
import { useHomePartners } from '@/composables/useContent'
import type { HomePartnerLogo } from '@/types/content'

const content = useHomePartners()

/* Ниже tablet (1024) — Swiper со слайдами, начиная с tablet — CSS-сетка 4-в-ряд.
 * Совпадает с границей переключения слайдер/сетка у остальных секций. */
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
const gridItems = computed<HomePartnerLogo[]>(() =>
  expanded.value ? content.items : content.items.slice(0, content.initialCount),
)

const toggleLabel = computed(() =>
  expanded.value ? content.viewLessLabel : content.viewMoreLabel,
)

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

function cardComponent(href: string | undefined): 'a' | 'div' {
  return href ? 'a' : 'div'
}

function cardAttrs(href: string | undefined): Record<string, string> {
  if (!href) return {}
  return isExternal(href)
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }
}

function onPartnersSwiper(swiper: SwiperInstance): void {
  nextTick(() => {
    swiper.updateSize()
    swiper.updateSlides()
  })
}
</script>

<template>
  <section id="partners" class="home-partners" data-section="partners">
    <div class="home-partners__inner">
      <h2 class="home-partners__title">{{ content.title }}</h2>

      <!-- <1024px: слайдер с точками -->
      <div v-if="isSlider" class="home-partners__slider-wrap">
        <Swiper
          class="home-partners__swiper"
          :modules="[Pagination, A11y]"
          breakpoints-base="window"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :pagination="{ clickable: true, el: '.home-partners__pagination' }"
          :breakpoints="swiperTwoColumnBreakpoints"
          @swiper="onPartnersSwiper"
        >
          <SwiperSlide
            v-for="partner in content.items"
            :key="partner.id"
            class="home-partners__slide"
          >
            <component
              :is="cardComponent(partner.href)"
              v-bind="cardAttrs(partner.href)"
              class="home-partners__card"
            >
              <div class="home-partners__logo-frame">
                <img
                  :src="partner.src"
                  :alt="partner.alt"
                  class="home-partners__logo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </component>
          </SwiperSlide>
        </Swiper>

        <div class="home-partners__pagination" aria-hidden="true"></div>
      </div>

      <!-- ≥1024px: сетка 4-в-ряд + View More -->
      <template v-else>
        <ul class="home-partners__grid" role="list">
          <li v-for="partner in gridItems" :key="partner.id" class="home-partners__grid-item">
            <component
              :is="cardComponent(partner.href)"
              v-bind="cardAttrs(partner.href)"
              class="home-partners__card"
            >
              <div class="home-partners__logo-frame">
                <img
                  :src="partner.src"
                  :alt="partner.alt"
                  class="home-partners__logo"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </component>
          </li>
        </ul>

        <BaseButton
          v-if="hasMore"
          variant="tetriary"
          class="home-partners__cta"
          analytics-location="home_partners"
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

.home-partners {
  position: relative;
  overflow-x: clip;

  @include section-padding(to-rem(120));
}

.home-partners__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center);
}

.home-partners__title {
  @include font-section-title;
}

/* <768: viewport bleed; 768–1023: контейнер. Слайдер живёт только <1024. */
.home-partners__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  @include slider-wrap-bleed();
}

.home-partners__swiper {
  width: 100%;
  box-sizing: border-box;

  @include slider-swiper-bleed-phone();
}

:deep(.swiper-wrapper) {
  display: flex;
}

.home-partners__slide {
  height: auto;
  display: flex;
}

/* Сетка 4-в-ряд (рендерится только ≥1024). */
.home-partners__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: to-rem(1200);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: to-rem(20);
}

.home-partners__grid-item {
  display: flex;
}

.home-partners__card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: to-rem(200);
  padding: to-rem(40);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--transition-base);

  &:hover {
    border-color: var(--color-border-default);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

.home-partners__logo-frame {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, #{to-rem(202)});
  height: to-rem(90);
  margin-inline: auto;
  flex-shrink: 0;
}

.home-partners__logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-partners__cta {
  align-self: center;
}

.home-partners__pagination {
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
