<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue'
import { A11y, Navigation } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/css'
import 'swiper/css/navigation'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { BREAKPOINT_MOBILE_PX, BREAKPOINT_COMPACT_PX, BREAKPOINT_TABLET_PX } from '@/constants/breakpoints'
import { SWIPER_SPACE_COMPACT_PX, SWIPER_SPACE_COMFORT_PX } from '@/constants/swiper'
import { formatUiString, useHomeTestimonials, useSharedUi } from '@/composables/useContent'
import { classifyLinkType, useAnalytics } from '@/composables/useAnalytics'

const content = useHomeTestimonials()
const ui = useSharedUi()

const { trackCtaClick } = useAnalytics()

function trackTestimonialCta(href: string, author: string): void {
  trackCtaClick({
    cta_location: 'testimonials',
    cta_label: author,
    link_url: href,
    link_type: classifyLinkType(href),
  })
}

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
 *  • < 600          → 1 слайд (база `slides-per-view="1"` на компоненте).
 *  • 600 – 767      → 2 слайда, gap 16.
 *  • 768 – 1023     → 2 слайда, gap 20.
 *  • ≥ 1024         → focal-карусель: `slidesPerView: 3` + `centeredSlides`.
 *                      Видны три слайда: small | BIG | small.
 *                      Активный = визуально центральный, увеличен через
 *                      `transform: scale` в CSS. Все слайды одной фактической
 *                      ширины (= bbox = «small» 350/1160), это критично —
 *                      без этого Swiper рассинхронизирует `slidesGrid`
 *                      при смене активного и активный встаёт не по центру.
 *
 * Здесь сознательно НЕТ `centeredSlidesBounds: true`. Он убирает пустые
 * offset-зоны по краям, но ценой того, что первый и последний слайды
 * прижаты к границам трека и никогда не становятся активными. А у
 * неактивной карточки текст обрезан на 3 строках и скрыта CTA — то есть
 * крайние отзывы нельзя было ни прочитать целиком, ни открыть по ссылке,
 * и это не зависело от их количества. Доступность контента важнее пустого
 * места на двух крайних позициях, поэтому bounds убран.
 *
 * Закольцевать вместо этого (`loop: true`) нельзя — см. блок про loop
 * ниже, после `navConfig`.
 *
 * `centeredSlides: false` на mobile-BP — обязательно: Swiper не сбрасывает
 * параметры с большего BP при возврате на меньший. Без явного `false`
 * центрирование «протекает» вниз и ломает 2-колоночный mobile-layout.
 */
const swiperBreakpoints = {
  [BREAKPOINT_COMPACT_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: SWIPER_SPACE_COMPACT_PX,
    allowTouchMove: true,
    centeredSlides: false,
  },
  [BREAKPOINT_MOBILE_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 1,
    spaceBetween: SWIPER_SPACE_COMFORT_PX,
    allowTouchMove: true,
    centeredSlides: false,
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
  },
}

/**
 * Кастомный paginator (вместо Swiper Pagination module).
 *
 * Точек ровно столько, сколько РАЗЛИЧНЫХ положений трека, а не сколько
 * отзывов, — и это принципиально, потому что числа не совпадают:
 *   • ≥1024 (3 слайда, centeredSlides без bounds) — каждый отзыв может
 *     встать в центр, snap-позиций 5 при 5 отзывах;
 *   • 600–1023 (2 слайда) — последний слайд доезжает в паре с
 *     предыдущим, snap-позиций 4 при 5 отзывах.
 * Native `Pagination` рисует bullets по числу слайдов и во втором случае
 * оставил бы мёртвую точку, по которой ничего не происходит.
 *
 * Позиции сравниваем с допуском: translate — дробный (spaceBetween задан
 * в %), точное равенство здесь не работает.
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

/** Точка → первый слайд, у которого положение трека совпадает с её snap. */
function goToSnap(idx: number) {
  const sw = swiperRef.value
  if (!sw || sw.destroyed) return
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

/*
 * Почему здесь НЕ `loop: true`, хотя закольцованная карусель выглядела бы
 * логичнее: в этой связке Swiper + Vue она нерабочая, проверено в браузере.
 *
 * Swiper реализует loop перестановкой слайдов и опознаёт их по атрибуту
 * `data-swiper-slide-index`, который дописывает сам. Здесь слайды рендерит
 * Vue через `v-for`, и этот атрибут не проставляется вовсе — замеры
 * показывают его пустым у всех слайдов. Без него вся loop-бухгалтерия
 * рассыпается: карусель инициализируется не на первом отзыве, а на
 * третьем-пятом; на последнем слайде сосед справа всё равно не
 * подставляется (пустая зона остаётся); переход через стык не
 * происходит вообще — `realIndex` замирает и стрелки перестают листать.
 * Стрелки при этом дополнительно глушит дефолтный
 * `loopPreventsSliding: true`, потому что Swiper залипает в
 * `animating === true` (нативный `transitionend` на `.swiper-wrapper`
 * не приходит). Ни `loopAdditionalSlides`, ни `loopPreventsSliding: false`,
 * ни `v-memo` на слайдах проблему не снимают — с `v-memo` карусель
 * замирает на последнем отзыве сразу после инициализации.
 *
 * Поэтому доступность всех отзывов решается проще и надёжнее — снятием
 * `centeredSlidesBounds` (см. комментарий к брейкпоинтам).
 */

/**
 * На focal-раскладке карусель открывается со ВТОРОГО отзыва.
 *
 * Причина — первая позиция единственная (вместе с последней), где сбоку
 * от центральной карточки нет соседа: `centeredSlides` без bounds честно
 * центрирует крайний слайд, и слева остаётся пустое место. На загрузке
 * это выглядело бы как дефект вёрстки. Со второго слайда виден полный
 * ряд small | BIG | small, а первый отзыв доступен стрелкой и точкой.
 *
 * Побочно это ровно то, что было и раньше: с `centeredSlidesBounds`
 * первый слайд не мог стать активным, поэтому секция и тогда открывалась
 * со второго отзыва в центре — начальный вид не изменился.
 *
 * Считаем один раз: `initialSlide` читается только при инициализации,
 * в брейкпоинтах его менять смысла нет. На мobile-раскладках слайд один
 * во всю ширину, пустых зон не бывает — там начинаем с первого отзыва.
 */
const initialSlide =
  typeof window !== 'undefined' && window.innerWidth >= BREAKPOINT_TABLET_PX ? 1 : 0
</script>

<template>
  <section id="testimonials" class="home-testimonials" data-section="testimonials">
    <div class="home-testimonials__inner">
      <h2 class="home-testimonials__title">{{ content.title }}</h2>

      <div class="home-testimonials__slider-wrap">
        <Swiper
          class="home-testimonials__swiper"
          :modules="[Navigation, A11y]"
          breakpoints-base="window"
          :initial-slide="initialSlide"
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
                <p class="home-testimonials__author" :title="item.author">{{ item.author }}</p>
                <a
                  v-if="item.ctaHref"
                  :href="item.ctaHref"
                  class="home-testimonials__cta"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="formatUiString(ui.aria.testimonialsVisit, { author: item.author })"
                  @click="trackTestimonialCta(item.ctaHref, item.author)"
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
    /* Высота активной карточки не должна зависеть от длины отзыва: без этого
     * focal-паттерн виден только на текстах, добивающих до лимита 6 строк, а на
     * коротких активная карточка совпадает по высоте с боковыми. 355px = 211px
     * постоянной части (кавычки, паддинги, разделитель, футер) + 6 × 24px строки,
     * т.е. ровно та высота, которую даёт `line-clamp: 6` на полном тексте. */
    min-height: to-rem(355);
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

  /* Домены партнёров доходят до 30 символов, и на focal-раскладке имя
   * упиралось в свой бокс: у активной карточки на него оставалось 287px из
   * 407 (24×2 паддинги, аватар 48, CTA 40, два gap по 16), а самому длинному
   * нужно 289 — обрезалось даже в центре, где обрезать нечего.
   *
   * Уменьшаем именно gap: паддинг трогать нельзя, он держит аватар на одной
   * вертикали с кавычками сверху, а шрифт — часть типошкалы. Два gap по 12
   * отдают имени 8px (295 против 289), и правило стоит на всём футере, а не
   * на активной карточке: иначе бокс имени менялся бы при въезде слайда в
   * центр и текст дёргался бы прямо во время анимации.
   *
   * Это запас, а не гарантия. `text-overflow: ellipsis` на `__author`
   * остаётся: домен от ~31 символа снова не влезет и получит многоточие. */
  @include mq($from: tablet) {
    gap: to-rem(12);
  }
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

/* Одна строка с многоточием — осознанно, а не «как получилось».
 * Домены длиннее ~30 символов гарантированно не влезут ни в один бокс, и
 * альтернатива переносу нет: домен — цельный токен без пробелов, `overflow-wrap`
 * рвал бы его посреди слова (`legjobbmagyaronlinekasz` / `ino.com`). В
 * semibold-лейбле это читается хуже обрезки. Две строки, кстати, поместились бы
 * без роста футера — его высоту держит аватар 48px = 2 × line-height 24px, —
 * так что ограничение здесь эстетическое, а не техническое.
 * `title` в разметке отдаёт полное значение по hover, когда обрезка случилась. */
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

/* Стрелки только ≥ laptop; на 1024–1279 — пагинация + свайп. */
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

  @include mq($from: laptop) {
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
  @include mq($from: laptop) {
    left: 0;
  }
}

.home-testimonials__nav--next {
  @include mq($from: laptop) {
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
