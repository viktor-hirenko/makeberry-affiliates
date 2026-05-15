<script setup lang="ts">
import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import type { CasinoCooperationContent } from '@/types/content'

/**
 * Casino → Cooperation Models (Figma 3819:4246).
 * Карточка целиком — переиспользуемый `PillHeaderCard`; здесь только сетка.
 */
interface Props {
  content: CasinoCooperationContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-coop" data-section="casino-cooperation">
    <div class="casino-coop__inner">
      <h2 class="casino-coop__title">{{ content.title }}</h2>

      <ul class="casino-coop__grid" role="list">
        <PillHeaderCard
          v-for="model in content.models"
          :key="model.id"
          :title="model.title"
          :body-gap="16"
        >
          <p v-for="(line, index) in model.lines" :key="index">{{ line }}</p>
        </PillHeaderCard>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-coop {
  position: relative;

  @include section-padding($desktop-inline: to-rem(120));
}

.casino-coop__inner {
  @include section-stack($align: center);
  @include container(var(--container-2xl));
}

.casino-coop__title {
  @include font-section-title;
}

/* align-items: stretch — pill-заголовки выровнены по верху,
 * высоты карточек равны при разной длине описаний. */
.casino-coop__grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(20);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}
</style>
