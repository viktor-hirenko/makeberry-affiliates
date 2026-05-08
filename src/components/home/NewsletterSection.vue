<script setup lang="ts">
import NewsletterForm from '@/components/shared/NewsletterForm.vue'
import type { NewsletterSection as NewsletterData } from '@/types/content'

defineProps<{ data: NewsletterData }>()
</script>

<template>
  <section class="newsletter section">
    <div class="newsletter__inner">
      <div class="newsletter__copy">
        <h2>{{ data.title }}</h2>
        <p>{{ data.subtitle }}</p>
      </div>
      <NewsletterForm :placeholder="data.placeholder" :button-label="data.buttonLabel" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.newsletter__inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-desktop);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 48px;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-tablet);
    grid-template-columns: 1fr;
  }

  @include mq($until: mobile) {
    padding-inline: var(--container-pad-mobile);
    gap: 24px;
  }
}

.newsletter__copy {
  h2 {
    margin: 0 0 12px;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 1.0625rem;
    line-height: 1.5;
  }
}
</style>
