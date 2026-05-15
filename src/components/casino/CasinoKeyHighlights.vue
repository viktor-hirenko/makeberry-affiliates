<script setup lang="ts">
import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import type { CasinoKeyHighlightsContent } from '@/types/content'

/**
 * Casino → Key Highlights — Figma 3819:4205 / LuckyHills 3861:23240.
 * Карточка — переиспользуемый `PillHeaderCard`; sparkle справа от title
 * (Figma 3861:23258–3861:23259), inner artwork ~159×159 в контейнере 200×200.
 */
interface Props {
  content: CasinoKeyHighlightsContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-highlights" data-section="casino-highlights">
    <div class="casino-highlights__inner">
      <div class="casino-highlights__heading">
        <h2 class="casino-highlights__title">{{ content.title }}</h2>
        <img
          :src="content.decoration.src"
          :alt="content.decoration.alt"
          class="casino-highlights__decoration"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </div>

      <ul class="casino-highlights__grid" role="list">
        <PillHeaderCard v-for="card in content.cards" :key="card.id" :title="card.title">
          <p>{{ card.description }}</p>
        </PillHeaderCard>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-highlights {
  position: relative;

  @include section-padding($desktop-inline: to-rem(200));
}

.casino-highlights__inner {
  position: relative;
  @include section-stack;
  @include container(var(--container-default));
}

/* Sparkle стоит inline справа от заголовка (не absolute). */
.casino-highlights__heading {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(12);

  @include mq($from: desktop) {
    gap: to-rem(20);
  }
}

.casino-highlights__title {
  @include font-section-title;
}

.casino-highlights__decoration {
  display: none;
  flex-shrink: 0;
  width: to-rem(48);
  height: to-rem(48);
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  translate: 0 to-rem(15);

  @include mq($from: tablet) {
    display: block;
    width: to-rem(160);
    height: to-rem(160);
    translate: 0 to-rem(10);
  }

  @include mq($from: desktop) {
    width: to-rem(200);
    height: to-rem(200);
  }
}

.casino-highlights__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(20);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
