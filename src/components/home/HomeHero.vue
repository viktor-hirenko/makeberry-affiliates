<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeHero } from '@/composables/useContent'

const hero = useHomeHero()
</script>

<template>
  <section id="hero" class="home-hero" data-section="hero">
    <picture class="home-hero__bg" aria-hidden="true">
      <source media="(min-width: 768px)" :srcset="hero.background.desktop" />
      <img
        :src="hero.background.mobile"
        :alt="hero.background.alt"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width="720"
        height="1252"
      />
    </picture>

    <div class="home-hero__content">
      <h1 class="home-hero__title">
        <span class="home-hero__title-row">
          <span class="home-hero__title-text">{{ hero.titleLineLeft }}</span>
          <span class="home-hero__title-decor" aria-hidden="true">
            <BaseIcon :name="hero.titleDecor.icon" :size="48" class="home-hero__title-decor-icon" />
          </span>
        </span>
        <span class="home-hero__title-text home-hero__title-text--bottom">
          {{ hero.titleLineBottom }}
        </span>
      </h1>

      <div class="home-hero__actions">
        <BaseButton
          variant="primary"
          size="large"
          :to="hero.primaryCta.path"
          analytics-location="home_hero"
          :analytics-label="hero.primaryCta.label"
        >
          {{ hero.primaryCta.label }}
        </BaseButton>
        <BaseButton
          variant="secondary"
          size="large"
          :to="hero.secondaryCta.path"
          analytics-location="home_hero"
          :analytics-label="hero.secondaryCta.label"
        >
          {{ hero.secondaryCta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  height: 100dvh;
  min-height: fit-content;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $mobile-top: to-dvh(200, 740),
    $mobile-bottom: to-rem(70),
    $desktop-top: to-rem(150),
    $desktop-bottom: to-rem(150)
  );

  @include mq($from: mobile) {
    padding-top: to-rem(100);
  }

  @include mq($from: tablet) {
    padding-top: to-rem(150);
  }

  @include mq($from: desktop) {
    padding-top: to-dvh(200, 900);
  }

  @include landscape-phone {
    height: auto;
    min-height: auto;
    padding-top: to-rem(100);
  }
}

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
  }
}

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
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: left;
  white-space: nowrap;

  font-size: to-rem(48);
  line-height: 1.16667;

  @include mq($from: mobile) {
    font-size: to-rem(72);
    line-height: 1.111;
    text-align: center;
  }
}

.home-hero__title-text--bottom {
  display: block;
  width: 100%;
  /* <768px: перенос строки, чтобы длинная фраза не обрезалась. */
  white-space: normal;

  @include mq($from: mobile) {
    white-space: nowrap;
  }
}

.home-hero__title-decor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: to-rem(16);
  width: to-rem(56);
  height: to-rem(56);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  color: var(--color-icon-primary);
  pointer-events: none;
  user-select: none;

  @include mq($from: mobile) {
    width: to-rem(80);
    height: to-rem(80);
    border-width: 3px;
  }
}

.home-hero__title-decor-icon {
  width: to-rem(24);
  height: to-rem(24);

  @include mq($from: mobile) {
    width: to-rem(48);
    height: to-rem(48);
  }
}

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
