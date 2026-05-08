<script setup lang="ts">
import { useHomeBenefits } from '@/composables/useContent'

const content = useHomeBenefits()
</script>

<template>
  <section
    id="our-benefits"
    class="home-benefits"
    data-section="our-benefits"
  >
    <div class="home-benefits__decor" aria-hidden="true">
      <img
        src="/images/home/our-benefits/glow-bg.png"
        alt=""
        class="home-benefits__decor-image home-benefits__decor-image--bg"
        loading="lazy"
        decoding="async"
      />
      <img
        src="/images/home/our-benefits/glow-accent.png"
        alt=""
        class="home-benefits__decor-image home-benefits__decor-image--accent"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="home-benefits__inner">
      <h2 class="home-benefits__title">{{ content.title }}</h2>

      <ul class="home-benefits__grid" role="list">
        <li
          v-for="card in content.cards"
          :key="card.number"
          class="home-benefits__card"
        >
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
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

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
  background-color: var(--color-bg-page);
  padding: to-rem(70) var(--container-pad-mobile);
  overflow: hidden;

  @include mq($from: mobile) {
    padding-inline: var(--container-pad-tablet);
  }

  @include mq($from: desktop) {
    padding: to-rem(100) to-rem(120);
  }
}

/* ============================================================
 * Decoration: 2 pink glow ellipses в правой части секции.
 * На мобайле — мягкое pink свечение в правом верхнем углу,
 * на десктопе — раскрытое позиционирование как в Figma.
 * ============================================================ */
.home-benefits__decor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}

.home-benefits__decor-image {
  position: absolute;
  display: block;
  object-fit: contain;
  opacity: 0.9;

  &--bg {
    /* Большой ellipse: 625×956 (Figma 1168, 662 на 1440 фрейме). */
    top: to-rem(-100);
    right: to-rem(-180);
    width: to-rem(420);
    height: auto;

    @include mq($from: tablet) {
      top: to-rem(-60);
      right: to-rem(-220);
      width: to-rem(625);
    }
  }

  &--accent {
    /* Меньший ellipse: 382×388 (Figma 1290, 543). Лежит выше и правее. */
    top: to-rem(-40);
    right: to-rem(-80);
    width: to-rem(260);
    height: auto;

    @include mq($from: tablet) {
      top: to-rem(-120);
      right: to-rem(-50);
      width: to-rem(382);
    }
  }
}

/* ============================================================
 * Inner: контент над декорацией
 * ============================================================ */
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

/* ============================================================
 * Title — H4 на мобайле (32/40), H3 на десктопе (56/64)
 * ============================================================ */
.home-benefits__title {
  margin: 0;
  width: 100%;
  color: var(--color-text-primary);
  text-align: center;
  @include font-h4;

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

  @include mq($from: desktop) {
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
