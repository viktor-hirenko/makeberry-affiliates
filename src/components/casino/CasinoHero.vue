<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { CasinoHero } from '@/types/content'

/** Per-page правки лого — в CasinoView (`.casino-page--rocketplay`). */
interface Props {
  hero: CasinoHero
}

defineProps<Props>()
</script>

<template>
  <section class="casino-hero" data-section="casino-hero">
    <div class="casino-hero__inner">
      <div class="casino-hero__text">
        <h1 class="casino-hero__title">{{ hero.title }}</h1>

        <div class="casino-hero__body">
          <p class="casino-hero__intro">{{ hero.intro }}</p>

          <ul class="casino-hero__stats" role="list">
            <li v-for="stat in hero.stats" :key="stat.number" class="casino-hero__stat">
              <p class="casino-hero__stat-number">{{ stat.number }}</p>
              <p class="casino-hero__stat-title">
                <span class="casino-hero__stat-strong">{{ stat.titleStrong }}</span>
                <span v-if="stat.titleRest">{{ stat.titleRest }}</span>
              </p>
            </li>
          </ul>
        </div>

        <BaseButton
          variant="primary"
          size="large"
          :href="hero.cta.href"
          rel="sponsored nofollow noopener noreferrer"
          class="casino-hero__cta"
          analytics-location="casino_hero"
          :analytics-label="hero.cta.label"
        >
          {{ hero.cta.label }}
        </BaseButton>
      </div>

      <div class="casino-hero__logo-wrap">
        <img
          :src="hero.logo.src"
          :alt="hero.logo.alt"
          class="casino-hero__logo"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-hero {
  position: relative;
  overflow: hidden;
  min-height: 100dvh;

  @include section-padding(
    $mobile-top: to-rem(70),
    $mobile-bottom: to-rem(70),
    $desktop-top: to-rem(230),
    $desktop-bottom: to-rem(100)
  );

  @include mq($from: compact) {
    height: auto;
    padding-top: to-rem(100);
  }

  @include mq($from: narrow-tablet) {
    display: flex;
    align-items: center;
    padding-top: to-rem(230);
    padding-bottom: to-rem(100);
  }

  @include mq($from: laptop) {
    padding-bottom: to-rem(100);
  }
}

.casino-hero__inner {
  display: flex;
  height: 100%;
  justify-content: start;
  flex-direction: column-reverse;
  gap: to-rem(20);

  @include container(var(--container-default));

  @include mq($from: narrow-tablet) {
    position: relative;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }
}

/* < 768px: stretch нужен для full-width CTA (с ≥768px — fit-content). */
.casino-hero__text {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-grow: 1;
  gap: to-rem(32);
  width: 100%;
  max-width: to-rem(570);

  @include mq($from: narrow-tablet) {
    flex: 0 1 to-rem(400);
    flex: 0 0 calc(570 / 1040 * 100%);
    width: calc(570 / 1040 * 100%);
    gap: to-rem(48);
  }
}

/* < 1024px: кастомный 40/48, не font-h2. */
.casino-hero__title {
  margin: 0;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: -0.01em;

  @include mq($from: compact) {
    @include font-h2;
    white-space: nowrap;
  }
}

.casino-hero__body {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: narrow-tablet) {
    gap: to-rem(40);
  }
}

.casino-hero__intro {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-s-regular;

  @include mq($from: compact) {
    @include font-body-l-regular;
  }
}

.casino-hero__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: to-rem(24);
  width: 100%;

  @include mq($from: narrow-tablet) {
    flex-wrap: nowrap;
    align-items: stretch;
  }
}

.casino-hero__stat {
  display: flex;
  flex-direction: column;
  gap: to-rem(12);
  flex: 0 0 to-rem(140);
  width: to-rem(140);

  @include mq($from: compact) {
    width: to-rem(150);
    flex: 0 0 to-rem(150);
  }

  @include mq($from: narrow-tablet) {
    flex: 1 0 0;
    min-width: 0;
    width: auto;

    & + & {
      padding-left: to-rem(24);
      border-left: 1px solid var(--color-border-subtle);
    }
  }
}

.casino-hero__stat-number {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: to-rem(-0.4);
  color: #404040;
}

.casino-hero__stat-title {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-l-regular;
}

.casino-hero__stat-strong {
  font-weight: 600;
}

.casino-hero__cta {
  align-self: stretch;
  margin-top: auto;

  @include mq($from: compact) {
    width: fit-content;
  }

  @include mq($from: mobile) {
    align-self: flex-start;
  }
}

.casino-hero__logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  flex: 0 0 auto;
  width: calc(200 / 360 * 100%);
  height: auto;
  min-width: to-rem(200);
  max-width: to-rem(280);

  @include mq($from: compact) {
    max-width: to-rem(360);
    align-self: start;
  }

  @include mq($from: narrow-tablet) {
    position: absolute;
    right: to-rem(-80);
    z-index: -1;
    max-width: 100%;
    align-self: start;
    flex: 0 0 auto;
    align-self: unset;
    max-width: to-rem(560);
    height: auto;
    transform: translateY(to-rem(-36px));
  }
}

.casino-hero__logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}
</style>
