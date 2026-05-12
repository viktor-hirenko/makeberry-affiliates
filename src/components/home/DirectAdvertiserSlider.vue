<script setup lang="ts">
import BackgroundBlobs from '@/components/shared/BackgroundBlobs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCarousel from '@/components/shared/BaseCarousel.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { DirectAdvertiserSection, PartnerSlide } from '@/types/content'

defineProps<{ data: DirectAdvertiserSection }>()
</script>

<template>
  <section class="direct-advertiser section">
    <BackgroundBlobs position="bottom-right" intensity="soft" />
    <div class="direct-advertiser__inner">
      <SectionTitle align="left" size="md">{{ data.title }}</SectionTitle>
      <BaseCarousel
        :items="data.slides"
        :options="{
          slidesPerView: 1.2,
          spaceBetween: 24,
          breakpoints: {
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          },
        }"
        aria-label="Partner spotlight"
      >
        <template #default="{ item }">
          <component
            :is="(item as PartnerSlide).href ? 'a' : 'div'"
            :href="(item as PartnerSlide).href"
            class="direct-advertiser__slide"
          >
            <img
              :src="(item as PartnerSlide).logoSrc"
              :alt="(item as PartnerSlide).logoAlt"
              loading="lazy"
              decoding="async"
            />
            <span class="direct-advertiser__slide-name">{{ (item as PartnerSlide).name }}</span>
          </component>
        </template>
      </BaseCarousel>

      <div class="direct-advertiser__models">
        <article v-for="model in data.cooperation" :key="model.id" class="direct-advertiser__model">
          <h3>{{ model.title }}</h3>
          <p>{{ model.description }}</p>
        </article>
      </div>

      <div class="direct-advertiser__cta">
        <BaseButton variant="primary" size="large" :to="data.cta.path">
          {{ data.cta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.direct-advertiser {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.direct-advertiser__inner {
  position: relative;
  z-index: 1;
  @include slider-container($gap: 48px, $gap-mobile: 32px);
}

.direct-advertiser__slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 240px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  text-decoration: none;
  color: inherit;
  transition: border-color var(--transition-base);

  img {
    width: 80%;
    max-width: 200px;
    height: auto;
  }

  &:hover {
    border-color: rgba(255, 1, 128, 0.4);
  }
}

.direct-advertiser__slide-name {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.direct-advertiser__models {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @include mq($until: tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq($until: mobile) {
    grid-template-columns: 1fr;
  }
}

.direct-advertiser__model {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-brand);
    font-weight: 600;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9375rem;
    line-height: 1.5;
  }
}

.direct-advertiser__cta {
  display: flex;
  justify-content: center;
}
</style>
