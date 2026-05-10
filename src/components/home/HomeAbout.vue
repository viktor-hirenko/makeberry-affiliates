<script setup lang="ts">
import { useHomeAbout } from '@/composables/useContent'

const about = useHomeAbout()
</script>

<template>
  <section id="about" class="home-about" data-section="about">
    <h2 class="home-about__title">{{ about.title }}</h2>

    <div class="home-about__grid">
      <article
        v-for="(block, index) in about.blocks"
        :key="block.id"
        class="home-about__card"
        :style="{ gridArea: `b${index + 1}` }"
      >
        <span class="home-about__number">{{ block.id }}</span>
        <p class="home-about__text">
          <template v-for="(part, partIndex) in block.parts" :key="partIndex">
            <strong v-if="part.bold" class="home-about__text-strong">{{ part.text }}</strong>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
      </article>

      <article class="home-about__card home-about__card--image" style="grid-area: img">
        <img
          :src="about.image.src"
          :alt="about.image.alt"
          class="home-about__pendant"
          loading="lazy"
          decoding="async"
        />
      </article>
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
 * Mobile (Figma 360 — py 70 / px 16 / gap 48)
 * Desktop (Figma 1440 — py 100 / px 200 / gap 70)
 * ============================================================ */
.home-about {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);
  background-color: var(--color-bg-page);
  @include section-padding-default;

  @include mq($from: tablet) {
    gap: to-rem(70);
    padding-inline: to-rem(160);
  }

  @include mq($from: desktop) {
    padding-inline: to-rem(200);
  }
}

/* ============================================================
 * Title
 * Mobile: 36/40 medium · Desktop: H3 56/64 medium
 * ============================================================ */
.home-about__title {
  margin: 0;
  width: 100%;
  @include font-section-title;
}

/* ============================================================
 * Grid
 * До mobile: одна колонка, без картинки.
 * mobile–tablet (768–1023): 3 колонки; пустые ячейки — точка (.) в
 *   grid-template-areas. Каждое имя (b1…b8) только один прямоугольник;
 *   нельзя дублировать b7 в разных рядах. Ниже — плотная сетка с «дырами»
 *   в духе десктопа (дыра слева во 2-м ряду, две дыры в последнем).
 * От tablet: полная 4-колоночная сетка как в макете.
 * ============================================================ */
.home-about__grid {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  width: 100%;

  @include mq($from: mobile) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: auto;
    grid-auto-rows: minmax(to-rem(220), auto);
    grid-template-areas:
      'b1 b2 img'
      '.  b3 b4'
      'b5 b6  .'
      '.  b7  b8';
    gap: to-rem(16);
    max-width: to-rem(980);
    margin-inline: auto;
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: minmax(to-rem(220), auto);
    grid-template-areas:
      'b1  b2  img b3'
      '.   b4  b5  b6'
      'b7  .   b8  .';
    gap: to-rem(20);
    max-width: to-rem(980);
  }
}

/* ============================================================
 * Info card
 * ============================================================ */
.home-about__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  padding: to-rem(24);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
}

.home-about__number {
  display: block;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;

  @include mq($from: tablet) {
    @include font-h3;
  }
}

.home-about__text {
  margin: 0;
  width: 100%;
  @include font-body-s-regular;
  color: var(--color-text-secondary);
}

.home-about__text-strong {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* ============================================================
 * Image card (desktop only)
 * Карточка идентична info-блокам по габаритам, но pendant заполняет
 * её через object-fit: contain — собственные прозрачные поля внутри
 * pendant.png дают визуальный отступ как в Figma.
 * ============================================================ */
.home-about__card--image {
  display: none;

  @include mq($from: mobile) {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: start;
    padding: 0;
    background-color: transparent;
    border-color: var(--color-border-default);
    overflow: hidden;
  }

  @include mq($from: tablet) {
    align-self: stretch;
  }
}

.home-about__pendant {
  display: block;
  width: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;

  @include mq($from: mobile) {
    height: auto;
    max-height: to-rem(220);
  }

  @include mq($from: tablet) {
    height: 100%;
  }
}
</style>
