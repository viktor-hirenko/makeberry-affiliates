<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { PageHeroBlock } from '@/types/content'

/**
 * Hero страницы-аудитории (`/affiliates`, `/advertisers`).
 */
interface Props {
  hero: PageHeroBlock
}

defineProps<Props>()
</script>

<template>
  <section class="audience-hero" data-section="hero">
    <div class="audience-hero__inner">
      <picture class="audience-hero__decor" aria-hidden="true">
        <source media="(min-width: 1024px)" srcset="/images/hero/audience-cables-desktop.webp" />
        <img
          src="/images/hero/audience-cables-mobile.webp"
          alt=""
          loading="eager"
          decoding="async"
          fetchpriority="high"
          width="630"
          height="634"
        />
      </picture>

      <div class="audience-hero__content">
        <div class="audience-hero__text">
          <div class="audience-hero__title-block">
            <span v-if="hero.badge" class="audience-hero__badge">{{ hero.badge }}</span>
            <h1 class="audience-hero__title" v-html="hero.titleHtml" />
          </div>
          <p class="audience-hero__copy" v-html="hero.subtitleHtml" />
        </div>

        <BaseButton
          v-if="hero.cta"
          variant="primary"
          size="large"
          :to="hero.cta.href ? undefined : hero.cta.path"
          :href="hero.cta.href"
          class="audience-hero__cta"
        >
          {{ hero.cta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.audience-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100dvh;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $mobile-top: to-dvh(200, 740),
    $mobile-bottom: to-rem(70),
    $desktop-top: to-rem(200),
    $desktop-bottom: to-rem(100)
  );

  @include mq($from: tablet) {
    min-height: 100vh;
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

.audience-hero__inner {
  @include container(var(--container-xl));
  display: flex;
  flex-grow: 1;
}

.audience-hero__decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  display: block;
  overflow: hidden;

  img {
    position: absolute;
    max-width: none;
    top: to-dvh(-24, 740);
    right: to-vw(-10.5, 360);
    width: to-vw(315, 360);
    height: to-dvh(317, 740);

    @include mq($from: mobile) {
      top: to-vw(-24, 600);
      right: to-vw(-10.5, 600);
      width: to-vw(315, 600);
      height: to-vw(317, 600);
    }

    @include mq($from: laptop) {
      right: to-vw(-42, 1440);
      width: to-vw(887, 1440);
      height: to-vw(971, 1440);
    }
  }
}

.audience-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: to-rem(40);
  width: 100%;
  align-items: stretch;
  justify-content: space-between;

  @include mq($from: compact) {
    gap: to-rem(48);
    max-width: to-rem(518);
    align-items: flex-start;
    justify-content: start;
  }
}

.audience-hero__text {
  display: flex;
  flex-direction: column;
  gap: to-dvh(32, 740);
  width: 100%;

  @include mq($from: compact) {
    gap: to-rem(40);
  }
}

.audience-hero__title-block {
  display: flex;
  flex-direction: column;
  gap: to-dvh(24, 740);
  width: 100%;
}

.audience-hero__badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: to-rem(8) to-rem(12);
  background-color: var(--color-bg-subtle);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: to-rem(-0.14);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.audience-hero__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: to-rem(-0.4);
  color: var(--color-text-primary);

  @include mq($from: compact) {
    font-size: to-rem(64);
    line-height: to-rem(72);
    letter-spacing: to-rem(-0.64);
  }
}

.audience-hero__copy {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: to-rem(-0.16);
  color: var(--color-text-secondary);

  @include mq($from: compact) {
    font-size: to-rem(18);
    letter-spacing: to-rem(-0.18);
  }
}

.audience-hero__cta {
  align-self: stretch;

  @include mq($from: compact) {
    align-self: start;
  }

  @include landscape-phone {
    align-self: start;
  }
}
</style>
