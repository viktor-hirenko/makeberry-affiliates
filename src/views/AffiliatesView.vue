<script setup lang="ts">
import PageHero from '@/components/page/PageHero.vue'
import WhatYouGetSection from '@/components/page/WhatYouGetSection.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useAffiliatesPage } from '@/composables/useContent'

const page = useAffiliatesPage()
</script>

<template>
  <article class="affiliates-page">
    <PageHero :hero="page.hero" />

    <WhatYouGetSection
      :title="page.whatYouGet.title"
      :cards="page.whatYouGet.cards"
    />

    <section
      class="affiliates-cta"
      data-section="affiliates-cta"
      aria-label="Call to action"
    >
      <img
        src="/images/casino/cta/glow.png"
        alt=""
        class="affiliates-cta__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />
      <div class="affiliates-cta__inner">
        <p class="affiliates-cta__text" v-html="page.cta.titleHtml" />
        <BaseButton
          variant="primary"
          size="large"
          :to="page.cta.button.path"
          class="affiliates-cta__btn"
        >
          {{ page.cta.button.label }}
        </BaseButton>
      </div>
    </section>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/units' as *;

.affiliates-page {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
}

/* ============================================================
 * CTA (Figma 2653:1262)
 *
 * Mobile  : px 16, py 70, gap 48, text 24/32 центром.
 * Desktop : px 160, py 100, gap 70, text 40/48 центром, ширина 974 px.
 * Glow PNG (rotated -177°) в правом-нижнем квадранте, выходит за
 * правую границу секции — отсюда overflow-x: clip на section.
 * ============================================================ */
.affiliates-cta {
  position: relative;
  background-color: var(--color-bg-page);
  overflow-x: clip;
  padding: to-rem(70) var(--container-pad-mobile);

  @include mq($from: tablet) {
    padding: to-rem(100) var(--container-pad-desktop);
  }

  @include mq($from: desktop) {
    padding: to-rem(100) to-rem(160);
  }
}

.affiliates-cta__glow {
  position: absolute;
  bottom: to-rem(-100);
  right: to-rem(-220);
  width: to-rem(700);
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  rotate: -177deg;

  @include mq($from: tablet) {
    bottom: to-rem(-150);
    right: to-rem(-360);
    width: to-rem(1244);
  }
}

.affiliates-cta__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(974);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: to-rem(40);

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

.affiliates-cta__text {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    font-size: to-rem(40);
    line-height: to-rem(48);
  }

  :deep(.primary) {
    color: var(--color-text-primary);
  }

  :deep(.muted) {
    color: var(--color-text-tertiary);
  }
}

.affiliates-cta__btn {
  align-self: stretch;

  @include mq($from: tablet) {
    align-self: center;
  }
}
</style>
