<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'

export interface IconButtonProps {
  icon: string
  label: string
  /** 24 — иконка 24px без фиксированного квадрата (хедер/меню по макету). */
  size?: 24 | 32 | 40 | 56
  disabled?: boolean
  variant?: 'subtle' | 'ghost' | 'outline'
}

const props = withDefaults(defineProps<IconButtonProps>(), {
  size: 40,
  disabled: false,
  variant: 'subtle',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconSize = computed((): 16 | 24 | 32 => {
  if (props.size === 24) return 24
  if (props.size <= 32) return 16
  return 24
})

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="[`icon-button--${props.size}`, `icon-button--${props.variant}`]"
    :disabled="props.disabled"
    :aria-label="props.label"
    @click="handleClick"
  >
    <BaseIcon :name="props.icon" :size="iconSize" />
  </button>
</template>

<style scoped lang="scss">
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: var(--radius-pill);
  border: 0;
  background: transparent;
  color: var(--color-icon-primary);
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base),
    opacity var(--transition-base);

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

/* ============================================================
 * Sizes
 * ============================================================ */
.icon-button--24 {
  width: auto;
  height: auto;
  border-radius: 0;
}

.icon-button--32 {
  width: 32px;
  height: 32px;
}

.icon-button--40 {
  width: 40px;
  height: 40px;
}

.icon-button--56 {
  width: 56px;
  height: 56px;
}

/* ============================================================
 * Variants
 * ============================================================ */
.icon-button--subtle {
  background-color: var(--color-bg-subtle);

  &:hover:not(:disabled) {
    background-color: var(--color-bg-hovered);
  }
}

.icon-button--ghost {
  background-color: transparent;

  &:hover:not(:disabled) {
    background-color: transparent;
    opacity: 0.85;
  }
}

.icon-button--outline {
  border: 1px solid var(--color-border-default);

  &:hover:not(:disabled) {
    border-color: var(--color-border-strong);
  }
}

/* ============================================================
 * Disabled
 * ============================================================ */
.icon-button:disabled {
  background-color: var(--color-bg-disabled);
  color: var(--color-icon-disabled);
  border-color: transparent;
  cursor: not-allowed;
  opacity: 1;
}

.icon-button--ghost:disabled {
  background-color: transparent;
  opacity: 0.4;
}
</style>
