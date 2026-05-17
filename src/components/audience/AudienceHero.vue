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
        <source media="(min-width: 1024px)" srcset="/images/hero/audience-bg-desktop.webp" />
        <img
          src="/images/hero/audience-bg-mobile.webp"
          alt=""
          loading="eager"
          decoding="async"
          fetchpriority="high"
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
  height: 100dvh;
  min-height: fit-content;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $mobile-top: to-rem(70),
    $mobile-bottom: to-rem(70),
    $desktop-top: to-rem(200),
    $desktop-bottom: to-rem(100)
  );

  @include mq($from: mobile) {
    padding-top: to-rem(100);
    padding-bottom: to-rem(100);
  }

  @include mq($from: tablet) {
    padding-top: to-rem(150);
  }

  @include landscape-phone {
    height: auto;
    min-height: auto;
    padding-top: to-rem(100);
  }
}

.audience-hero__inner {
  @include container(var(--container-xl));
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
    display: block;
    top: 0;
    right: 0;
    width: 200%;
    height: auto;
  }

  @include mq($from: mobile) {
    img {
      width: 160%;
    }
  }

  @include mq($from: tablet) {
    img {
      top: 0;
      right: 0;
      width: 130%;
    }
  }

  @include mq($from: desktop) {
    img {
      top: 0;
      right: 0;
      width: 110%;
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

  @include mq($from: mobile) {
    gap: to-rem(48);
    max-width: to-rem(518);
    align-items: flex-start;
  }
}

.audience-hero__text {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(40);
  }
}

.audience-hero__title-block {
  display: flex;
  flex-direction: column;
  gap: to-rem(24);
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

  @include mq($from: mobile) {
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

  @include mq($from: mobile) {
    font-size: to-rem(18);
    letter-spacing: to-rem(-0.18);
  }
}

.audience-hero__cta {
  align-self: stretch;

  @include mq($from: mobile) {
    align-self: flex-start;
  }

  @include landscape-phone {
    align-self: start;
  }
}
</style>
