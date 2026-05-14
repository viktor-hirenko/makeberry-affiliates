/**
 * База для перевода «безынитных» чисел из дизайна (px) в `rem` в рантайме.
 * Держите в соответствии с `$base-font` в `src/assets/styles/scss/_units.scss`.
 */
export const ROOT_FONT_SIZE_PX = 16 as const

export function toRem(px: number): string {
  return `${px / ROOT_FONT_SIZE_PX}rem`
}
