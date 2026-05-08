import { onUnmounted, watch, type Ref } from 'vue'

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
