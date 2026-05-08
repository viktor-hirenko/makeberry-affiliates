<script setup lang="ts">
import BackgroundBlobs from '@/components/shared/BackgroundBlobs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { RouteLocationRaw } from 'vue-router'

export interface CTASectionProps {
  titleHtml: string
  cta: { label: string; path: RouteLocationRaw }
  align?: 'center' | 'left'
}

withDefaults(defineProps<CTASectionProps>(), {
  align: 'center',
})
</script>

<template>
  <section class="cta-section" :class="[`cta-section--${align}`]">
    <BackgroundBlobs position="top-right" intensity="medium" />
    <div class="cta-section__inner">
      <h2 class="cta-section__title" v-html="titleHtml" />
      <BaseButton variant="primary" size="large" :to="cta.path">
        {{ cta.label }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.cta-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding-block: 96px;
  background-color: var(--color-bg-page);

  @include mq($until: mobile) {
    padding-block: 64px;
  }
}

.cta-section__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: var(--container-pad-desktop);
  display: flex;
  flex-direction: column;
  gap: 32px;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-tablet);
  }

  @include mq($until: mobile) {
    padding-inline: var(--container-pad-mobile);
  }
}

.cta-section--center .cta-section__inner {
  align-items: center;
  text-align: center;
}

.cta-section__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
</style>
