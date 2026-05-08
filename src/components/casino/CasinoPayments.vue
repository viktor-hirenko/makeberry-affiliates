<script setup lang="ts">
import type { CasinoPaymentsContent } from '@/types/content'

/**
 * Casino → Payments & Withdrawals (Figma 3819:4228)
 *
 * Layout:
 * - Mobile  : title центром, 2 карточки колонкой (Payment Methods, Withdrawal Methods).
 * - Desktop : 2 карточки в ряду (равные ширины).
 *
 * Каждая карточка — 24px padding header (title H4) → 1px divider → 24px padding
 * с маркированным списком (bullet, секондари-цвет).
 *
 * Декорация: pink glow в левом верхнем углу секции (overflow: clip).
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
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70.
 * Desktop : px 200, py 100 (Figma).
 * Pink glow выходит за левую границу — overflow-x: clip,
 * чтобы не порвать sticky/horizontal-scroll контекст.
 * ============================================================ */
.casino-payments {
  position: relative;
  background-color: var(--color-bg-page);
  padding: to-rem(70) var(--container-pad-mobile);
  overflow-x: clip;

  @include mq($from: mobile) {
    padding-inline: var(--container-pad-tablet);
  }

  @include mq($from: tablet) {
    padding: to-rem(100) var(--container-pad-desktop);
  }

  @include mq($from: desktop) {
    padding-inline: to-rem(200);
  }
}

/* ============================================================
 * Glow — pre-composited pink ellipse в left-top.
 * Figma desktop: left -421, top -160, w 956, h 625.
 * Mobile коэффициент ≈ 0.6× для аккуратной композиции.
 * ============================================================ */
.casino-payments__glow {
  position: absolute;
  top: to-rem(-100);
  left: to-rem(-260);
  width: to-rem(580);
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  object-fit: contain;

  @include mq($from: tablet) {
    top: to-rem(-160);
    left: to-rem(-421);
    width: to-rem(956);
  }
}

.casino-payments__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--container-default);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: to-rem(48);

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * Title — 36/40 mobile, H3 56/64 desktop. Center.
 * ============================================================ */
.casino-payments__title {
  margin: 0;
  text-align: center;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: to-rem(-0.36);

  @include mq($from: tablet) {
    @include font-h3;
  }
}

/* ============================================================
 * Grid: 1 col mobile, 2 col desktop, equal gap 20 (Figma 24).
 * ============================================================ */
.casino-payments__grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);

  @include mq($from: tablet) {
    grid-template-columns: 1fr 1fr;
    gap: to-rem(24);
  }
}

/* ============================================================
 * Card — bg-surface, radius 24, border subtle, overflow-clip.
 * ============================================================ */
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

/* ============================================================
 * List — нативные disc bullets, secondary text.
 * ============================================================ */
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
