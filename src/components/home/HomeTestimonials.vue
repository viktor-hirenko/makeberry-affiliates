<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue'
import { A11y, Navigation } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_MOBILE_PX, BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { formatUiString, useHomeTestimonials, useSharedUi } from '@/composables/useContent'

const content = useHomeTestimonials()
const ui = useSharedUi()

/**
 * Расстояние между слайдами на desktop focal (≥1024).
 * Swiper принимает `number` (px) или `string` с `%`: доля от `swiper.size`
 * пересчитывается при resize/update — см. swiper-core `updateSlides`.
 * Фиксированные ~70px на узких десктопах (1080–1200) давали слишком широкий
 * зазор относительно соседних секций; `6.482%` держит пропорцию к ширине трека.
 */
const TESTIMONIALS_DESKTOP_SPACE_BETWEEN = '6.482%'

/**
 * Конфиг по брейкпоинтам:
 *  • < 768          → 1 слайд (база `slides-per-view="1"` на компоненте).
 *  • 768 – 1023     → 2 слайда равной ширины (как Meet Us).
 *  • ≥ 1024         → focal-карусель: `slidesPerView: 3` + `centeredSlides` +
 *                      `centeredSlidesBounds`. Видны три слайда: small | BIG | small.
 *                      Активный = визуально центральный, увеличен через
 *                      `transform: scale` в CSS. Все слайды одной фактической
 *                      ширины (= bbox = «small» 350/1160), это критично —
 *                      без этого Swiper рассинхронизирует `slidesGrid`
 *                      при смене активного и активный встаёт не по центру.
 *
 * Важно: `centeredSlidesBounds: true` нужен по двум причинам:
 *   1. Snap-grid не дублирует позиции → кастомная пагинация = `uniqueSnaps`
 *      (напр. 4 отзыва в макете Figma → 2 точки; фактическое N — из JSON).
 *   2. Без bounds первый/последний слайды могут стать активными, и тогда
 *      по краям видны пустые offset-зоны (та самая «дыра в начале/конце»).
 *      С bounds первый/последний прижимаются к краю swiper-контейнера и
 *      всегда находятся в позиции «small-сосед», что и нужно по дизайну.
 *
 * `centeredSlides: false` на mobile-BP — обязательно: Swiper не сбрасывает
 * параметры с большего BP при возврате на меньший. Без явного `false`
 * центрирование «протекает» вниз и ломает 2-колоночный mobile-layout.
 */
const swiperBreakpoints = {
  [BREAKPOINT_MOBILE_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: 16,
    allowTouchMove: true,
    centeredSlides: false,
    centeredSlidesBounds: false,
  },
  [BREAKPOINT_TABLET_PX]: {
    slidesPerView: 3,
    slidesPerGroup: 1,
    /*
     * Интервал в % от ширины Swiper — масштабируется с viewport без ручного
     * подбора px на каждую ширину. Визуальный зазор между карточками с учётом
     * `scaleX(1.314)` на active по-прежнему близок к макету (~20px на 1280+).
     */
    spaceBetween: TESTIMONIALS_DESKTOP_SPACE_BETWEEN,
    allowTouchMove: true,
    centeredSlides: true,
    centeredSlidesBounds: true,
  },
}

/**
 * Кастомный paginator (вместо Swiper Pagination module).
 *
 * Зачем не `Pagination` из коробки:
 *   • Swiper рисует bullets по `slides.length` (= число отзывов в JSON).
 *   • При `centeredSlidesBounds: true` `snapGrid` Swiper'а имеет
 *     дубли (`[0, 0, X, X]`), реальных snap-позиций — 2.
 *     Native bullets оказываются 4, а active подсвечивается по
 *     индексу slidesGrid (0 → bullet[0], 1 → bullet[2]) — два
 *     bullet'а никогда не загораются.
 *   • Любой захардкоженный CSS-хак под 4 слайда сломается, как
 *     только в `home-testimonials.json` появится 5-й testimonial.
 *
 * Своя пагинация:
 *   • точек = количество УНИКАЛЬНЫХ snap-позиций (с tolerance 0.5px),
 *   • активная точка = текущая snap-позиция,
 *   • переход — `swiper.slideTo(slideIdx)`, где slideIdx — первый
 *     слайд из `slidesGrid`, у которого translate равен выбранному.
 *
 * Работает для любого количества testimonials и любых брейкпоинтов.
 */
const swiperRef = shallowRef<SwiperInstance | null>(null)
const uniqueSnaps = ref<number[]>([])
const currentSnap = ref(0)

const SNAP_TOLERANCE = 0.5

function syncSnaps() {
  const sw = swiperRef.value
  if (!sw || sw.destroyed) return

  const grid = sw.snapGrid as number[]
  const unique: number[] = []
  for (const v of grid) {
    if (!unique.some(u => Math.abs(u - v) < SNAP_TOLERANCE)) unique.push(v)
  }
  uniqueSnaps.value = unique

  const currentTranslate = -sw.translate
  const idx = unique.findIndex(u => Math.abs(u - currentTranslate) < SNAP_TOLERANCE)
  currentSnap.value = idx >= 0 ? idx : 0
}

function onTestimonialsSwiper(swiper: SwiperInstance) {
  swiperRef.value = swiper

  swiper.on('slideChange', syncSnaps)
  swiper.on('snapGridLengthChange', syncSnaps)
  swiper.on('breakpoint', syncSnaps)
  swiper.on('resize', syncSnaps)

  /*
   * Пересчёт геометрии после mount + после стабилизации layout.
   * Без этого на cold-load (медленные шрифты / lazy-картинки) Swiper
   * рассчитывает `slidesGrid` из «черновых» размеров — и активный
   * слайд встаёт не по центру. `document.fonts.ready` решает.
   */
  nextTick(() => {
    swiper.update()
    syncSnaps()
  })

  if (typeof window !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.update()
          syncSnaps()
        }
      })
    })
  }
}

function goToSnap(idx: number) {
  const sw = swiperRef.value
  if (!sw) return
  const target = uniqueSnaps.value[idx]
  if (target === undefined) return

  const slidesGrid = sw.slidesGrid as number[]
  const slideIdx = slidesGrid.findIndex(g => Math.abs(g - target) < SNAP_TOLERANCE)
  if (slideIdx >= 0) sw.slideTo(slideIdx)
}

const navConfig = {
  prevEl: '.home-testimonials__nav--prev',
  nextEl: '.home-testimonials__nav--next',
  disabledClass: 'is-disabled',
  lockClass: 'is-locked',
}
</script>

<template>
  <section id="testimonials" class="home-testimonials" data-section="testimonials">
    <div class="home-testimonials__inner">
      <img
        src="/images/decorations/glow-home-testimonials.webp"
        alt=""
        class="home-testimonials__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-testimonials__title">{{ content.title }}</h2>

      <div class="home-testimonials__slider-wrap">
        <Swiper
          class="home-testimonials__swiper"
          :modules="[Navigation, A11y]"
          breakpoints-base="window"
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="16"
          :watch-overflow="true"
          :observer="true"
          :observe-parents="true"
          :update-on-window-resize="true"
          :navigation="navConfig"
          :breakpoints="swiperBreakpoints"
          @swiper="onTestimonialsSwiper"
        >
          <SwiperSlide
            v-for="item in content.items"
            :key="item.id"
            class="home-testimonials__slide"
          >
            <article class="home-testimonials__card">
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
                  :aria-label="formatUiString(ui.aria.testimonialsVisit, { author: item.author })"
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
          :aria-label="ui.aria.testimonialsPrev"
        >
          <BaseIcon name="chevron-left" :size="24" />
        </button>
        <button
          type="button"
          class="home-testimonials__nav home-testimonials__nav--next"
          :aria-label="ui.aria.testimonialsNext"
        >
          <BaseIcon name="chevron-right" :size="24" />
        </button>

        <div
          v-if="uniqueSnaps.length > 1"
          class="home-testimonials__pagination"
          :aria-label="ui.aria.testimonialsPagination"
        >
          <button
            v-for="(_, i) in uniqueSnaps"
            :key="i"
            type="button"
            class="home-testimonials__pagination-bullet"
            :class="{ 'is-active': i === currentSnap }"
            :aria-label="formatUiString(ui.aria.testimonialsGroup, { n: i + 1 })"
            :aria-current="i === currentSnap ? 'true' : undefined"
            @click="goToSnap(i)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-testimonials {
  position: relative;

  @include section-padding(to-rem(60));
}

.home-testimonials__glow {
  position: absolute;
  top: to-rem(-250);
  left: to-rem(-420);
  width: to-rem(956);
  height: auto;
  max-width: unset;
  pointer-events: none;
  user-select: none;
  z-index: 0;

  @include mq($from: tablet) {
    top: to-rem(-360);
    left: to-rem(-600);
  }
}

.home-testimonials__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center);
}

.home-testimonials__title {
  @include font-section-title;
}

/* <768: viewport bleed; focal ≥1024 — в Swiper; ≥1280: padding под стрелки. */
.home-testimonials__slider-wrap {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(32);

  @include slider-wrap-bleed();
}

.home-testimonials__swiper {
  width: 100%;
  box-sizing: border-box;

  @include slider-swiper-bleed-phone();
}

/* ≥1024px: wrapper выравнивает слайды по центру по вертикали — active выше
 * side (6 vs 3 строк текста). <1024px: stretch на всю высоту слайда. */
:deep(.swiper-wrapper) {
  display: flex;
  align-items: stretch;

  @include mq($from: tablet) {
    align-items: center;
  }
}

/* Focal-carousel (≥1024px): small | BIG | small.
 *
 * Все слайды имеют одинаковый bbox (slidesPerView: 3),
 * активный увеличивается через `scaleX(1.314)`. Чтобы текст внутри
 * не растягивался, у `.card` стоит counter-scale: ширина 131.4% +
 * scaleX(0.761), так parent × child = 1, а CSS-layout считается
 * по «реальной» ширине 394px — переносы строк корректные. */
$testimonials-active-scale: 1.314; // 460 / 350 — пропорция big к small по Figma
$testimonials-active-scale-inverse: calc(1 / 1.314); // ≈ 0.761

.home-testimonials__slide {
  height: auto;
  display: flex;

  @include mq($from: tablet) {
    box-sizing: border-box;
    opacity: 0.7;
    transform-origin: center center;
    /*
     * Без transition на transform/opacity: плавный scaleX на слайде
     * конфликтовал с мгновенной сменой line-clamp у текста (3 ↔ 6 строк) —
     * визуально казалось «перекосом» / растягиванием не в ту плоскость.
     * Резкая смена состояния при перелистывании выглядит спокойнее.
     */
  }
}

.home-testimonials__slide.swiper-slide-active {
  @include mq($from: tablet) {
    transform: scaleX($testimonials-active-scale);
    opacity: 1;
    z-index: 2;
  }
}

/* Counter-scale для содержимого активной карточки. */
.swiper-slide-active .home-testimonials__card {
  @include mq($from: tablet) {
    transform: scaleX($testimonials-active-scale-inverse);
    transform-origin: center center;
    /* Расширяем CSS-ширину так, чтобы после собственного scaleX(0.761) и
       родительского scaleX(1.314) визуальная ширина совпала с bbox-визуалом
       parent (394px на 1280). Это даёт «настоящий» 394-wide layout для
       контента, без визуального растяжения текста. */
    width: calc(100% / 0.761);
    margin-inline: calc((100% - 100% / 0.761) / 2);
  }
}

/* «Дальние» слайды намеренно не скрываются через `visibility: hidden`:
 * Swiper меняет классы синхронно со стартом transition, и слайд,
 * уходящий за левый край, исчезал бы ещё в полёте. Достаточно overflow
 * у `.swiper`. */

.home-testimonials__card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;

  /* fit-content: иначе flex-родитель растягивал бы side-карточки до
   * высоты active, и focal-паттерн пропадал. */
  @include mq($from: tablet) {
    height: fit-content;
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

/* line-clamp: <1024px — 8; ≥1024px — 3 (side) / 6 (active, focal-carousel). */
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

  @include mq($from: tablet) {
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

.swiper-slide-active .home-testimonials__text {
  @include mq($from: tablet) {
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

/* ≥1024px: CTA видна только у активной карточки. */
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

  @include mq($from: tablet) {
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

.swiper-slide-active .home-testimonials__cta {
  @include mq($from: tablet) {
    visibility: visible;
  }
}

/* Стрелки только ≥ wide; на 1024–1279 — пагинация + свайп. */
.home-testimonials__nav {
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
  transition: background-color var(--transition-base);

  @include mq($from: wide) {
    display: inline-flex;
    position: absolute;
    top: 50%;
    transform: translateY(calc(-50% - #{to-rem(24)}));
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
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.is-locked {
    display: none;
  }
}

.home-testimonials__nav--prev {
  @include mq($from: wide) {
    left: 0;
  }
}

.home-testimonials__nav--next {
  @include mq($from: wide) {
    right: 0;
  }
}

/* Кастомная пагинация: bullets рендерятся во Vue по `uniqueSnaps`,
 * количество = реальное число snap-позиций (см. syncSnaps в скрипте). */
.home-testimonials__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  width: 100%;
}

.home-testimonials__pagination-bullet {
  width: to-rem(8);
  height: to-rem(8);
  margin: 0;
  padding: 0;
  border: 0;
  background-color: var(--color-text-disabled);
  border-radius: 50%;
  transition: background-color var(--transition-base);
  cursor: pointer;

  &.is-active {
    background-color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
</style>
