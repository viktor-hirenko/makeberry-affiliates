<script setup lang="ts">
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
 * Карточка-обвязка: bg-surface, radius 44, border subtle.
 * Pill-заголовок:    bg-page, border 2px brand, radius pill, padding 24.
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
        <li v-for="card in content.cards" :key="card.id" class="casino-highlights__card">
          <div class="casino-highlights__card-pill">
            <span class="casino-highlights__card-title">{{ card.title }}</span>
          </div>
          <p class="casino-highlights__card-text">{{ card.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
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
  padding: to-rem(70) to-rem(16);

  @include mq($from: mobile) {
    padding-inline: to-rem(32);
  }

  @include mq($from: tablet) {
    padding: to-rem(100) to-rem(60);
  }

  @include mq($from: desktop) {
    padding-inline: to-rem(200);
  }
}

.casino-highlights__inner {
  position: relative;
  width: 100%;
  max-width: var(--container-default);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: to-rem(48);

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
  margin: 0;
  color: var(--color-text-primary);
  text-align: center;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: to-rem(-0.36);

  @include mq($from: tablet) {
    @include font-h3;
  }
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

  @include mq($from: tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mq($from: desktop) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ============================================================
 * Card — bg-surface, radius 44 по Figma, border subtle.
 * ============================================================ */
.casino-highlights__card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: to-rem(44);
}

/* Pill-заголовок: bg-page (черная заливка), 2px розовый border,
 * pill-радиус, padding 20 mobile / 24 desktop. */
.casino-highlights__card-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(20);
  background-color: var(--color-bg-page);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

.casino-highlights__card-title {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    @include font-h4;
  }
}

.casino-highlights__card-text {
  margin: 0;
  padding: to-rem(20);
  text-align: center;
  color: var(--color-text-secondary);
  @include font-body-s-regular;

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}
</style>
