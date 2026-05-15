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
@use '@/assets/styles/scss/mixins' as *;

.home-about {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);

  @include section-padding(to-rem(160));

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

.home-about__title {
  margin: 0;
  width: 100%;
  @include font-section-title;
}

/* Сетка использует grid-template-areas с «дырами» (`.`), чтобы
 * воспроизвести шахматный паттерн карточек из Figma. Каждое имя
 * (b1…b8) — только один прямоугольник; дублировать имена в разных
 * рядах нельзя. */
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

/* Карточка с бейджем: object-fit: contain + прозрачные поля внутри
 * ассета дают визуальный отступ. */
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
