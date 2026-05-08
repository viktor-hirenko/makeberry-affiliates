<script setup lang="ts">
import BaseCarousel from '@/components/shared/BaseCarousel.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { TeamMember } from '@/types/content'

defineProps<{ title: string; members: TeamMember[] }>()
</script>

<template>
  <section id="contacts" class="team section">
    <div class="team__inner">
      <SectionTitle align="left" size="md">{{ title }}</SectionTitle>
      <BaseCarousel
        :items="members"
        :options="{
          slidesPerView: 1.2,
          spaceBetween: 16,
          breakpoints: {
            768: { slidesPerView: 2.2, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          },
        }"
        aria-label="Team contacts"
      >
        <template #default="{ item }">
          <article class="team__card">
            <figure class="team__photo">
              <img
                :src="(item as TeamMember).photoSrc"
                :alt="(item as TeamMember).photoAlt"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <h3>{{ (item as TeamMember).name }}</h3>
            <p>{{ (item as TeamMember).role }}</p>
            <div class="team__socials">
              <a
                v-if="(item as TeamMember).linkedin"
                :href="(item as TeamMember).linkedin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <BaseIcon name="linkedin" :size="24" />
              </a>
              <a
                v-if="(item as TeamMember).telegram"
                :href="(item as TeamMember).telegram"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <BaseIcon name="telegram" :size="24" />
              </a>
            </div>
          </article>
        </template>
      </BaseCarousel>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.team__inner {
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

.team__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  height: 100%;
  text-align: left;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
}

.team__photo {
  margin: 0;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.team__socials {
  display: flex;
  gap: 8px;
  margin-top: auto;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-pill);
    color: var(--color-text-primary);
    background-color: rgba(255, 255, 255, 0.06);
    transition: background-color var(--transition-base);

    &:hover {
      background-color: rgba(255, 1, 128, 0.2);
      color: var(--color-brand);
    }
  }
}
</style>
