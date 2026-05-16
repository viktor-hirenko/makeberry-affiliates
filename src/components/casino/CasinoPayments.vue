<script setup lang="ts">
import type { CasinoPaymentsContent } from '@/types/content'

/**
 * Casino → Payments & Withdrawals.
 * Декорация — pink glow в левом верхнем углу (overflow: clip).
 */
interface Props {
  content: CasinoPaymentsContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-payments" data-section="casino-payments">
    <img
      :src="content.glow.src"
      :alt="content.glow.alt"
      class="casino-payments__glow"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />

    <div class="casino-payments__inner">
      <h2 class="casino-payments__title">{{ content.title }}</h2>

      <div class="casino-payments__grid">
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

/* Pink glow выходит за левую границу — overflow-x: clip */
.casino-payments {
  position: relative;
  overflow-x: clip;

  @include section-padding();
}

.casino-payments__glow {
  position: absolute;
  top: to-rem(-100);
  left: to-rem(-260);
  width: to-rem(580);
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  @include mq($from: tablet) {
    top: to-rem(-160);
    left: to-rem(-421);
    width: to-rem(956);
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
