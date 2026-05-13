<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { AudienceCtaBlock, AudiencePageContent } from '@/types/content'

/**
 * Финальная CTA-секция страницы-аудитории (Affiliates / Advertisers).
 *
 * Figma:
 * - Affiliates  CTA desktop: 2653:1262 — glow справа,
 *   `-scale-y-100` + `rotate(-177.46deg)`.
 * - Advertisers CTA desktop: 2655:1611 — glow слева, `rotate(-27.42deg)`.
 *
 * Картинка glow и её alt приходят из `en/pages/affiliates/<slug>.json` (`cta.glow`),
 * а конкретное позиционирование/rotate задаётся в SCSS через
 * модификатор `.audience-cta--{slug}` (по аналогии с
 * `HomeDirectAdvertiser`, где glow тоже статичный PNG в обычной
 * абсолютной CSS-разметке).
 */
interface Props {
  cta: AudienceCtaBlock
  /** Slug страницы — нужен только для модификатора класса (см. SCSS). */
  slug: AudiencePageContent['slug']
}

defineProps<Props>()
</script>

<template>
  <section
    class="audience-cta"
    :class="`audience-cta--${slug}`"
    data-section="audience-cta"
    aria-label="Call to action"
  >
    <div class="audience-cta__inner">
      <img
        :src="cta.glow.src"
        :alt="cta.glow.alt"
        class="audience-cta__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <p class="audience-cta__text" v-html="cta.titleHtml" />
      <BaseButton variant="primary" size="large" :to="cta.button.path" class="audience-cta__btn">
        {{ cta.button.label }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * CTA (Figma 2653:1262 / 2655:1611)
 *
 * Mobile  : px 16, py 70, gap 48, text 24/32 центром.
 * Desktop : px 160, py 100, gap 70, text 40/48 центром.
 * `overflow: clip` — glow выходит за края секции, иначе появлялся
 * бы горизонтальный скролл.
 * ============================================================ */
.audience-cta {
  position: relative;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $desktop-top: to-rem(100),
    $desktop-bottom: to-rem(100)
  );
}

/* ============================================================
 * Glow — декоративный PNG за контентом. Базовые свойства общие;
 * конкретный кадр (top/left/width/rotate) задают модификаторы
 * `.audience-cta--affiliates` / `.audience-cta--advertisers`.
 * ============================================================ */
.audience-cta__glow {
  position: absolute;
  width: to-rem(923);
  height: to-rem(394);
  max-width: unset;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.audience-cta--affiliates {
  .audience-cta__glow {
    bottom: to-rem(-238);
    right: to-rem(-447);

    @include mq($from: wide) {
      right: to-rem(-736);
      bottom: to-rem(-206);
      width: to-rem(1222);
      height: to-rem(521);
    }
  }

  /* For Affiliates CTA: текстовый блок уже́е, чем у advertisers (Figma 2653:1262). */
  .audience-cta__text {
    max-width: var(--container-lg);
  }
}

.audience-cta--advertisers {
  .audience-cta__glow {
    right: unset;
    left: to-rem(-400);
    bottom: to-rem(-320);
    width: to-rem(923);
    height: to-rem(714);

    @include mq($from: wide) {
      right: unset;
      left: to-rem(-792);
      bottom: to-rem(-393);
      width: to-rem(1222);
      height: to-rem(946);
    }
  }
}

/* ============================================================
 * Content
 * ============================================================ */
.audience-cta__inner {
  position: relative;
  z-index: 1;
  text-align: center;
  @include section-stack($align: center, $gap-mobile: to-rem(40));
  @include container(var(--container-cta));

  .audience-cta--affiliates & {
    max-width: to-rem(970);
  }
}

.audience-cta__text {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    font-size: to-rem(40);
    line-height: to-rem(48);
  }

  :deep(.primary) {
    color: var(--color-text-primary);
  }

  :deep(.muted) {
    color: var(--color-text-tertiary);
  }
}

.audience-cta__btn {
  @include mq($from: tablet) {
    align-self: center;
  }
}
</style>
