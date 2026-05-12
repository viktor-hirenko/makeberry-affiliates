<script setup lang="ts">
import BaseCarousel from '@/components/shared/BaseCarousel.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import Tag from '@/components/ui/Tag.vue'
import type { VacancyCard } from '@/types/content'

defineProps<{ title: string; cards: VacancyCard[] }>()
</script>

<template>
  <section class="vacancies section">
    <div class="vacancies__inner">
      <SectionTitle align="left" size="md">{{ title }}</SectionTitle>
      <BaseCarousel
        :items="cards"
        :options="{
          slidesPerView: 1.1,
          spaceBetween: 16,
          breakpoints: {
            768: { slidesPerView: 2.1, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          },
        }"
        aria-label="Open vacancies"
      >
        <template #default="{ item }">
          <article class="vacancies__card">
            <Tag size="sm">{{ (item as VacancyCard).type }}</Tag>
            <h3>{{ (item as VacancyCard).title }}</h3>
            <p>{{ (item as VacancyCard).description }}</p>
            <BaseButton
              variant="tetriary"
              size="small"
              :href="(item as VacancyCard).learnMoreHref"
            >
              Learn more
            </BaseButton>
          </article>
        </template>
      </BaseCarousel>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.vacancies__inner {
  @include slider-container;
}

.vacancies__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  height: 100%;
  min-height: 320px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  transition: border-color var(--transition-base);

  &:hover {
    border-color: rgba(255, 1, 128, 0.4);
  }

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
    flex: 1;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }
}
</style>
