<script setup lang="ts">
import type { CasinoCooperationContent } from '@/types/content'

/**
 * Casino → Cooperation Models (Figma 3819:4246)
 *
 * Layout:
 * - Mobile  : 4 карточки колонкой, gap 20.
 * - Desktop : 4 карточки в ряду равной ширины (max-width 1200px),
 *            каждая — pill-заголовок поверх + многострочное описание.
 *
 * Структура карточки (одна для всех 4):
 *   bg-surface, rounded-44, border subtle
 *   ├─ pill-header: bg-page, 2px brand-border, pill-radius, p 24
 *   └─ body: padding 24, multi-paragraph description
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
        <li v-for="model in content.models" :key="model.id" class="casino-coop__card">
          <div class="casino-coop__pill">
            <span class="casino-coop__pill-text">{{ model.title }}</span>
          </div>
          <div class="casino-coop__body">
            <p v-for="(line, index) in model.lines" :key="index" class="casino-coop__line">
              {{ line }}
            </p>
          </div>
        </li>
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
.casino-coop {
  position: relative;
  background-color: var(--color-bg-page);

  @include section-padding($desktop-inline: to-rem(120));
}

.casino-coop__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);

  @include container(var(--container-2xl));

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * Title — 36/40 mobile, H3 56/64 desktop. Center.
 * ============================================================ */
.casino-coop__title {
  @include font-section-title;
}

/* ============================================================
 * Grid: 1 col mobile, 4 col desktop (по Figma — 4 в ряд).
 * Карточки align-items: stretch чтобы pill-headers были на одной
 * горизонтали и общие высоты карточек равны.
 * ============================================================ */
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

/* ============================================================
 * Card — bg-surface, radius 44, border subtle.
 * ============================================================ */
.casino-coop__card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: to-rem(44);
}

.casino-coop__pill {
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

.casino-coop__pill-text {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-primary);
  text-align: center;
  white-space: nowrap;

  @include mq($from: tablet) {
    @include font-h4;
  }
}

.casino-coop__body {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  padding: to-rem(20);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

.casino-coop__line {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-s-regular;
}
</style>
