<script setup lang="ts">
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { AboutCenterVisual, AboutStat } from '@/types/content'

interface AboutBlocksProps {
  title: string
  stats: AboutStat[]
  center?: AboutCenterVisual
}

defineProps<AboutBlocksProps>()
</script>

<template>
  <section id="about" class="about-blocks section">
    <div class="about-blocks__inner">
      <SectionTitle align="center" size="lg">{{ title }}</SectionTitle>
      <div class="about-blocks__grid">
        <article
          v-for="(stat, index) in stats"
          :key="stat.id"
          class="about-blocks__stat"
          :data-index="index"
        >
          <span class="about-blocks__value">{{ stat.value }}</span>
          <p class="about-blocks__desc">{{ stat.description }}</p>
        </article>
        <div v-if="center" class="about-blocks__center" aria-hidden="true">
          <img :src="center.imageSrc" :alt="center.imageAlt" loading="lazy" decoding="async" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.about-blocks__inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-desktop);
  display: flex;
  flex-direction: column;
  gap: 64px;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-tablet);
    gap: 48px;
  }

  @include mq($until: mobile) {
    padding-inline: var(--container-pad-mobile);
    gap: 32px;
  }
}

.about-blocks__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  gap: 16px;
  position: relative;

  @include mq($until: tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq($until: mobile) {
    grid-template-columns: 1fr;
  }
}

.about-blocks__stat {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  transition: border-color var(--transition-base);

  &:hover {
    border-color: rgba(255, 1, 128, 0.4);
  }
}

.about-blocks__value {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-brand);
}

.about-blocks__desc {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.about-blocks__center {
  display: none;

  @include mq($from: tablet) {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 2 / 4;
    grid-row: 1 / 3;
    background: radial-gradient(circle, rgba(255, 1, 128, 0.25), transparent 70%);
    border-radius: 32px;

    img {
      width: 60%;
      max-width: 240px;
      filter: drop-shadow(0 12px 32px rgba(255, 1, 128, 0.4));
    }
  }
}
</style>
