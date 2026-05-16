import { onUnmounted, watch, type Ref } from 'vue'

/**
 * Блокирует прокрутку `document.body`, пока `isLocked === true`.
 *
 * Нужен для fullscreen-overlay (сейчас — `MobileMenu`): без lock фон
 * продолжает скроллиться под открытым drawer. При закрытии или unmount
 * overflow сбрасывается.
 */
export function useScrollLock(isLocked: Ref<boolean>): void {
  watch(
    isLocked,
    (locked) => {
      document.body.style.overflow = locked ? 'hidden' : ''
    },
    { immediate: true },
  )

  onUnmounted(() => {
    document.body.style.overflow = ''
  })
}
