<script setup lang="ts">
import { computed, ref } from 'vue'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_MOBILE_PX, BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { useHomeContacts, useSharedUi } from '@/composables/useContent'

const content = useHomeContacts()
const ui = useSharedUi()

/**
 * Swiper breakpoints (числа = min-width):
 * - &lt; mobile: 1 слайд (узкий телефон)
 * - mobile–tablet: 2 слайда (раньше здесь был 1 слайд + max-width обёртки + fade)
 * - ≥ tablet: 4 слайда
 */
const contactsSwiperBreakpoints = {
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

/* ------------------------------------------------------------------
 * Swiper: см. contactsSwiperBreakpoints; только effect slide.
 * watch-overflow: навигация/пагинация лочатся, если нечего листать
 * ------------------------------------------------------------------ */
const navConfig = {
  prevEl: '.home-contacts__nav--prev',
  nextEl: '.home-contacts__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}

/* ------------------------------------------------------------------
 * Verify form state machine: idle | verified | error
 * Сравниваем нормализованный ввод с verifyTokens каждого контакта.
 * ------------------------------------------------------------------ */
type VerifyStatus = 'idle' | 'verified' | 'error'

const query = ref('')
const status = ref<VerifyStatus>('idle')

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

const allTokens = computed<Set<string>>(() => {
  const set = new Set<string>()
  for (const item of content.items) {
    for (const token of item.verifyTokens) {
      set.add(normalize(token))
    }
  }
  return set
})

function handleVerify() {
  const v = normalize(query.value)
  if (!v) {
    status.value = 'idle'
    return
  }
  status.value = allTokens.value.has(v) ? 'verified' : 'error'
}

function handleInput() {
  if (status.value !== 'idle') status.value = 'idle'
}
</script>

<template>
  <section id="contacts" class="home-contacts" data-section="contacts">
    <div class="home-contacts__inner">
      <img
        :src="content.glow.src"
        :alt="content.glow.alt"
        class="home-contacts__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-contacts__title">{{ content.title }}</h2>

      <div class="home-contacts__slider-wrap">
        <Swiper
          class="home-contacts__swiper"
          :modules="[Navigation, Pagination, A11y]"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :navigation="navConfig"
          :pagination="{ clickable: true, el: '.home-contacts__pagination' }"
          :breakpoints="contactsSwiperBreakpoints"
        >
          <SwiperSlide
            v-for="contact in content.items"
            :key="contact.id"
            class="home-contacts__slide"
          >
            <article class="contact-card">
              <div class="contact-card__photo">
                <img
                  :src="contact.photoSrc"
                  :alt="contact.photoAlt ?? contact.name"
                  :style="{ objectPosition: contact.photoObjectPosition ?? 'center' }"
                  class="contact-card__photo-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div class="contact-card__body">
                <div class="contact-card__info">
                  <h3 class="contact-card__name">{{ contact.name }}</h3>
                  <p class="contact-card__position">{{ contact.position }}</p>
                </div>

                <ul class="contact-card__socials">
                  <li
                    v-for="social in contact.socials"
                    :key="social.type"
                    class="contact-card__social-item"
                  >
                    <a
                      :href="social.href"
                      class="contact-card__social-btn"
                      :aria-label="`${contact.name} — ${social.label ?? social.type}`"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BaseIcon :name="social.type" :size="16" />
                    </a>
                  </li>
                </ul>
              </div>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          type="button"
          class="home-contacts__nav home-contacts__nav--prev"
          :aria-label="ui.aria.contactsPrev"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-contacts__nav home-contacts__nav--next"
          :aria-label="ui.aria.contactsNext"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div class="home-contacts__pagination" aria-hidden="true"></div>
      </div>

      <div class="home-contacts__form">
        <header class="home-contacts__form-header">
          <h3 class="home-contacts__form-title">{{ content.form.title }}</h3>
          <p class="home-contacts__form-subtitle">{{ content.form.subtitle }}</p>
        </header>

        <form class="home-contacts__form-body" @submit.prevent="handleVerify">
          <div
            class="home-contacts__input"
            :class="{
              'is-verified': status === 'verified',
              'is-error': status === 'error',
            }"
          >
            <input
              v-model="query"
              type="text"
              class="home-contacts__input-field"
              :placeholder="content.form.placeholder"
              autocomplete="off"
              spellcheck="false"
              :aria-invalid="status === 'error'"
              @input="handleInput"
            />
            <button type="submit" class="home-contacts__input-btn">
              {{ content.form.buttonLabel }}
            </button>
          </div>

          <div
            v-if="status !== 'idle'"
            class="home-contacts__status"
            :class="{
              'home-contacts__status--verified': status === 'verified',
              'home-contacts__status--error': status === 'error',
            }"
            role="status"
            aria-live="polite"
          >
            <BaseIcon :name="status === 'verified' ? 'verified' : 'alert-circle'" :size="24" />
            <span>{{
              status === 'verified' ? content.form.verifiedLabel : content.form.errorLabel
            }}</span>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70, gap 48
 * Desktop : px 60, py 100, gap 70
 * Без overflow-x на секции: свайпер full-bleed + инсет (как Testimonials);
 * горизонталь страницы — body (main.scss).
 * ============================================================ */
.home-contacts {
  position: relative;

  @include section-padding(to-rem(60));
}

.home-contacts__inner {
  position: relative;
  z-index: 1;
  @include section-stack($align: center);
  @include container(var(--container-content));
}

.home-contacts__glow {
  position: absolute;
  top: to-rem(-106);
  right: to-rem(-280);
  width: to-rem(540);
  height: to-rem(720);
  pointer-events: none;
  user-select: none;
  z-index: 0;

  @include mq($from: tablet) {
    top: to-rem(-186);
    right: to-rem(-390);
    width: to-rem(742);
    height: auto;
  }
}

/* ============================================================
 * Title — 36/40 mobile, H3 56/64 desktop
 * ============================================================ */
.home-contacts__title {
  @include font-section-title;
}

/* ============================================================
 * Slider wrapper — стрелки только при 4 карточках в ряд (≥ tablet)
 * До tablet: full-bleed + инсет на swiper (как HomeTestimonials).
 * ============================================================ */
.home-contacts__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  /* Full-bleed до wide, возврат места под стрелки только на ≥1280
     (там же показываются и сами стрелки — см. .home-contacts__nav). */
  @include mq($until: wide) {
    margin-inline: calc(-1 * var(--container-pad-x));
    // width: calc(100% + 2 * var(--container-pad-x));
  }

  @include mq($from: wide) {
    padding-inline: var(--container-pad-x);
  }
}

.home-contacts__swiper {
  width: 100%;
  box-sizing: border-box;

  /* До wide — full-bleed: инсет совпадает с секционным padding-x. */
  @include mq($until: wide) {
    // padding-inline: var(--container-pad-x);
  }
}

/*
 * Slide — ширину задаёт Swiper (1 / 2 / 4 по breakpoints).
 */
.home-contacts__slide {
  height: auto;
  display: flex;
}

/* ============================================================
 * Card — column: photo (1:1) + body
 * ============================================================ */
.contact-card {
  display: flex;
  flex-direction: column;
  gap: to-rem(24);
  width: 100%;
}

.contact-card__photo {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.contact-card__photo-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-card__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(16);
  width: 100%;
}

.contact-card__info {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(4);
  width: 100%;
  text-align: center;
}

/*
 * Name
 * Mobile  : 24/32, name переносится по \n (pre-wrap) → 2 строки
 * Desktop : H4 32/40 — две строки по 40 = 80h, как в Figma
 */
.contact-card__name {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    white-space: pre-wrap;

    @include font-h4;
  }
}

.contact-card__position {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

/* ============================================================
 * Socials — 32×32 icon-button, 16×16 icon
 * ============================================================ */
.contact-card__socials {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: center;
  gap: to-rem(8);
}

.contact-card__social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: to-rem(32);
  height: to-rem(32);
  padding: to-rem(8);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-icon-primary);
  text-decoration: none;
  transition: background-color var(--transition-base);

  &:hover {
    background-color: var(--color-bg-hovered);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

/* ============================================================
 * Navigation arrows — появляются с ≥1280 (wide), когда у slider-wrap
 * есть padding-inline=60 под стрелки. На 1024-1279 — full-bleed + dots.
 * ============================================================ */
.home-contacts__nav {
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
    top: to-rem(142.5);
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

  &.is-locked {
    display: none;
  }
}

.home-contacts__nav--prev {
  @include mq($from: wide) {
    left: 0;
  }
}

.home-contacts__nav--next {
  @include mq($from: wide) {
    right: 0;
  }
}

/* ============================================================
 * Pagination — Swiper bullets
 * ============================================================ */
.home-contacts__pagination {
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

/* ============================================================
 * Form — "Not sure it's us?"
 * Gap to slider: 70 mobile / 100 desktop (по Figma)
 * Внутри: header (gap 8) + body (gap 16)
 * ============================================================ */
.home-contacts__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(24);
  margin-top: to-rem(
    22
  ); /* 70 - 48 (gap inner) = 22 → даём docs gap, но реально margin даёт +22 поверх gap */

  @include mq($from: tablet) {
    margin-top: to-rem(30); /* 100 - 70 = 30 */
  }
}

.home-contacts__form-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(8);
  width: 100%;
  text-align: center;
}

/* Title формы: 32/40 medium на mobile, 40/40 (H?) на desktop?
 * По Figma desktop title 40h — это medium 32/40 на самом деле тот же.
 * А на mobile 32h. Используем единый: 32/40.
 */
.home-contacts__form-title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(32);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

.home-contacts__form-subtitle {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

.home-contacts__form-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(16);
  width: 100%;
}

/* ============================================================
 * Input pill — 56h, padding-left 24, padding-right 8
 * Mobile  : full width
 * Desktop : 450px по центру
 * Border меняется по статусу: subtle → success-soft / subtle (error)
 * ============================================================ */
.home-contacts__input {
  display: flex;
  align-items: center;
  gap: to-rem(16);
  height: to-rem(56);
  padding: to-rem(8) to-rem(8) to-rem(8) to-rem(24);
  background-color: var(--color-bg-subtle);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-pill);
  width: 100%;
  transition: border-color var(--transition-base);

  @include mq($from: mobile) {
    width: to-rem(450);
  }

  &.is-verified {
    border-color: var(--color-border-success-soft);
  }

  /* error border остаётся subtle — по Figma 3109:1994 */
}

.home-contacts__input-field {
  flex: 1 1 auto;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-tertiary);
  }
}

/* Кнопка Check — small secondary (white bg, dark text) */
.home-contacts__input-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: to-rem(40);
  padding: to-rem(8) to-rem(16);
  background-color: var(--color-bg-inverted);
  color: var(--color-text-inverted);
  border: none;
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background-color var(--transition-base);

  &:hover {
    background-color: var(--color-neutral-0-alpha-80);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

/* ============================================================
 * Status row — verified (green) / error (orange)
 * ============================================================ */
.home-contacts__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

.home-contacts__status--verified {
  color: var(--color-text-secondary);

  .base-icon {
    color: var(--color-state-success);
  }
}

.home-contacts__status--error {
  color: var(--color-text-secondary);

  .base-icon {
    color: var(--color-state-warning);
  }
}
</style>
