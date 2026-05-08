<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import type { FaqItem } from '@/types/content'

interface FAQItemProps {
  item: FaqItem
  open?: boolean
}

const props = withDefaults(defineProps<FAQItemProps>(), {
  open: false,
})

const emit = defineEmits<{
  toggle: [id: string]
}>()

const isOpen = ref(props.open)

watch(
  () => props.open,
  (val) => {
    isOpen.value = val
  },
)

function toggle() {
  isOpen.value = !isOpen.value
  emit('toggle', props.item.id)
}
</script>

<template>
  <div class="faq-item" :class="{ 'is-open': isOpen }">
    <button
      type="button"
      class="faq-item__trigger"
      :aria-expanded="isOpen"
      :aria-controls="`faq-${item.id}`"
      @click="toggle"
    >
      <span class="faq-item__question">{{ item.question }}</span>
      <span class="faq-item__icon">
        <BaseIcon :name="isOpen ? 'x' : 'plus'" :size="24" />
      </span>
    </button>
    <Transition name="faq-slide">
      <div v-if="isOpen" :id="`faq-${item.id}`" class="faq-item__panel" role="region">
        <p class="faq-item__answer">{{ item.answer }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.faq-item {
  border-bottom: 1px solid var(--color-border-default);
}

.faq-item__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  background: transparent;
  border: 0;
  color: var(--color-text-primary);
  font: inherit;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: left;
  cursor: pointer;
  transition: color var(--transition-base);

  &:hover .faq-item__icon,
  &:focus-visible .faq-item__icon {
    background-color: rgba(255, 1, 128, 0.18);
    color: var(--color-brand);
  }
}

.faq-item__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-border-default);
  color: var(--color-text-primary);
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.faq-item__panel {
  padding-bottom: 24px;
  overflow: hidden;
}

.faq-item__answer {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 720px;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
  transition:
    grid-template-rows 0.25s ease,
    opacity 0.2s ease;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
}
</style>
