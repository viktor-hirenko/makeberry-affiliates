<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { PageHeroBlock } from '@/types/content'

/**
 * Универсальный hero для страниц "For Affiliates" и "For Advertisers".
 * По Figma макет двух страниц идентичен: меняется только содержимое
 * (`badge / titleHtml / subtitleHtml / cta`), а декор справа сверху
 * один и тот же — pre-composited PNG (pink + cables, уже с поворотом
 * и mix-blend-luminosity, запечёнными в изображении).
 *
 * Figma:
 * - For Affiliates desktop: 3861:13319
 * - For Affiliates mobile:  3861:19275
 * - Hero рисуется flush до верха viewport — header floating оверлеит
 *   контент, поэтому компенсируем `padding-top` глобального <main>
 *   через отрицательный `margin-top: calc(-1 * var(--header-offset))`.
 */
interface Props {
  hero: PageHeroBlock
}

defineProps<Props>()
</script>

<template>
  <section class="page-hero" data-section="hero">
    <picture class="page-hero__decor" aria-hidden="true">
      <source media="(min-width: 1024px)" srcset="/images/page-hero/bg-desktop.png" />
      <img
        src="/images/page-hero/bg-mobile.png"
        alt=""
        loading="eager"
        decoding="async"
        fetchpriority="high"
      />
    </picture>

    <div class="page-hero__content">
      <div class="page-hero__text">
        <div class="page-hero__title-block">
          <span v-if="hero.badge" class="page-hero__badge">{{ hero.badge }}</span>
          <h1 class="page-hero__title" v-html="hero.titleHtml" />
        </div>
        <p class="page-hero__copy" v-html="hero.subtitleHtml" />
      </div>

      <BaseButton
        v-if="hero.cta"
        variant="primary"
        size="large"
        :to="hero.cta.path"
        class="page-hero__cta"
      >
        {{ hero.cta.label }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * ============================================================ */
.page-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: var(--color-bg-page);
  /* Hero рисуется flush до верха viewport (header floating оверлеит). */
  // margin-top: calc(-1 * var(--header-offset));

  /* Mobile (Figma 360 — pt 200 / px 16 / pb 70) */
  padding: to-rem(200) var(--container-pad-mobile) to-rem(70);

  @include mq($from: tablet) {
    /* Tablet — даём нормальный inline-padding, но не забиваем 160 */
    padding: to-rem(200) var(--container-pad-desktop) to-rem(100);
  }

  @include mq($from: desktop) {
    /* Desktop (Figma 1440 — pt 200 / px 160 / pb 100) */
    padding: to-rem(200) to-rem(160) to-rem(100);
  }
}

/* ============================================================
 * Decor — pre-composited PNG (pink + cables).
 * На картинке уже учтены rotate + mix-blend, ничего сверху не
 * накладываем — только позиционируем абсолютом.
 *
 * По Figma картинка очень большая и сильно overflow за viewport
 * (на mobile ~360% ширины, на desktop ~180%).
 * Используем object-fit: cover c object-position: right top,
 * чтобы изображение тянулось вправо и сверху, а transparent
 * нижне-левый угол PNG оставался прозрачным.
 * ============================================================ */
.page-hero__decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  display: block;
  overflow: hidden;

  img {
    position: absolute;
    display: block;
    // max-width: none;

    /* Mobile: PNG (720×1328) — pink-каскад в top-center-right.
       На 360 viewport нативная ширина PNG = 200% контейнера, и пинк
       занимает примерно правую треть viewport — как в Figma макете
       (frame 1297×1303 c overflow вправо). */
    top: 0;
    right: 0;
    width: 200%;
    height: auto;
  }

  @include mq($from: mobile) {
    img {
      /* Tablet portrait — слегка ужимаем, но pink каскад остаётся
         доминирующим в правой части. */
      width: 160%;
    }
  }

  @include mq($from: tablet) {
    img {
      /* Tablet+: используется desktop PNG (2610×1576).
         Image overflow справа на ~30%, pink-каскад занимает right-third. */
      top: 0;
      right: 0;
      width: 130%;
    }
  }

  @include mq($from: desktop) {
    img {
      /* Desktop 1440 (Figma): image сильно overflow справа,
         pink-каскад занимает правую треть hero. */
      top: 0;
      right: 0;
      width: 110%;
    }
  }
}

/* ============================================================
 * Content stack
 * ============================================================ */
.page-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: to-rem(40);
  width: 100%;
  align-items: stretch;

  @include mq($from: tablet) {
    gap: to-rem(48);
    max-width: to-rem(518);
    align-items: flex-start;
  }
}

.page-hero__text {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: tablet) {
    gap: to-rem(40);
  }
}

.page-hero__title-block {
  display: flex;
  flex-direction: column;
  gap: to-rem(24);
  width: 100%;
}

/* ============================================================
 * Badge
 * ============================================================ */
.page-hero__badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: to-rem(8) to-rem(12);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: to-rem(-0.14);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* ============================================================
 * Title — Headline H2 (40/48 mobile, 64/72 desktop)
 * ============================================================ */
.page-hero__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: to-rem(-0.4);
  color: var(--color-text-primary);

  @include mq($from: desktop) {
    font-size: to-rem(64);
    line-height: to-rem(72);
    letter-spacing: to-rem(-0.64);
  }
}

/* ============================================================
 * Copy — Body 2 mobile, Body 1 desktop
 * ============================================================ */
.page-hero__copy {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: to-rem(-0.16);
  color: var(--color-text-secondary);

  @include mq($from: desktop) {
    font-size: to-rem(18);
    letter-spacing: to-rem(-0.18);
  }
}

/* ============================================================
 * CTA button — full width on mobile, natural width on desktop
 * ============================================================ */
.page-hero__cta {
  align-self: stretch;

  @include mq($from: tablet) {
    align-self: flex-start;
  }
}
</style>
