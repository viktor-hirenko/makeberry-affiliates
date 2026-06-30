<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { CasinoBottomCtaContent } from '@/types/content'

/**
 * Casino → Bottom CTA.
 */
interface Props {
  content: CasinoBottomCtaContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-cta" data-section="casino-bottom-cta">
    <div class="casino-cta__inner">
      <p class="casino-cta__text">
        <span class="casino-cta__text-primary">{{ content.textPrimary }}</span>
        <span class="casino-cta__text-secondary">{{ content.textSecondary }}</span>
      </p>

      <div class="casino-cta__buttons">
        <template v-for="button in content.buttons" :key="button.label">
          <BaseButton
            v-if="button.external"
            :variant="button.variant"
            size="large"
            :href="button.href"
            rel="sponsored nofollow noopener noreferrer"
            class="casino-cta__button"
            analytics-location="casino_bottom_cta"
            :analytics-label="button.label"
          >
            {{ button.label }}
          </BaseButton>
          <BaseButton
            v-else
            :variant="button.variant"
            size="large"
            :to="button.href"
            class="casino-cta__button"
            analytics-location="casino_bottom_cta"
            :analytics-label="button.label"
          >
            {{ button.label }}
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-cta {
  @include section-padding();
}

.casino-cta__inner {
  @include section-stack($align: center, $gap-mobile: to-rem(40));
  @include container(var(--container-cta));
}

.casino-cta__text {
  margin: 0;
  width: 100%;
  text-align: center;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-tertiary);

  @include mq($from: tablet) {
    font-size: to-rem(40);
    line-height: to-rem(48);
    letter-spacing: to-rem(-0.4);
  }
}

.casino-cta__text-primary {
  color: var(--color-text-primary);
}

.casino-cta__text-secondary {
  color: var(--color-text-tertiary);
}

.casino-cta__buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(12);
  width: 100%;
  max-width: to-rem(360);

  @include mq($from: mobile) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: to-rem(8);
    width: auto;
    max-width: none;
  }
}

.casino-cta__button {
  width: 100%;
  text-align: center;

  @include mq($from: mobile) {
    width: to-rem(250);
  }
}
</style>
