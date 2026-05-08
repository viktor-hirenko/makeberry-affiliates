<script setup lang="ts">
import { computed } from 'vue'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeTestimonials } from '@/composables/useContent'

const content = useHomeTestimonials()

/*
 * Индекс «центрального» (большого) testimonial-а — это позиция в массиве,
 * а НЕ swiper-active. Для 3 элементов — index 1, для 5 — index 2.
 * Если в JSON будет другое количество, центральная карточка автоматически
 * сдвинется на середину.
 */
const centerIndex = computed(() => Math.floor(content.items.length / 2))

const navConfig = {
  prevEl: '.home-testimonials__nav--prev',
  nextEl: '.home-testimonials__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}
</script>

<template>
  <section
    id="testimonials"
    class="home-testimonials"
    data-section="testimonials"
  >
    <img
      src="/images/home/testimonials/glow.png"
      alt=""
      class="home-testimonials__glow"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />

    <div class="home-testimonials__inner">
      <h2 class="home-testimonials__title">{{ content.title }}</h2>

      <div class="home-testimonials__slider-wrap">
        <Swiper
          class="home-testimonials__swiper"
          :modules="[Navigation, Pagination]"
          :slides-per-view="1"
          :space-between="16"
          :watch-overflow="true"
          :navigation="navConfig"
          :pagination="{ clickable: true, el: '.home-testimonials__pagination' }"
          :breakpoints="{
            1280: {
              slidesPerView: 'auto',
              spaceBetween: 20,
              allowTouchMove: false,
            },
          }"
        >
          <SwiperSlide
            v-for="(item, index) in content.items"
            :key="index"
            class="home-testimonials__slide"
            :class="{ 'home-testimonials__slide--center': index === centerIndex }"
          >
            <article
              class="home-testimonials__card"
              :class="{ 'home-testimonials__card--center': index === centerIndex }"
            >
              <div class="home-testimonials__card-top">
                <img
                  src="/images/home/testimonials/quote.svg"
                  alt=""
                  class="home-testimonials__quote"
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
                <p class="home-testimonials__text">{{ item.text }}</p>
              </div>

              <div class="home-testimonials__divider" aria-hidden="true"></div>

              <footer class="home-testimonials__footer">
                <span
                  v-if="!item.avatarSrc"
                  class="home-testimonials__avatar"
                  aria-hidden="true"
                ></span>
                <img
                  v-else
                  :src="item.avatarSrc"
                  :alt="item.author"
                  class="home-testimonials__avatar home-testimonials__avatar--image"
                  loading="lazy"
                  decoding="async"
                />
                <p class="home-testimonials__author">{{ item.author }}</p>
                <a
                  v-if="item.ctaHref"
                  :href="item.ctaHref"
                  class="home-testimonials__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Visit ${item.author}`"
                >
                  <BaseIcon name="arrow-up-right" :size="24" />
                </a>
              </footer>
            </article>
          </SwiperSlide>
        </Swiper>

        <button
          type="button"
          class="home-testimonials__nav home-testimonials__nav--prev"
          aria-label="Previous testimonial"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-testimonials__nav home-testimonials__nav--next"
          aria-label="Next testimonial"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div class="home-testimonials__pagination" aria-hidden="true"></div>
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
 * Mobile (Figma 360 — px 16, py 70)
 * Desktop (Figma 1440 — px 60, py 100)
 * ============================================================ */
.home-testimonials {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-bg-page);
  padding: to-rem(70) to-rem(16);
  overflow: hidden;

  @include mq($from: mobile) {
    padding-inline: to-rem(32);
  }

  @include mq($from: desktop) {
    padding: to-rem(100) to-rem(60);
  }
}

/* ============================================================
 * Decoration: pink glow слева
 * ============================================================ */
.home-testimonials__glow {
  position: absolute;
  top: 50%;
  left: 0;
  width: to-rem(720);
  height: auto;
  max-width: none;
  transform: translate(-55%, -50%);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  opacity: 0.85;

  @include mq($from: tablet) {
    width: to-rem(1115);
    transform: translate(-50%, -50%);
  }
}

.home-testimonials__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);

  @include mq($from: desktop) {
    gap: to-rem(70);
  }
}

.home-testimonials__title {
  margin: 0;
  width: 100%;
  color: var(--color-text-primary);
  text-align: center;
  @include font-h4;

  @include mq($from: desktop) {
    @include font-h3;
  }
}

/* ============================================================
 * Slider wrapper — relative для позиционирования стрелок
 * ============================================================ */
.home-testimonials__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);
}

.home-testimonials__swiper {
  width: 100%;

  /*
   * align-items: center — на десктопе у нас side cards 280h и
   * центральная 352h, вертикально центруем по центру.
   *
   * justify-content применяется ТОЛЬКО на десктопе. На mobile это
   * ломает swiper translate3d (slidesPerView=1, 3 slide'а суммарно
   * шире wrapper'а — flex centering сдвигает wrapper влево/вправо
   * на половину overflow, а Swiper потом ещё translate'ит сверху —
   * результат: слайды «улетают» и пропадают из viewport).
   */
  :deep(.swiper-wrapper) {
    align-items: center;
  }

  /*
   * Десктоп: 3 фикс-карточки (350+460+350+gap*2 = 1200) уже swiper'а
   * (1320). watch-overflow lock'ит swiper → translate не применяется →
   * безопасно центрируем группу через flex.
   */
  @media (min-width: 1280px) {
    :deep(.swiper-wrapper) {
      justify-content: center;
    }
  }
}

/* ============================================================
 * Slide
 * Mobile/Tablet (<1280): slidesPerView=1, карточка 328×400 (по Figma
 *   3861:20632). Все 3 testimonial-а доступны через dots + swipe.
 *   Стрелок на мобильном НЕТ (по Figma).
 *
 * Desktop (≥1280): slidesPerView='auto', side 350×280, центральная
 *   460×352. Сумма 350+460+350+20×2 = 1200 ≤ container 1320 →
 *   все 3 видны одновременно → watch-overflow скрывает контролы.
 *   Точно та же логика, что в Direct Advertiser.
 * ============================================================ */
.home-testimonials__slide {
  /*
   * Mobile/Tablet: ширину slide задаёт сам Swiper по slidesPerView=1
   * (= ширина контейнера inner — padding section). НЕ задаём width/
   * max-width вручную, иначе образуется «щель» между слайдами и
   * сквозь неё видно соседние карточки (Swiper translate'ит wrapper
   * на основе своей ширины, а не нашего max-width).
   *
   * Высоту фиксируем 400px по Figma 3861:20632.
   */
  height: to-rem(400);
  display: flex;

  @media (min-width: 1280px) {
    width: to-rem(350);
    height: to-rem(280);
  }
}

.home-testimonials__slide--center {
  @media (min-width: 1280px) {
    width: to-rem(460);
    height: to-rem(352);
  }
}

/* ============================================================
 * Card
 * ============================================================ */
.home-testimonials__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  opacity: 1;

  /* На десктопе боковые карточки приглушаем (по Figma). */
  @media (min-width: 1280px) {
    opacity: 0.7;
  }
}

.home-testimonials__card--center {
  @media (min-width: 1280px) {
    opacity: 1;
  }
}

.home-testimonials__card-top {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  padding: to-rem(24);
  flex: 1 1 auto;
  min-height: 0;
}

.home-testimonials__quote {
  display: block;
  width: to-rem(48);
  height: to-rem(48);
  flex-shrink: 0;
}

/*
 * Текст: на mobile до 8 строк (Figma 280×192h = 8×24).
 * На десктопе — 3 строки на side, 6 строк на center.
 */
.home-testimonials__text {
  margin: 0;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  line-clamp: 8;
  overflow: hidden;
  text-overflow: ellipsis;
  @include font-body-s-regular;

  @media (min-width: 1280px) {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

.home-testimonials__card--center .home-testimonials__text {
  @media (min-width: 1280px) {
    -webkit-line-clamp: 6;
    line-clamp: 6;
  }
}

.home-testimonials__divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-border-subtle);
}

.home-testimonials__footer {
  display: flex;
  align-items: center;
  gap: to-rem(16);
  padding: to-rem(24);
}

.home-testimonials__avatar {
  flex-shrink: 0;
  width: to-rem(48);
  height: to-rem(48);
  border-radius: 50%;
  background-color: var(--color-bg-subtle);
  object-fit: cover;
}

.home-testimonials__avatar--image {
  display: block;
}

.home-testimonials__author {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @include font-body-l-semibold;
}

/*
 * CTA: на mobile/tablet всегда видна (одна карточка = full content).
 * На десктопе — только у центральной (по Figma).
 */
.home-testimonials__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: to-rem(40);
  height: to-rem(40);
  flex-shrink: 0;
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-icon-primary);
  text-decoration: none;
  transition: background-color var(--transition-base);

  @media (min-width: 1280px) {
    visibility: hidden;
  }

  &:hover {
    background-color: var(--color-bg-hovered);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

.home-testimonials__card--center .home-testimonials__cta {
  @media (min-width: 1280px) {
    visibility: visible;
  }
}

/* ============================================================
 * Navigation arrows
 * - На mobile/tablet (<1280) скрыты ВСЕГДА — по Figma 3861:20632
 *   на мобильном только dots + swipe gestures.
 * - На desktop (≥1280): появляются только когда watch-overflow
 *   видит overflow (т.е. testimonials > 3). При 3 testimonials
 *   их прячет .is-locked.
 * ============================================================ */
.home-testimonials__nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: none;
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
  transition: background-color var(--transition-base);
  transform: translateY(calc(-50% - #{to-rem(24)}));

  @media (min-width: 1280px) {
    display: inline-flex;
  }

  &:hover {
    background-color: var(--color-bg-hovered);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &.is-disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }

  /*
   * Lock-класс ставит сам Swiper, когда watch-overflow определяет,
   * что листать нечего. Прячем тогда стрелки даже на десктопе.
   */
  &.is-locked {
    display: none;
  }
}

.home-testimonials__nav--prev {
  left: 0;
}

.home-testimonials__nav--next {
  right: 0;
}

/* ============================================================
 * Pagination — dots, видны только если есть что листать.
 * ============================================================ */
.home-testimonials__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  padding-top: to-rem(8);

  :deep(.swiper-pagination-bullet) {
    width: to-rem(8);
    height: to-rem(8);
    margin: 0;
    border-radius: 50%;
    background-color: var(--color-bg-subtle);
    opacity: 1;
    cursor: pointer;
    transition: background-color var(--transition-base);
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: var(--color-text-primary);
  }

  /*
   * Когда в Swiper стоит pagination-lock (нечего листать) —
   * скрываем dots вместе со стрелками.
   */
  :deep(.swiper-pagination-lock) {
    display: none;
  }
}

/* Скрываем сам контейнер пагинации, когда внутри ничего нет. */
.home-testimonials__slider-wrap:has(.swiper-pagination-lock) .home-testimonials__pagination {
  display: none;
}
</style>
