<script setup lang="ts">
import { nextTick } from 'vue'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_MOBILE_PX, BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { useHomeMeetUs, useSharedUi } from '@/composables/useContent'

const content = useHomeMeetUs()
const ui = useSharedUi()

/** &lt; mobile: 1; mobile–tablet: 2; ≥ tablet: 3 (числа — min-width, как в SCSS `mq`) */
const meetUsSwiperBreakpoints = {
  [BREAKPOINT_MOBILE_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 16,
  },
  [BREAKPOINT_TABLET_PX]: {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 20,
  },
}

function onMeetUsSwiper(swiper: SwiperInstance) {
  /* После mount иногда нужен повторный расчёт ширины слайдов (breakpoints). */
  nextTick(() => {
    swiper.updateSize()
    swiper.updateSlides()
  })
}

const navConfig = {
  prevEl: '.home-meet-us__nav--prev',
  nextEl: '.home-meet-us__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}
</script>

<template>
  <section id="meet-us" class="home-meet-us" data-section="meet-us">
    <div class="home-meet-us__inner">
      <h2 class="home-meet-us__title">{{ content.title }}</h2>

      <div class="home-meet-us__slider-wrap">
        <Swiper
          class="home-meet-us__swiper"
          :modules="[Navigation, Pagination, A11y]"
          breakpoints-base="window"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :navigation="navConfig"
          :pagination="{ clickable: true, el: '.home-meet-us__pagination' }"
          :breakpoints="meetUsSwiperBreakpoints"
          @swiper="onMeetUsSwiper"
        >
          <SwiperSlide v-for="event in content.items" :key="event.id" class="home-meet-us__slide">
            <article class="home-meet-us__card">
              <div class="home-meet-us__cover" :style="{ backgroundColor: event.bgColor }">
                <img
                  :src="event.logoSrc"
                  :alt="event.logoAlt ?? event.name"
                  class="home-meet-us__logo"
                  :width="event.logoWidth"
                  :height="event.logoHeight"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div class="home-meet-us__body">
                <h3 class="home-meet-us__event-name">{{ event.name }}</h3>
                <ul class="home-meet-us__tags">
                  <li
                    v-for="(tag, idx) in event.tags"
                    :key="idx"
                    class="home-meet-us__tag"
                    :class="{ 'home-meet-us__tag--outlined': tag.outlined }"
                  >
                    {{ tag.label }}
                  </li>
                </ul>
              </div>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          type="button"
          class="home-meet-us__nav home-meet-us__nav--prev"
          :aria-label="ui.aria.eventsPrev"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-meet-us__nav home-meet-us__nav--next"
          :aria-label="ui.aria.eventsNext"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div class="home-meet-us__pagination"></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-meet-us {
  position: relative;

  @include section-padding(to-rem(60));
}

.home-meet-us__inner {
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center);
}

.home-meet-us__title {
  @include font-section-title;
}

/* <768: viewport bleed; 768+: контейнер; ≥1280: padding под стрелки. */
.home-meet-us__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  @include slider-wrap-bleed();
}

.home-meet-us__swiper {
  width: 100%;
  box-sizing: border-box;

  @include slider-swiper-bleed-phone();
}

:deep(.swiper-wrapper) {
  display: flex;
}

/* Ширину задаёт Swiper (1 / 2 / 3); min-height = 416 по Figma 2819:2055. */
.home-meet-us__slide {
  height: auto;
  min-height: to-rem(416);
  display: flex;
}

/* overflow: hidden нужен, чтобы цветной фон cover'а скруглялся по карточке. */
.home-meet-us__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.home-meet-us__cover {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  height: to-rem(200);
}

.home-meet-us__logo {
  display: block;
  max-width: 80%;
  max-height: 70%;
  object-fit: contain;
}

.home-meet-us__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  padding: to-rem(24);
  flex: 1 1 auto;
  min-height: 0;
}

.home-meet-us__event-name {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  white-space: pre-wrap;

  @include mq($from: tablet) {
    @include font-h4;
  }
}

.home-meet-us__tags {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: to-rem(8);
  width: 100%;
}

/* Outlined-вариант (для "Stand X") — прозрачный фон + жёсткая рамка. */
.home-meet-us__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(12);
  background-color: var(--color-bg-subtle);
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.home-meet-us__tag--outlined {
  background-color: transparent;
  border-color: var(--color-border-bold);
}

/* Стрелки только ≥ wide (под них у slider-wrap есть padding-inline);
 * на 1024–1279 их прячем — там full-bleed + dots/swipe. */
.home-meet-us__nav {
  display: none;
  align-items: center;
  justify-content: center;
  width: to-rem(40);
  height: to-rem(40);
  padding: to-rem(8);
  border: none;
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-icon-primary);
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  @include mq($from: wide) {
    display: inline-flex;
    position: absolute;
    /* Центрируем по cover (image-area 200h) — стрелки на уровне лого. */
    top: calc(#{to-rem(200)} / 2);
    transform: translateY(-50%);
    z-index: 2;
  }

  &:hover:not(.is-disabled):not(.is-locked) {
    background-color: var(--color-bg-hovered);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &.is-disabled {
    background-color: var(--color-bg-disabled);
    color: var(--color-icon-disabled);
    cursor: not-allowed;
  }

  /* watchOverflow: всё умещается → прячем стрелки */
  &.is-locked {
    display: none;
  }
}

.home-meet-us__nav--prev {
  @include mq($from: wide) {
    left: 0;
  }
}

.home-meet-us__nav--next {
  @include mq($from: wide) {
    right: 0;
  }
}

.home-meet-us__pagination {
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
