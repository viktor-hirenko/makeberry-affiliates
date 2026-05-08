<script setup lang="ts">
export interface BadgeProps {
  variant?: 'neutral' | 'brand' | 'inverted' | 'soft'
  size?: 'sm' | 'md'
}

withDefaults(defineProps<BadgeProps>(), {
  variant: 'neutral',
  size: 'md',
})
</script>

<template>
  <span class="badge" :class="[`badge--${variant}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-pill);
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  border: 1px solid transparent;
}

.badge--md {
  padding: 8px 16px;
  font-size: 1rem;
  line-height: 1.5;
}

.badge--sm {
  padding: 4px 12px;
  font-size: 0.75rem;
  line-height: 1.33;
}

.badge--neutral {
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--color-text-primary);
  border-color: var(--color-border-default);
}

.badge--brand {
  background-color: var(--color-brand);
  color: var(--color-text-primary);
}

.badge--inverted {
  background-color: var(--color-bg-inverted);
  color: var(--color-text-inverted);
}

.badge--soft {
  background-color: rgba(255, 1, 128, 0.16);
  color: var(--color-brand);
  border-color: rgba(255, 1, 128, 0.4);
}
</style>
