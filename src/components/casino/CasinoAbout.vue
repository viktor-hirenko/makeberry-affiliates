<script setup lang="ts">
import type { CasinoAboutContent } from '@/types/content'

/**
 * Casino About — описательный блок с плавающими розовыми бейджами.
 * Координаты бейджей хранятся в данных (`en/pages/casinos/*.json`):
 * `mobileTop` / `mobileLeft` для < tablet, `top` / `right` для tablet+,
 * чтобы можно было точно воспроизвести Figma без per-component CSS.
 */
interface Props {
  about: CasinoAboutContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-about" data-section="casino-about">
    <div class="casino-about__inner">
      <div class="casino-about__text">
        <p
          v-for="paragraph in about.paragraphs"
          :key="paragraph.id"
          class="casino-about__paragraph"
        >
          <template v-for="(part, index) in paragraph.parts" :key="index">
            <strong v-if="part.strong" class="casino-about__strong">{{ part.text }}</strong>
            <span v-else>{{ part.text }}</span>
          </template>
        </p>
      </div>

      <ul class="casino-about__badges" role="list">
        <li
          v-for="badge in about.badges"
          :key="badge.id"
          class="casino-about__badge"
          :class="`casino-about__badge--${badge.variant}`"
          :style="{
            '--badge-top': `${badge.top}rem`,
            '--badge-right': `${badge.right}rem`,
            '--badge-mobile-top': `${badge.mobileTop}rem`,
            '--badge-mobile-left': `${badge.mobileLeft}rem`,
            '--badge-rotate': `${badge.rotate}deg`,
          }"
        >
          {{ badge.label }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* Padding-block большое, чтобы вместить абсолютные бейджи
 * над текстом и под ним (без них секция выглядела бы пустой). */
.casino-about {
  position: relative;
  overflow-x: clip;

  @include section-padding(
    $mobile-top: to-rem(190),
    $mobile-bottom: to-rem(190),
    $desktop-inline: to-rem(200),
    $desktop-top: to-rem(150),
    $desktop-bottom: to-rem(150)
  );
}

.casino-about__inner {
  position: relative;
  @include section-stack($gap-mobile: to-rem(32), $gap-tablet: null);
  @include container(var(--container-default));
}

.casino-about__text {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  width: 100%;

  @include mq($from: tablet) {
    max-width: to-rem(746);
    align-self: flex-start;
  }
}

.casino-about__paragraph {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-tertiary);
}

.casino-about__strong {
  font-weight: 400;
  color: var(--color-text-primary);
}

/* Координаты бейджей приходят через CSS-vars из JSON:
 * --badge-mobile-* до tablet, --badge-top/right с tablet. */
.casino-about__badges {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.casino-about__badge {
  position: absolute;
  pointer-events: auto;
  top: var(--badge-mobile-top, 0);
  left: var(--badge-mobile-left, 0);
  transform: rotate(var(--badge-rotate, 0deg));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(16) to-rem(24);
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-primary);
  text-align: center;
  white-space: nowrap;

  @include mq($from: tablet) {
    top: var(--badge-top, 0);
    left: auto;
    right: var(--badge-right, 0);
  }
}

.casino-about__badge--brand-fill {
  background-color: var(--color-bg-brand);
  border-color: var(--color-bg-brand);
}

.casino-about__badge--outlined-brand {
  background-color: var(--color-bg-page);
  border-color: var(--color-border-brand);
}

.casino-about__badge--outlined-bold {
  background-color: var(--color-bg-page);
  border-color: var(--color-border-bold);
}
</style>
