<script setup lang="ts">
import type { CasinoPaymentsContent } from '@/types/content'

/**
 * Casino → Payments & Withdrawals — Figma mobile 12365:9127 / desktop 12269:10399.
 * Glow: Ellipse 5825 (12365:9622 / 12269:11362) — CSS radial-gradient, без растра.
 */
interface Props {
  content: CasinoPaymentsContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-payments" data-section="casino-payments">
    <div class="casino-payments__inner">
      <h2 class="casino-payments__title">{{ content.title }}</h2>

      <div class="casino-payments__grid">
        <div class="casino-payments__glow" aria-hidden="true"></div>
        <article v-for="list in content.lists" :key="list.id" class="casino-payments__card">
          <header class="casino-payments__card-header">
            <h3 class="casino-payments__card-title">{{ list.title }}</h3>
          </header>
          <div class="casino-payments__divider" aria-hidden="true"></div>
          <ul class="casino-payments__list">
            <li v-for="(item, index) in list.items" :key="index" class="casino-payments__list-item">
              {{ item }}
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-payments {
  position: relative;
  overflow-x: clip;

  @include section-padding();
}

.casino-payments__glow {
  position: absolute;
  z-index: 0;
  top: to-rem(-43);
  left: to-rem(126);
  width: to-rem(48);
  height: to-rem(1017);
  pointer-events: none;
  user-select: none;
  border-radius: 1017px;
  background: #ff0180;
  filter: blur(150px);

  @include mq($from: tablet) {
    top: 50%;
    left: to-rem(-80);
    transform: translateY(-50%);
    width: to-rem(1170);
    height: to-rem(48);
    border-radius: 1170px;
    background: #ff0180;
  }
}

.casino-payments__inner {
  position: relative;
  z-index: 1;
  @include section-stack;
  @include container(var(--container-default));
}

.casino-payments__title {
  @include font-section-title;
}

.casino-payments__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: to-rem(24);
  }

  @include mq($from: tablet) {
    grid-template-columns: 1fr 1fr;
    gap: to-rem(24);
  }
}

.casino-payments__card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.casino-payments__card-header {
  padding: to-rem(20);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

.casino-payments__card-title {
  margin: 0;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);

  @include mq($from: tablet) {
    @include font-h4;
  }
}

.casino-payments__divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-border-subtle);
}

.casino-payments__list {
  list-style: disc;
  margin: 0;
  padding: to-rem(20) to-rem(20) to-rem(20) to-rem(44);
  display: flex;
  flex-direction: column;
  gap: to-rem(4);

  @include mq($from: tablet) {
    padding: to-rem(24) to-rem(24) to-rem(24) to-rem(48);
  }
}

.casino-payments__list-item {
  color: var(--color-text-secondary);
  @include font-body-s-regular;
}
</style>
