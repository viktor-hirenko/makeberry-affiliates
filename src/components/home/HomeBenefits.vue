<script setup lang="ts">
import { useHomeBenefits } from '@/composables/useContent'

const content = useHomeBenefits()
</script>

<template>
  <section id="our-benefits" class="home-benefits" data-section="our-benefits">
    <div class="home-benefits__inner">
      <img
        src="/images/decorations/glow-home-benefits.png"
        alt=""
        class="home-benefits__glow"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-benefits__title">{{ content.title }}</h2>

      <ul class="home-benefits__grid" role="list">
        <li v-for="card in content.cards" :key="card.number" class="home-benefits__card">
          <header class="home-benefits__card-header">
            <span class="home-benefits__card-dot" aria-hidden="true"></span>
            <p class="home-benefits__card-number">{{ card.number }}</p>
          </header>

          <div class="home-benefits__card-body">
            <h3 class="home-benefits__card-title">{{ card.title }}</h3>
            <p class="home-benefits__card-text">{{ card.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile (Figma 360 — px 16, py 70)
 * Desktop (Figma 1440 — px 120, py 100, title→cards 70)
 * ============================================================ */
.home-benefits {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;

  @include section-padding(to-rem(120));
}

.home-benefits__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1200);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);

  @include mq($from: desktop) {
    gap: to-rem(70);
  }
}

.home-benefits__glow {
  position: absolute;
  z-index: -1;
  top: to-rem(-364);
  right: to-rem(-333);
  width: to-rem(625);
  max-width: unset;
  height: auto;
  pointer-events: none;
  user-select: none;

  @include mq($from: tablet) {
    top: to-rem(-400);
    right: to-rem(-480);
    width: to-rem(625);
  }
}

/* ============================================================
 * Title — H4 на мобайле (32/40), H3 на десктопе (56/64)
 * ============================================================ */
.home-benefits__title {
  @include font-section-title;

  @include mq($from: desktop) {
    @include font-h3;
  }
}

/* ============================================================
 * Grid — 1 col; ≥ mobile две колонки; ≥ desktop три.
 * ============================================================ */
.home-benefits__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(16);

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(20);
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: to-rem(20);
  }
}

/* ============================================================
 * Card
 * ============================================================ */
.home-benefits__card {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  padding: to-rem(24);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  min-height: to-rem(280);
}

.home-benefits__card-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(20);
}

.home-benefits__card-dot {
  align-self: flex-end;
  width: to-rem(16);
  height: to-rem(16);
  border-radius: 50%;
  background-color: var(--color-bg-brand);
}

.home-benefits__card-number {
  margin: 0;
  color: var(--color-text-primary);
  @include font-h4;

  @include mq($from: desktop) {
    @include font-h3;
  }
}

.home-benefits__card-body {
  display: flex;
  flex-direction: column;
  gap: to-rem(20);
}

.home-benefits__card-title {
  margin: 0;
  color: var(--color-text-primary);
  @include font-h5;
}

.home-benefits__card-text {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-s-regular;
}
</style>
