<script setup lang="ts">
import BaseCarousel from '@/components/shared/BaseCarousel.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { ConferenceEvent } from '@/types/content'

defineProps<{ title: string; events: ConferenceEvent[] }>()
</script>

<template>
  <section class="meet-us section">
    <div class="meet-us__inner">
      <SectionTitle align="left" size="md">{{ title }}</SectionTitle>
      <BaseCarousel
        :items="events"
        :options="{
          slidesPerView: 1.1,
          spaceBetween: 16,
          breakpoints: {
            768: { slidesPerView: 2.1, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          },
        }"
        aria-label="Conferences and events"
      >
        <template #default="{ item }">
          <article class="meet-us__card">
            <header class="meet-us__head">
              <img
                :src="(item as ConferenceEvent).logoSrc"
                :alt="(item as ConferenceEvent).logoAlt"
                loading="lazy"
                decoding="async"
              />
              <span class="meet-us__date">{{ (item as ConferenceEvent).dateLabel }}</span>
            </header>
            <h3>{{ (item as ConferenceEvent).name }}</h3>
            <ul class="meet-us__locations">
              <li v-for="loc in (item as ConferenceEvent).locationLabels" :key="loc">{{ loc }}</li>
            </ul>
          </article>
        </template>
      </BaseCarousel>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.meet-us__inner {
  @include slider-container;
}

.meet-us__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  min-height: 280px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  height: 100%;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
}

.meet-us__head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 64px;
    height: 32px;
    object-fit: contain;
  }
}

.meet-us__date {
  font-size: 0.8125rem;
  color: var(--color-brand);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.meet-us__locations {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    padding: 4px 10px;
    border-radius: var(--radius-pill);
    background-color: rgba(255, 255, 255, 0.04);
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
}
</style>
