<script setup lang="ts">
export interface TagProps {
  active?: boolean
  size?: 'sm' | 'md'
}

withDefaults(defineProps<TagProps>(), {
  active: false,
  size: 'md',
})
</script>

<template>
  <span class="tag" :class="[`tag--${size}`, { 'is-active': active }]">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-default);
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base);

  &.is-active {
    background-color: rgba(255, 1, 128, 0.18);
    border-color: rgba(255, 1, 128, 0.5);
    color: var(--color-text-primary);
  }
}

.tag--md {
  padding: 8px 12px;
  font-size: 1rem;
  line-height: 1.5;
}

.tag--sm {
  padding: 4px 10px;
  font-size: 0.875rem;
  line-height: 1.43;
}
</style>
