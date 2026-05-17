import {
  BREAKPOINT_COMPACT_PX,
  BREAKPOINT_MOBILE_PX,
} from '@/constants/breakpoints'

/** Между слайдами на 600–767px (совпадает с gap сеток на `compact`). */
export const SWIPER_SPACE_COMPACT_PX = 16

/** Между слайдами с 768px (совпадает с gap сеток на `mobile`). */
export const SWIPER_SPACE_COMFORT_PX = 20

/** Две колонки с 600px; gap 16 → 20 с 768px. Дальше — breakpoint конкретного слайдера. */
export const swiperTwoColumnBreakpoints = {
  [BREAKPOINT_COMPACT_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: SWIPER_SPACE_COMPACT_PX,
  },
  [BREAKPOINT_MOBILE_PX]: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: SWIPER_SPACE_COMFORT_PX,
  },
} as const
