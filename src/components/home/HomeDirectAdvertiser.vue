<script setup lang="ts">
import { nextTick } from 'vue'
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

/** &lt; mobile: 1; mobile–tablet: 2; ≥ tablet: 4 */
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
              :is="partner.href && !partner.isPlaceholder ? 'a' : 'div'"
              :href="partner.href && !partner.isPlaceholder ? partner.href : undefined"
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
        <BaseButton variant="secondary" size="large" :href="content.cta.button.path">
          {{ content.cta.button.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile (Figma 360 — py 70 / px 16 / column / gap 48)
 * Desktop (Figma 1440 — py 100 / px 60 / column / gap 70)
 * ============================================================ */
.home-direct {
  position: relative;
  isolation: isolate;

  @include section-padding;
  /*
   * Без overflow-x: свайпер full-bleed до tablet (как Testimonials).
   * Горизонталь страницы — body (main.scss).
   */
}

/* ============================================================
 * Inner stack
 * ============================================================ */
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

/* ============================================================
 * Title — H3 56/64 (desktop) | 36/40 medium (mobile)
 * ============================================================ */
.home-direct__title {
  @include font-section-title;
}

/* ============================================================
 * Slider wrap (relative for arrows positioning)
 * До tablet: full-bleed + инсет на swiper (как HomeTestimonials).
 * ============================================================ */
.home-direct__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: to-rem(20);

  /* Full-bleed: см. комментарий в HomeMeetUs. */
  @include mq($until: tablet) {
    margin-inline: calc(-1 * var(--container-pad-x));
    width: calc(100% + 2 * var(--container-pad-x));
  }

  @include mq($from: wide) {
    padding-inline: var(--container-pad-x); /* место под стрелки на ≥1280 */
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

/* ============================================================
 * Partner card
 * Default — bg-surface gray, border-subtle.
 * Hover — pink-to-black diagonal gradient overlay (per Figma WinSpirit).
 * Empty (placeholder) — no bg, plus icon inside, без hover-градиента.
 * ============================================================ */
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

  /* Hover: Figma fill.
   * Figma CSS-экспорт даёт только крайние стопы:
   *   linear-gradient(334deg, rgba(251,0,109,0) -4.68%, #000 98.47%)
   * — но визуально это transparent → #000 поверх surface #141414
   *   (разница ~20 единиц на серой шкале — практически невидимо).
   * Эффект на Figma-mockup'е содержит явный розовый блик, поэтому
   * добавляем средний стоп с pink (Figma часто опускает middle stops в CSS-экспорте). */
  &:hover,
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

/* ============================================================
 * Logo / placeholder
 * Figma: лого до 75px высоты, object-fit: contain.
 * ============================================================ */
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

/* Placeholder card: subtle round button (56×56, p-16) + caption ниже, gap 12 */
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

/* ============================================================
 * Slider arrows — появляются с ≥1280 (wide), когда у slider-wrap
 * есть место под padding-inline=60. На 1024-1279 — только swipe + dots.
 * ============================================================ */
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

/* ============================================================
 * Pagination — Swiper bullets
 * ============================================================ */
.home-direct__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  width: 100%;

  /* Стили буллетов через :deep — Swiper рендерит .swiper-pagination-bullet */
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

/* ============================================================
 * Cooperation models — как `.casino-coop__grid` (CasinoCooperation.vue):
 * mobile : 1 колонка
 * tablet : 2 колонки (2×2 для четырёх карточек)
 * desktop: 4 колонки, max-width 1200 по центру
 * ============================================================ */
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

/* ============================================================
 * CTA — "Ready to start?" + button (white/secondary)
 * ============================================================ */
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
