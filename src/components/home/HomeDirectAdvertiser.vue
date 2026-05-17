<script setup lang="ts">
import { nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_MOBILE_PX, BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { useHomeDirectAdvertiser, useSharedUi } from '@/composables/useContent'

const content = useHomeDirectAdvertiser()
const ui = useSharedUi()

function isInternalRoute(href: string): boolean {
  return href.startsWith('/')
}

const isProtocolLink = (href: string) => /^(mailto:|tel:)/i.test(href)

function cardComponent(href: string | undefined, isPlaceholder: boolean | undefined) {
  if (!href || isPlaceholder) return 'div'
  return isInternalRoute(href) ? RouterLink : 'a'
}

function cardAttrs(href: string | undefined, isPlaceholder: boolean | undefined) {
  if (!href || isPlaceholder) return {}
  if (isInternalRoute(href)) return { to: href }
  return {
    href,
    target: isProtocolLink(href) ? undefined : '_blank',
    rel: isProtocolLink(href) ? undefined : 'noopener noreferrer',
  }
}

/**
 * Swiper breakpoints (min-width):
 * - &lt;768px: 1 слайд
 * - 768–1023px: 2 слайда
 * - ≥1024px: 4 слайда
 */
const directSwiperBreakpoints = {
  [BREAKPOINT_MOBILE_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 16,
  },
  [BREAKPOINT_TABLET_PX]: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 20,
  },
}

function onDirectSwiper(swiper: SwiperInstance) {
  nextTick(() => {
    swiper.updateSize()
    swiper.updateSlides()
  })
}

const navConfig = {
  prevEl: '.home-direct__nav--prev',
  nextEl: '.home-direct__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}
</script>

<template>
  <section id="direct-advertiser" class="home-direct" data-section="direct-advertiser">
    <div class="home-direct__inner">
      <img
        :src="content.glow.src"
        :alt="content.glow.alt"
        class="home-direct__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-direct__title">{{ content.title }}</h2>

      <div class="home-direct__slider-wrap">
        <Swiper
          class="home-direct__swiper"
          :modules="[Navigation, Pagination]"
          breakpoints-base="window"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :navigation="navConfig"
          :pagination="{ clickable: true, el: '.home-direct__pagination' }"
          :breakpoints="directSwiperBreakpoints"
          @swiper="onDirectSwiper"
        >
          <SwiperSlide
            v-for="partner in content.partners"
            :key="partner.id"
            class="home-direct__slide"
          >
            <component
              :is="cardComponent(partner.href, partner.isPlaceholder)"
              v-bind="cardAttrs(partner.href, partner.isPlaceholder)"
              class="home-direct__card"
              :class="{ 'home-direct__card--empty': partner.isPlaceholder }"
            >
              <template v-if="partner.isPlaceholder">
                <div class="home-direct__placeholder">
                  <span class="home-direct__placeholder-icon" aria-hidden="true">
                    <BaseIcon name="plus" :size="24" />
                  </span>
                  <p class="home-direct__placeholder-text">
                    {{ partner.placeholderLabel ?? partner.name }}
                  </p>
                </div>
              </template>
              <template v-else>
                <img
                  v-if="partner.logoSrc"
                  :src="partner.logoSrc"
                  :alt="partner.logoAlt ?? partner.name"
                  class="home-direct__logo"
                  loading="lazy"
                  decoding="async"
                />
                <span v-else class="home-direct__logo-fallback">{{ partner.name }}</span>
              </template>
            </component>
          </SwiperSlide>
        </Swiper>

        <button
          type="button"
          class="home-direct__nav home-direct__nav--prev"
          :aria-label="ui.aria.partnersPrev"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-direct__nav home-direct__nav--next"
          :aria-label="ui.aria.partnersNext"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div class="home-direct__pagination" aria-hidden="true"></div>
      </div>

      <ul class="home-direct__cooperation">
        <PillHeaderCard
          v-for="model in content.cooperation"
          :key="model.id"
          :title="model.title"
        >
          <p>{{ model.description }}</p>
        </PillHeaderCard>
      </ul>

      <div class="home-direct__cta">
        <p class="home-direct__cta-title">{{ content.cta.title }}</p>
        <BaseButton
          variant="secondary"
          size="large"
          :to="content.cta.button.path"
          class="home-direct__cta-btn"
        >
          {{ content.cta.button.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-direct {
  position: relative;
  isolation: isolate;

  @include section-padding;
}

.home-direct__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-inline: auto;
  @include section-stack($align: center);

  @include mq($from: tablet) {
    max-width: to-rem(1320);
  }
}

.home-direct__glow {
  position: absolute;
  top: to-rem(-180);
  left: to-rem(-410);
  width: to-rem(956);
  max-width: unset;
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  @include mq($from: tablet) {
    left: to-rem(-521);
  }
}

.home-direct__title {
  @include font-section-title;
}

/* <1024px: full-bleed (negative margin на wrap + padding-inline на swiper);
 * ≥1280px: padding-inline под стрелки (см. __nav). */
.home-direct__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: to-rem(20);

  @include mq($until: tablet) {
    margin-inline: calc(-1 * var(--container-pad-x));
    width: calc(100% + 2 * var(--container-pad-x));
  }

  @include mq($from: wide) {
    padding-inline: var(--container-pad-x);
    gap: to-rem(32);
  }
}

.home-direct__swiper {
  width: 100%;
  box-sizing: border-box;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-x);
  }
}

.home-direct__slide {
  height: auto;
}

.home-direct__card {
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
  cursor: pointer;
  transition:
    background var(--transition-base),
    border-color var(--transition-base);

  /* Figma CSS-экспорт даёт только крайние стопы и теряет розовый
   * блик в центре — добавляем средний стоп вручную. */
  &:hover {
    @media (hover: hover) and (pointer: fine) {
      background-image: linear-gradient(
        334deg,
        rgba(251, 0, 109, 0) -4.68%,
        rgba(251, 0, 109, 0.55) 45%,
        #000 98.47%
      );
    }
  }
  &:focus-visible {
    background-image: linear-gradient(
      334deg,
      rgba(251, 0, 109, 0) -4.68%,
      rgba(251, 0, 109, 0.55) 45%,
      #000 98.47%
    );
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

.home-direct__card--empty {
  background-color: transparent;
  cursor: default;

  &:hover,
  &:focus-visible {
    background-image: none;
    background-color: transparent;
  }

  &:focus-visible {
    outline: none;
  }
}

.home-direct__logo {
  display: block;
  max-width: 100%;
  max-height: to-rem(75);
  object-fit: contain;
}

.home-direct__logo-fallback {
  @include font-h5;
  color: var(--color-text-primary);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.home-direct__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(12);
  text-align: center;
}

.home-direct__placeholder-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: to-rem(56);
  height: to-rem(56);
  padding: to-rem(16);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-icon-primary);
}

.home-direct__placeholder-text {
  margin: 0;
  max-width: to-rem(130);
  @include font-body-s-regular;
  color: var(--color-text-tertiary);
}

/* Стрелки только ≥ wide; на 1024–1279 — swipe + dots. */
.home-direct__nav {
  display: none;

  @include mq($from: wide) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: to-rem(40);
    height: to-rem(40);
    padding: 0;
    border: none;
    border-radius: var(--radius-pill);
    background-color: var(--color-bg-subtle);
    color: var(--color-icon-primary);
    cursor: pointer;
    position: absolute;
    top: calc(#{to-rem(200)} / 2);
    transform: translateY(-50%);
    z-index: 2;
    transition:
      background-color var(--transition-base),
      color var(--transition-base);

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

    /* watchOverflow: всё умещается → прячем стрелки совсем */
    &.is-locked {
      display: none;
    }
  }
}

.home-direct__nav--prev {
  @include mq($from: wide) {
    left: 0;
  }
}

.home-direct__nav--next {
  @include mq($from: wide) {
    right: 0;
  }
}

.home-direct__pagination {
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

/* Сетка зеркалит `.casino-coop__grid`: 1 / 2 / 4 колонки. */
.home-direct__cooperation {
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(20);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}

.home-direct__cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(24);
  width: 100%;
}

.home-direct__cta-title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    @include font-h4;
  }
}
</style>
