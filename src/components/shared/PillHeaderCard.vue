<script setup lang="ts">
/**
 * Карточка с pill-заголовком и slot-контентом. Используется
 * в HomeDirectAdvertiser, CasinoKeyHighlights, CasinoCooperation —
 * визуально идентичные карточки в Figma 3838-10833 / 3861-21411 / 3861-21370.
 *
 * Кастомизация через CSS-переменные:
 *   --phc-body-gap — gap между элементами в slot (default 0).
 */
interface Props {
  /** Текст pill-заголовка. */
  title: string
  /** Расстояние между элементами slot в rem. */
  bodyGap?: number
  /** HTML-тег корневого элемента. По умолчанию `<li>` — компонент рассчитан на использование внутри `<ul>`. */
  as?: 'li' | 'div' | 'article'
}

const props = withDefaults(defineProps<Props>(), {
  bodyGap: 0,
  as: 'li',
})

/* eslint-disable-next-line vue/no-setup-props-reactivity-loss */
const rootStyle = props.bodyGap
  ? ({ '--phc-body-gap': `${props.bodyGap / 16}rem` } as Record<string, string>)
  : undefined
</script>

<template>
  <component :is="props.as" class="phc" :style="rootStyle">
    <div class="phc__pill">
      <span class="phc__pill-text">{{ title }}</span>
    </div>
    <div class="phc__body">
      <slot />
    </div>
  </component>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.phc {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  margin: 0;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: to-rem(44);
}

.phc__pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(20);
  background-color: var(--color-bg-page);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

/* На планшете (1024–1439) карточка ~230px, поэтому используем 24/32;
 * с ≥ desktop переключаемся на H4 32/40 — длинные заголовки умещаются
 * с воздухом, как в Figma. */
.phc__pill-text {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;
  white-space: nowrap;

  @include mq($from: desktop) {
    @include font-h4;
  }
}

.phc__body {
  display: flex;
  flex-direction: column;
  gap: var(--phc-body-gap, 0);
  margin: 0;
  padding: to-rem(20);
  color: var(--color-text-secondary);
  @include font-body-s-regular;

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

.phc__body :slotted(p) {
  margin: 0;
}
</style>
