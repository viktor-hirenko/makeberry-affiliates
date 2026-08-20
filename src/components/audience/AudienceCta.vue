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
    <picture aria-hidden="true">
      <source v-if="cta.glow.mobileSrc" media="(min-width: 1024px)" :srcset="cta.glow.src" />
      <img
        :src="cta.glow.mobileSrc ?? cta.glow.src"
        :alt="cta.glow.alt"
        class="audience-cta__glow"
        loading="lazy"
        decoding="async"
      />
    </picture>

    <div class="audience-cta__inner">
      <p class="audience-cta__text" v-html="cta.titleHtml" />
      <BaseButton
        v-if="cta.button"
        variant="primary"
        size="large"
        :to="cta.button.href ? undefined : cta.button.path"
        :href="cta.button.href"
        class="audience-cta__btn"
        :analytics-location="`audience_${slug}_cta`"
        :analytics-label="cta.button.label"
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

.audience-cta--affiliates,
.audience-cta--referral {
  .audience-cta__glow {
    top: unset;
    left: unset;
    right: 0;
    bottom: to-rem(-196);
    width: 100%;
    height: to-rem(434);

    @include mq($from: laptop) {
      bottom: to-rem(-350);
      height: to-rem(679);
    }
  }

  .audience-cta__text {
    max-width: var(--container-lg);
  }
}

.audience-cta--advertisers {
  .audience-cta__glow {
    top: unset;
    right: unset;
    left: 0;
    bottom: to-rem(-196);
    width: 939%;
    height: to-rem(434);

    @include mq($from: mobile) {
      width: 100%;
    }

    @include mq($from: laptop) {
      bottom: to-rem(-350);
      height: to-rem(679);
    }
  }
}

.audience-cta__inner {
  position: relative;
  z-index: 1;
  text-align: center;
  @include section-stack($align: center, $gap-mobile: to-rem(40));
  @include container(var(--container-cta));

  .audience-cta--affiliates &,
  .audience-cta--referral & {
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
