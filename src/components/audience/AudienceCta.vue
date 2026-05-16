<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { useSharedUi } from '@/composables/useContent'
import type { AudienceCtaBlock, AudiencePageContent } from '@/types/content'

/**
 * Финальная CTA-секция страницы-аудитории (Affiliates / Advertisers).
 */
interface Props {
  cta: AudienceCtaBlock
  /** Slug страницы — нужен только для модификатора класса (см. SCSS). */
  slug: AudiencePageContent['slug']
}

defineProps<Props>()

const ui = useSharedUi()
</script>

<template>
  <section
    class="audience-cta"
    :class="`audience-cta--${slug}`"
    data-section="audience-cta"
    :aria-label="ui.aria.callToAction"
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
      <BaseButton
        variant="primary"
        size="large"
        :to="cta.button.href ? undefined : cta.button.path"
        :href="cta.button.href"
        class="audience-cta__btn"
      >
        {{ cta.button.label }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* Affiliates CTA (glow справа).
 * Advertisers CTA (glow слева). */
.audience-cta {
  position: relative;

  @include section-padding(
    $desktop-inline: to-rem(160),
    $desktop-top: to-rem(100),
    $desktop-bottom: to-rem(100)
  );
}

/* Базовая геометрия общая; позиционирование задают модификаторы
 * `.audience-cta--{slug}` ниже. */
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

  /* У affiliates текстовый блок уже, чем у advertisers. */
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
