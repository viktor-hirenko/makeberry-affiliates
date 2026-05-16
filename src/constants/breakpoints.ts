/**
 * JS-зеркало `$breakpoints` из `src/assets/styles/scss/_breakpoints.scss`.
 * Нужно там, где брейкпоинты задаются в TypeScript (Swiper, `useMediaQuery`).
 * При смене значений в SCSS — обновить и здесь.
 */

/** `$breakpoints.mobile` */
export const BREAKPOINT_MOBILE_PX = 768

/** `$breakpoints.tablet` */
export const BREAKPOINT_TABLET_PX = 1024

/** `$breakpoints.wide` (`desktop: 1440` только в SCSS, в TS пока не экспортируем). */
export const BREAKPOINT_WIDE_PX = 1280
