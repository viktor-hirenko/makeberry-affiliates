<script setup lang="ts">
import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import type { CasinoKeyHighlightsContent } from '@/types/content'

/**
 * Casino → Key Highlights
 *
 * Layout (Figma 3819:4205 / LuckyHills 3861:23240):
 * - Mobile  : title центром, 3 карточки колонкой, gap 20.
 * - Desktop : title центром + sparkle справа — макет: контейнер 200×200,
 *   видимый PNG ~159×159, rotate 15° (node 3861:23258–3861:23259).
 *            3 карточки в ряду с pink-bordered pill-заголовком сверху и
 *            body-описанием в карточке.
 *
 * Сама карточка с pill-заголовком — переиспользуемый `PillHeaderCard`.
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
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/section-patterns' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70.
 * Desktop : px 200, py 100 (Figma).
 * ============================================================ */
.casino-highlights {
  position: relative;
  background-color: var(--color-bg-page);

  @include section-padding($desktop-inline: to-rem(200));
}

.casino-highlights__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: to-rem(48);

  @include container(var(--container-default));

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * Heading: title центром + sparkle справа от него.
 * На mobile sparkle сразу справа от заголовка (не abs).
 * ============================================================ */
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
  /* Figma 3861:23259: inner artwork ~159×159 inside 200×200 wrapper */
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

/* ============================================================
 * Grid: 1 col mobile, 2 col tablet, 3 col desktop.
 * Карточки по высоте равны (align-items: stretch).
 * ============================================================ */
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

/* Карточка целиком — `PillHeaderCard`. Внутренний layout/типографика — там же. */
</style>
