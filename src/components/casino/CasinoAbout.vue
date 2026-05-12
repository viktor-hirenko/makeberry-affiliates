<script setup lang="ts">
import type { CasinoAboutContent } from '@/types/content'

/**
 * Casino About — описательный блок с тремя плавающими розовыми бейджами.
 *
 * Layout:
 * - Mobile (Figma 360 — узел 3821:7879/7880, py 190): текст центром,
 *   бейджи положены абсолютом относительно __inner по координатам
 *   `mobileTop` / `mobileLeft` (Figma frame 360).
 * - Desktop (Figma 1440 — px 200 / py 150): текст слева (fix-width),
 *   бейджи абсолютом по `top` / `right` относительно __inner (frame 1440).
 *
 * Все координаты берём из data (см. casinos.json) — это позволяет
 * точно повторить Figma для каждого казино, не плодя per-component CSS.
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

/* ============================================================
 * Section
 * Mobile  : px 16. Padding-block большое (top 190 / bottom 240),
 *           чтобы вместить абсолютные бейджи над текстом и
 *           Tournaments под ним. На viewport > 360px текст
 *           переносится в меньшее число строк, поэтому bottom
 *           делаем с запасом.
 * Tablet  : px 60, py 120.
 * Desktop : px 200, py 150 (Figma 3819).
 * ============================================================ */
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

/* ============================================================
 * Inner — текст занимает 50% слева, бейджи правая половина (abs).
 * ============================================================ */
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

/* ============================================================
 * Paragraph — 24/32 на mobile и desktop (Figma 3821:7881 / 3819).
 * Color: text-tertiary (приглушённый параграф),
 * `<strong>` фрагмент — text-primary white.
 * ============================================================ */
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

/* ============================================================
 * Badges
 *
 * Везде — abs-позиционированные.
 * Mobile (< 768): координаты `--badge-mobile-top` /
 *                 `--badge-mobile-left` (из data, Figma frame 360).
 * Tablet+ (≥ 768): `--badge-top` / `--badge-right` (frame 1440) —
 *                 текст слева в фиксированной колонке, бейджи
 *                 свободно справа.
 * ============================================================ */
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
