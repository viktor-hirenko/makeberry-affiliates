<script setup lang="ts">
/**
 * MaybeLink — минимальная обёртка для паттерна
 * "если есть href → внешняя ссылка с target=_blank, иначе — div".
 * Используется в AppFooter для partners/awards (см. audit A-4).
 *
 * Один корневой элемент через <component :is>, чтобы fallthrough класса
 * и data-v-* scoped-атрибутов от родителя сработал штатно.
 *
 * DOM-инвариант:
 * - href есть → <a href target="_blank" rel="noopener noreferrer" aria-label?>
 * - href нет  → <div>
 */
import { computed } from 'vue'

export interface MaybeLinkProps {
  href?: string
  ariaLabel?: string
}

const props = defineProps<MaybeLinkProps>()

const tag = computed(() => (props.href ? 'a' : 'div'))

const linkAttrs = computed(() =>
  props.href
    ? {
        href: props.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': props.ariaLabel,
      }
    : {},
)
</script>

<template>
  <component :is="tag" v-bind="linkAttrs">
    <slot />
  </component>
</template>
