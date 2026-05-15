<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { CasinoHero } from '@/types/content'

/**
 * Casino Hero — flush-top секция, под floating header.
 *
 * Layout:
 * - Desktop (Figma 1440 — frame 3819:3933): row, контент слева (570px),
 *   логотип-квадрат 280×280 справа, два розовых glow-blob уходят за правую
 *   границу секции.
 * - Mobile (Figma 360 — frame 3821:7616): column, логотип сверху по центру,
 *   stats — column, единая glow-композиция в правом верхнем углу.
 *
 * Hero рисуется flush до верха viewport — header floating оверлеит,
 * собственный padding-top секции (см. ниже) уже учитывает высоту хедера.
 */
interface Props {
  hero: CasinoHero
}

defineProps<Props>()
</script>

<template>
  <section class="casino-hero" data-section="casino-hero">
    <img
      :src="'/images/decorations/glow-casino-hero.webp'"
      alt=""
      class="casino-hero__glow"
      aria-hidden="true"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    />

    <div class="casino-hero__inner">
      <div class="casino-hero__text">
        <h1 class="casino-hero__title">{{ hero.title }}</h1>

        <div class="casino-hero__body">
          <p class="casino-hero__intro">{{ hero.intro }}</p>

          <ul class="casino-hero__stats" role="list">
            <li v-for="stat in hero.stats" :key="stat.number" class="casino-hero__stat">
              <p class="casino-hero__stat-number">{{ stat.number }}</p>
              <p class="casino-hero__stat-title">
                <span class="casino-hero__stat-strong">{{ stat.titleStrong }}</span>
                <span v-if="stat.titleRest">{{ stat.titleRest }}</span>
              </p>
            </li>
          </ul>
        </div>

        <BaseButton
          variant="primary"
          size="large"
          :href="hero.cta.href"
          rel="sponsored nofollow noopener noreferrer"
          class="casino-hero__cta"
        >
          {{ hero.cta.label }}
        </BaseButton>
      </div>

      <div class="casino-hero__logo-wrap">
        <img
          :src="hero.logo.src"
          :alt="hero.logo.alt"
          class="casino-hero__logo"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile  : pt header-offset + 32, px 16, pb 70.
 * Desktop : Figma — pt 230 / px 200 / pb 100, но в проекте flush-top
 *           даёт `margin-top: -header-offset` и реальная видимая высота
 *           над контентом = 200px.
 * ============================================================ */
.casino-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  @include section-padding(
    $mobile-top: to-rem(170),
    $mobile-bottom: to-rem(70),
    $desktop-inline: to-rem(200),
    $desktop-top: to-rem(230),
    $desktop-bottom: to-rem(100)
  );
}

/* ============================================================
 * Glow — pre-composited PNG (две розовые ellipses + ротация).
 * На картинке уже учтены rotate + soft-light, ничего сверху не
 * накладываем — только позиционируем абсолютом.
 * ============================================================ */
.casino-hero__glow {
  position: absolute;
  top: to-rem(-200);
  right: to-rem(-220);
  width: to-rem(800);
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  @include mq($from: tablet) {
    top: to-rem(-344);
    right: to-rem(-352);
    width: to-rem(1322);
    height: auto;
  }
}

/* ============================================================
 * Inner — flex column on mobile (logo first), row on desktop.
 * ============================================================ */
.casino-hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column-reverse;
  // align-items: center;
  gap: to-rem(40);

  @include container(var(--container-default));

  @include mq($from: mobile) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
  }

  @include mq($from: tablet) {
    gap: to-rem(80);
  }
}

/* ============================================================
 * Text column
 * Mobile  : full-width, items stretched (для full-width CTA).
 * Desktop : фиксированный 570px по Figma.
 * ============================================================ */
.casino-hero__text {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: mobile) {
    flex: 0 1 to-rem(570);
    width: to-rem(570);
    gap: to-rem(48);
  }
}

/* ============================================================
 * Title — Figma mobile: 40/48 semibold (3844:13153).
 *         Desktop (tablet+): H2 64/72 semibold.
 * ============================================================ */
.casino-hero__title {
  margin: 0;
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: -0.01em;

  @include mq($from: mobile) {
    @include font-h2;
  }
}

.casino-hero__body {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(40);
  }
}

/* ============================================================
 * Intro — Body 2 mobile, Body 1 desktop, secondary color
 * ============================================================ */
.casino-hero__intro {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-s-regular;

  @include mq($from: mobile) {
    @include font-body-l-regular;
  }
}

/* ============================================================
 * Stats
 * Mobile  : Figma 3844:13155 — flex-wrap: wrap, gap 24, шаг 140px
 *           (01+02 в ряду на 360px frame, 03 переходит ниже).
 * Desktop : 3-up row, тонкие вертикальные divider'ы (border-left)
 *           между блоками.
 * ============================================================ */
.casino-hero__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: to-rem(24);
  width: 100%;

  @include mq($from: mobile) {
    flex-wrap: nowrap;
    align-items: stretch;
    // height: to-rem(108);
  }
}

.casino-hero__stat {
  display: flex;
  flex-direction: column;
  gap: to-rem(12);
  flex: 0 0 to-rem(140);
  width: to-rem(140);

  @include mq($from: mobile) {
    flex: 1 0 0;
    min-width: 0;
    width: auto;

    & + & {
      padding-left: to-rem(24);
      border-left: 1px solid var(--color-border-subtle);
    }
  }
}

.casino-hero__stat-number {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  /* Figma 4003:21934 — 40/48 medium на mobile и desktop. */
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: to-rem(-0.4);
  /* По Figma: dim-grey "404040" — выглядит как watermark-номер. */
  color: #404040;
}

.casino-hero__stat-title {
  margin: 0;
  color: var(--color-text-secondary);
  @include font-body-l-regular;
}

.casino-hero__stat-strong {
  font-weight: 600;
}

/* ============================================================
 * CTA — full-width on mobile, natural width on desktop
 * ============================================================ */
.casino-hero__cta {
  align-self: stretch;

  @include mq($from: mobile) {
    align-self: flex-start;
  }
}

/* ============================================================
 * Logo — square 130 mobile (по Figma 130×130 на 360 фрейме),
 * 280×280 desktop. Изображение центрируется внутри квадрата.
 * ============================================================ */
.casino-hero__logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: to-rem(130);
  height: to-rem(130);

  @include mq($from: mobile) {
    width: to-rem(280);
    height: to-rem(280);
  }
}

.casino-hero__logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}
</style>
