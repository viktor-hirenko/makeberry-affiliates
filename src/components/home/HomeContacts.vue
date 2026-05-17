<script setup lang="ts">
import { computed, ref } from 'vue'
import { A11y, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { SWIPER_SPACE_COMFORT_PX, swiperTwoColumnBreakpoints } from '@/constants/swiper'
import { useHomeContacts, useSharedUi } from '@/composables/useContent'

const content = useHomeContacts()
const ui = useSharedUi()

/**
 * Swiper breakpoints (числа = min-width):
 * - &lt;600: 1 слайд
 * - 600–767: 2 слайда, gap 16
 * - 768–1023: 2 слайда, gap 20
 * - ≥1024: 4 слайда
 */
const contactsSwiperBreakpoints = {
  ...swiperTwoColumnBreakpoints,
  [BREAKPOINT_TABLET_PX]: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: SWIPER_SPACE_COMFORT_PX,
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

        <div class="home-contacts__pagination"></div>
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
              enterkeyhint="send"
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

/* Без overflow-x на секции: full-bleed свайпер компенсируется
 * отрицательным margin (как в Testimonials); горизонтальный
 * скролл документа клипается на body (см. main.scss). */
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

.home-contacts__title {
  @include font-section-title;
}

/* <768: viewport bleed; 768–1023: контейнер; 1024–1279: margin-bleed (4 колонки). */
.home-contacts__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  @include slider-wrap-bleed($tablet-bleed: true);
}

.home-contacts__swiper {
  width: 100%;
  box-sizing: border-box;

  @include slider-swiper-bleed-phone();
}

/* Slide — ширину задаёт Swiper (1 / 2 / 4 по breakpoints). */
.home-contacts__slide {
  height: auto;
  display: flex;
}

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

/* ≥1024px: `pre-wrap` + font-h4 (32/40), чтобы имя из JSON ломалось по `\n`
 * на две строки — как в Figma. */
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

/* Стрелки только ≥ laptop (под них у slider-wrap есть padding-inline);
 * на 1024–1279 их прячем — там full-bleed + dots. */
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

  @include mq($from: laptop) {
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
  @include mq($from: laptop) {
    left: 0;
  }
}

.home-contacts__nav--next {
  @include mq($from: laptop) {
    right: 0;
  }
}

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

/* Form follows the slider with a Figma-prescribed 70/100 gap. */
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

  @include mq($from: compact) {
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
