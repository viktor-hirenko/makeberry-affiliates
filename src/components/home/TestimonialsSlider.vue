<script setup lang="ts">
import BaseCarousel from '@/components/shared/BaseCarousel.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { Testimonial } from '@/types/content'

defineProps<{ title: string; items: Testimonial[] }>()
</script>

<template>
  <section class="testimonials section">
    <div class="testimonials__inner">
      <SectionTitle align="left" size="md">{{ title }}</SectionTitle>
      <BaseCarousel
        :items="items"
        :options="{
          slidesPerView: 1.05,
          spaceBetween: 16,
          breakpoints: {
            768: { slidesPerView: 2.1, spaceBetween: 24 },
            1024: { slidesPerView: 2.5, spaceBetween: 24 },
          },
        }"
        aria-label="Partner testimonials"
      >
        <template #default="{ item }">
          <figure
            class="testimonials__card"
            :class="{ 'testimonials__card--featured': (item as Testimonial).featured }"
          >
            <blockquote>“{{ (item as Testimonial).quote }}”</blockquote>
            <figcaption>
              <img
                v-if="(item as Testimonial).avatarSrc"
                :src="(item as Testimonial).avatarSrc"
                :alt="(item as Testimonial).avatarAlt || ''"
                loading="lazy"
                decoding="async"
              />
              <div>
                <span class="testimonials__name">{{ (item as Testimonial).name }}</span>
                <span v-if="(item as Testimonial).role" class="testimonials__role">{{
                  (item as Testimonial).role
                }}</span>
              </div>
            </figcaption>
          </figure>
        </template>
      </BaseCarousel>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.testimonials__inner {
  width: 100%;
  max-width: var(--container-max);
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

.testimonials__card {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  height: 100%;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;

  blockquote {
    margin: 0;
    color: var(--color-text-primary);
    font-size: 1.125rem;
    line-height: 1.5;
    flex: 1;
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}

.testimonials__card--featured {
  border-color: rgba(255, 1, 128, 0.6);
  background: linear-gradient(135deg, rgba(255, 1, 128, 0.18), rgba(255, 1, 128, 0.04));
}

.testimonials__name {
  display: block;
  font-weight: 600;
}

.testimonials__role {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
