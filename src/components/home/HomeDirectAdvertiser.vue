<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeDirectAdvertiser } from '@/composables/useContent'

const content = useHomeDirectAdvertiser()

const navConfig = {
  prevEl: '.home-direct__nav--prev',
  nextEl: '.home-direct__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}
</script>

<template>
  <section
    id="direct-advertiser"
    class="home-direct"
    data-section="direct-advertiser"
  >
    <img
      :src="content.glow.src"
      :alt="content.glow.alt"
      class="home-direct__glow"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />

    <div class="home-direct__inner">
      <h2 class="home-direct__title">{{ content.title }}</h2>

      <div class="home-direct__slider-wrap">
        <Swiper
          class="home-direct__swiper"
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="16"
          :watch-overflow="true"
          :navigation="navConfig"
          :pagination="{ clickable: true, el: '.home-direct__pagination' }"
          :breakpoints="{
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 20,
            },
          }"
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
          aria-label="Previous partners"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-direct__nav home-direct__nav--next"
          aria-label="Next partners"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div class="home-direct__pagination" aria-hidden="true"></div>
      </div>

      <ul class="home-direct__cooperation">
        <li
          v-for="model in content.cooperation"
          :key="model.id"
          class="home-direct__model"
        >
          <div class="home-direct__model-pill">
            <span class="home-direct__model-title">{{ model.title }}</span>
          </div>
          <p class="home-direct__model-desc">{{ model.description }}</p>
        </li>
      </ul>

      <div class="home-direct__cta">
        <p class="home-direct__cta-title">{{ content.cta.title }}</p>
        <BaseButton
          variant="secondary"
          size="large"
          :to="content.cta.button.path"
        >
          {{ content.cta.button.label }}
        </BaseButton>
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
 * Mobile (Figma 360 — py 70 / px 16 / column / gap 48)
 * Desktop (Figma 1440 — py 100 / px 60 / column / gap 70)
 * ============================================================ */
.home-direct {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: var(--color-bg-page);
  padding: to-rem(70) to-rem(16);

  @include mq($from: mobile) {
    padding-inline: to-rem(32);
  }

  @include mq($from: tablet) {
    padding: to-rem(100) to-rem(60);
  }
}

/* ============================================================
 * Glow decoration — pink soft blob anchored to section top-left.
 * Координаты строго из Figma (left:-441 top:-80 956×625).
 * Section имеет overflow: hidden — на любом viewport обрежет лишнее.
 * ============================================================ */
.home-direct__glow {
  position: absolute;
  top: to-rem(-80);
  left: to-rem(-441);
  width: to-rem(956);
  height: to-rem(625);
  z-index: 0;
  pointer-events: none;
  user-select: none;
  object-fit: contain;
}

/* ============================================================
 * Inner stack
 * ============================================================ */
.home-direct__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);
  width: 100%;
  margin-inline: auto;

  @include mq($from: tablet) {
    gap: to-rem(70);
    max-width: to-rem(1320);
  }
}

/* ============================================================
 * Title — H3 56/64 (desktop) | 36/40 medium (mobile)
 * ============================================================ */
.home-direct__title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    @include font-h3;
  }
}

/* ============================================================
 * Slider wrap (relative for arrows positioning)
 * ============================================================ */
.home-direct__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: to-rem(20);

  @include mq($from: tablet) {
    padding-inline: to-rem(60); /* место под стрелки */
    gap: to-rem(32);
  }
}

.home-direct__swiper {
  width: 100%;
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
 * Slider arrows — desktop only, vertically centered, outside cards
 * Используем нативные <button> + Swiper Navigation модуль:
 * Swiper сам выставит is-disabled (на крайних слайдах) и
 * is-locked (когда слайдер не нуждается в перелистывании).
 * ============================================================ */
.home-direct__nav {
  display: none;

  @include mq($from: tablet) {
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
  @include mq($from: tablet) {
    left: 0;
  }
}

.home-direct__nav--next {
  @include mq($from: tablet) {
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
 * Cooperation models — outer surface card with pink-bordered pill
 * Mobile : column stack, gap 20
 * Desktop: 4 in row, equal width, gap 20, max-width 1200
 * ============================================================ */
.home-direct__cooperation {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(20);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;

  @include mq($from: tablet) {
    flex-direction: row;
    align-items: stretch;
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}

.home-direct__model {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: to-rem(44);

  @include mq($from: tablet) {
    flex: 1 0 0;
    min-width: 0;
  }
}

.home-direct__model-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(20);
  background-color: var(--color-bg-page);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

.home-direct__model-title {
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

.home-direct__model-desc {
  margin: 0;
  padding: to-rem(24);
  @include font-body-s-regular;
  color: var(--color-text-secondary);
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
