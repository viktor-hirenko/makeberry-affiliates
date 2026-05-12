<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeHero } from '@/composables/useContent'

const hero = useHomeHero()

function handleScrollClick() {
  const target = document.getElementById(hero.scroll.targetId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section class="home-hero" data-section="hero">
    <picture class="home-hero__bg" aria-hidden="true">
      <source media="(min-width: 768px)" :srcset="hero.background.desktop" />
      <img :src="hero.background.mobile" :alt="hero.background.alt" loading="eager" />
    </picture>

    <div class="home-hero__content">
      <h1 class="home-hero__title">
        <span class="home-hero__title-row">
          <span class="home-hero__title-text">{{ hero.titleLineLeft }}</span>
          <button
            type="button"
            class="home-hero__scroll"
            :aria-label="hero.scroll.label"
            @click="handleScrollClick"
          >
            <BaseIcon :name="hero.scroll.icon" :size="48" class="home-hero__scroll-icon" />
          </button>
        </span>
        <span class="home-hero__title-text home-hero__title-text--bottom">
          {{ hero.titleLineBottom }}
        </span>
      </h1>

      <div class="home-hero__actions">
        <BaseButton variant="primary" size="large" :to="hero.primaryCta.path">
          {{ hero.primaryCta.label }}
        </BaseButton>
        <BaseButton variant="secondary" size="large" :to="hero.secondaryCta.path">
          {{ hero.secondaryCta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * ============================================================ */
.home-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* Hero рисуется flush до верха viewport (под плавающим хедером).
     padding-top ниже учитывает высоту header-pill — header не наезжает. */

  @include section-padding(
    $desktop-inline: to-rem(160),
    $mobile-top: to-rem(220),
    $mobile-bottom: to-rem(70),
    $desktop-top: to-rem(280),
    $desktop-bottom: to-rem(150)
  );

  @include mq($from: mobile) {
    padding-top: to-rem(240);
    padding-bottom: to-rem(100);
  }

  @include mq($from: tablet) {
    padding-top: to-rem(280);
    padding-bottom: to-rem(150);
    /* padding-inline уже задаётся через section-padding → var(--container-pad-x) (60 на ≥1024). */
  }
}

/* ============================================================
 * Background — pink cables image, mix-blend luminosity per Figma
 * ============================================================ */
.home-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: block;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right center;
    mix-blend-mode: luminosity;
    opacity: 1;
  }
}

/* ============================================================
 * Content stack
 * ============================================================ */
.home-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: to-rem(48);
  align-items: stretch;

  @include mq($from: mobile) {
    align-items: center;
    max-width: var(--container-md);
    margin-inline: auto;
  }
}

/* ============================================================
 * Title block
 * ============================================================ */
.home-hero__title {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(8);
  }
}

.home-hero__title-row {
  display: flex;
  align-items: center;
  gap: to-rem(16);
  width: 100%;

  @include mq($from: mobile) {
    justify-content: center;
    gap: to-rem(24);
  }
}

.home-hero__title-text {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(72);
  line-height: 1.111;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: left;
  white-space: nowrap;

  @include mq($from: mobile) {
    text-align: center;
  }
}

.home-hero__title-text--bottom {
  display: block;
  width: 100%;
  /* На мобайл/таблет позволяем переносить, чтобы длинная фраза не обрезалась. */
  white-space: normal;

  @include mq($from: mobile) {
    white-space: nowrap;
  }
}

/* ============================================================
 * Scroll button (circle with arrow)
 * ============================================================ */
.home-hero__scroll {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: to-rem(16);
  width: to-rem(56);
  height: to-rem(56);
  background: transparent;
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  color: var(--color-icon-primary);
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-brand-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  @include mq($from: mobile) {
    padding: to-rem(16);
    width: to-rem(80);
    height: to-rem(80);
    border-width: 3px;
  }
}

.home-hero__scroll-icon {
  width: to-rem(24);
  height: to-rem(24);

  @include mq($from: mobile) {
    width: to-rem(48);
    height: to-rem(48);
  }
}

/* ============================================================
 * Actions
 * ============================================================ */
.home-hero__actions {
  display: flex;
  flex-direction: column;
  gap: to-rem(8);
  width: 100%;

  & > :deep(.base-button) {
    width: 100%;
  }

  @include mq($from: mobile) {
    flex-direction: row;
    justify-content: center;
    gap: to-rem(8);
    width: to-rem(336);

    & > :deep(.base-button) {
      flex: 1 0 0;
      width: auto;
    }
  }
}
</style>
