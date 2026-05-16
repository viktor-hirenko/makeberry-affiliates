import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Блокирует прокрутку страницы, пока `isLocked === true`.
 * Используется в MobileMenu — добавляет/убирает класс `no-scroll` на body.
 */
export function useScrollLock(isLocked: Ref<boolean>): void {
  watch(
    isLocked,
    (locked) => {
      document.documentElement.classList.toggle('no-scroll', locked)
      document.body.classList.toggle('no-scroll', locked)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    document.documentElement.classList.remove('no-scroll')
    document.body.classList.remove('no-scroll')
  })
}
