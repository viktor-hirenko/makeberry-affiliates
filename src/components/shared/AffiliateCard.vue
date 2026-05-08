<script setup lang="ts">
import type { WhatYouGetCard } from '@/types/content'

interface AffiliateCardProps {
  card: WhatYouGetCard
}

defineProps<AffiliateCardProps>()
</script>

<template>
  <article class="affiliate-card">
    <div class="affiliate-card__media">
      <img
        v-if="card.illustrationSrc"
        :src="card.illustrationSrc"
        :alt="card.illustrationAlt || ''"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="affiliate-card__body">
      <h3 class="affiliate-card__title">{{ card.title }}</h3>
      <div class="affiliate-card__copy" v-html="card.descriptionHtml" />
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.affiliate-card {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 64px;
  padding: 32px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 32px;
  align-items: center;

  @include mq($until: tablet) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px;
  }
}

.affiliate-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 1, 128, 0.18), rgba(255, 1, 128, 0.04));
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.affiliate-card__title {
  margin: 0 0 16px;
  font-size: clamp(1.5rem, 2.4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.affiliate-card__copy {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;

  :deep(p) {
    margin: 0 0 12px;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    color: var(--color-text-primary);
    font-weight: 600;
  }

  :deep(ul) {
    list-style: disc;
    margin: 0 0 12px;
    padding-left: 20px;
  }

  :deep(li) {
    margin-bottom: 4px;
  }
}
</style>
