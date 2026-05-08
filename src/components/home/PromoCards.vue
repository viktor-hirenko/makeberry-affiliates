<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { AffiliatePromoCard } from '@/types/content'

defineProps<{ cards: AffiliatePromoCard[] }>()
</script>

<template>
  <section class="promo-cards section">
    <div class="promo-cards__inner">
      <article v-for="card in cards" :key="card.id" class="promo-cards__card">
        <h2 class="promo-cards__title">{{ card.title }}</h2>
        <p class="promo-cards__desc">{{ card.description }}</p>
        <div class="promo-cards__actions">
          <BaseButton variant="primary" size="large" :to="card.primaryCta.path">
            {{ card.primaryCta.label }}
          </BaseButton>
          <BaseButton variant="tetriary" size="large" :to="card.secondaryCta.path">
            {{ card.secondaryCta.label }}
          </BaseButton>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.promo-cards__inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-desktop);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-tablet);
    grid-template-columns: 1fr;
  }

  @include mq($until: mobile) {
    padding-inline: var(--container-pad-mobile);
  }
}

.promo-cards__card {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 32px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 360px;
  position: relative;
  overflow: hidden;
  transition: border-color var(--transition-base);

  &::after {
    content: '';
    position: absolute;
    inset: -50% -20% auto auto;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(255, 1, 128, 0.4), transparent 60%);
    filter: blur(50px);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(255, 1, 128, 0.4);
  }
}

.promo-cards__title {
  margin: 0;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.promo-cards__desc {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
  flex: 1;
}

.promo-cards__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
