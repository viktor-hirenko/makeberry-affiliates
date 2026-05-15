<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'tetriary'
  size?: 'large' | 'small'
  to?: RouteLocationRaw
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  /** Override rel for the anchor. Use for affiliate/sponsored links:
   *  rel="sponsored nofollow noopener noreferrer" */
  rel?: string
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'large',
  disabled: false,
  type: 'button',
})

/**
 * mailto: / tel: открываются нативным клиентом, target=_blank и
 * rel=noopener для них неосмысленны (а в части окружений ещё и
 * приводят к пустой вкладке). Для остальных http(s)-ссылок —
 * стандартный безопасный набор атрибутов.
 */
const isProtocolLink = computed(
  () => !!props.href && /^(mailto:|tel:)/i.test(props.href),
)
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
    :rel="isProtocolLink ? undefined : (rel ?? 'noopener noreferrer')"
    :target="isProtocolLink ? undefined : '_blank'"
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
@use '@/assets/styles/scss/mixins' as *;

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
