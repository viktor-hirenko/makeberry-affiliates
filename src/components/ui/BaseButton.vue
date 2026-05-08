<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'tetriary'
  size?: 'large' | 'small'
  to?: RouteLocationRaw
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'large',
  disabled: false,
  type: 'button',
})
</script>

<template>
  <button
    v-if="!to && !href"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
  <a
    v-else-if="href && !disabled"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :href="href"
    rel="noopener noreferrer"
    target="_blank"
  >
    <slot />
  </a>
  <RouterLink
    v-else-if="to && !disabled"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    :to="to"
  >
    <slot />
  </RouterLink>
  <span
    v-else
    class="base-button base-button--disabled"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    aria-disabled="true"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/typography' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    border-color var(--transition-base);

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

/* ============================================================
 * Sizes
 * ============================================================ */
.base-button--large {
  @include font-body-l-semibold;
  min-height: 56px;
  padding: 16px 32px;
}

.base-button--small {
  @include font-body-s-semibold;
  min-height: 40px;
  padding: 8px 16px;
}

/* ============================================================
 * Variants — Default state
 * ============================================================ */
.base-button--primary {
  background-color: var(--color-bg-brand);
  color: var(--color-text-primary);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--color-bg-brand-hovered);
  }
}

.base-button--secondary {
  background-color: var(--color-bg-inverted);
  color: var(--color-text-inverted);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--color-neutral-0-alpha-80);
  }
}

.base-button--tetriary {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: var(--color-border-brand);

  &:hover:not(:disabled):not([aria-disabled='true']) {
    background-color: var(--color-bg-brand-soft);
  }
}

/* ============================================================
 * Disabled state (одинаковый для всех вариантов по Figma)
 * ============================================================ */
.base-button:disabled,
.base-button[aria-disabled='true'] {
  background-color: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  border-color: transparent;
  cursor: not-allowed;
}
</style>
