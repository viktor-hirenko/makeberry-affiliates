<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { PageHeroBlock } from '@/types/content'

/**
 * Hero страницы-аудитории (`/affiliates`, `/advertisers`).
 *
 * По Figma макет двух страниц идентичен: меняется только содержимое
 * (`badge / titleHtml / subtitleHtml / cta`), а декор справа сверху
 * один и тот же — pre-composited PNG (pink + cables, уже с поворотом
 * и mix-blend-luminosity, запечёнными в изображении).
 *
 * Figma:
 * - For Affiliates  desktop: 3861:13319 / mobile: 3861:19275
 * - For Advertisers desktop: 3861:13309 (тот же `cables` ассет, тот же
 *   rotation -42.08deg, mix-blend luminosity — изображение общее).
 *
 * Hero рисуется flush до верха viewport — header floating оверлеит
 * контент, собственный padding-top секции уже учитывает высоту хедера.
 */
interface Props {
  hero: PageHeroBlock
}

defineProps<Props>()
</script>

<template>
  <section class="audience-hero" data-section="hero">
    <div class="audience-hero__inner">
      <picture class="audience-hero__decor" aria-hidden="true">
        <source media="(min-width: 1024px)" srcset="/images/hero/audience-bg-desktop.webp" />
        <img
          src="/images/hero/audience-bg-mobile.webp"
          alt=""
          loading="eager"
          decoding="async"
          fetchpriority="high"
        />
      </picture>

      <div class="audience-hero__content">
        <div class="audience-hero__text">
          <div class="audience-hero__title-block">
            <span v-if="hero.badge" class="audience-hero__badge">{{ hero.badge }}</span>
            <h1 class="audience-hero__title" v-html="hero.titleHtml" />
          </div>
          <p class="audience-hero__copy" v-html="hero.subtitleHtml" />
        </div>

        <BaseButton
          v-if="hero.cta"
          variant="primary"
          size="large"
          :to="hero.cta.path"
          class="audience-hero__cta"
        >
          {{ hero.cta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * ============================================================ */
.audience-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* Hero рисуется flush до верха viewport (header floating оверлеит). */

  @include section-padding(
    $desktop-inline: to-rem(160),
    $mobile-top: to-rem(200),
    $desktop-top: to-rem(200)
  );
}

.audience-hero__inner {
  @include container(var(--container-xl));
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
.audience-hero__decor {
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
.audience-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: to-rem(40);
  width: 100%;
  align-items: stretch;

  @include mq($from: mobile) {
    gap: to-rem(48);
    max-width: to-rem(518);
    align-items: flex-start;
  }
}

.audience-hero__text {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(40);
  }
}

.audience-hero__title-block {
  display: flex;
  flex-direction: column;
  gap: to-rem(24);
  width: 100%;
}

/* ============================================================
 * Badge
 * ============================================================ */
.audience-hero__badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: to-rem(8) to-rem(12);
  background-color: var(--color-bg-subtle);
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
.audience-hero__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(40);
  line-height: to-rem(48);
  letter-spacing: to-rem(-0.4);
  color: var(--color-text-primary);

  @include mq($from: mobile) {
    font-size: to-rem(64);
    line-height: to-rem(72);
    letter-spacing: to-rem(-0.64);
  }
}

/* ============================================================
 * Copy — Body 2 mobile, Body 1 desktop
 * ============================================================ */
.audience-hero__copy {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: to-rem(-0.16);
  color: var(--color-text-secondary);

  @include mq($from: mobile) {
    font-size: to-rem(18);
    letter-spacing: to-rem(-0.18);
  }
}

/* ============================================================
 * CTA button — full width on mobile, natural width on desktop
 * ============================================================ */
.audience-hero__cta {
  align-self: stretch;

  @include mq($from: mobile) {
    align-self: flex-start;
  }
}
</style>
