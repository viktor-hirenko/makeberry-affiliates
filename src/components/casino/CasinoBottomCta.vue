<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { CasinoBottomCtaContent } from '@/types/content'

/**
 * Casino → Bottom CTA (Figma 3819:4269)
 *
 * Контент:
 *   "As a direct advertiser for {Brand}, [white]
 *    we remove unnecessary layers ... [tertiary]"
 *   + 2 кнопки: Start Promoting (primary), Visit {Brand} (tetriary).
 *
 * Декорация: большой rotated pink glow в правой части секции —
 * pre-composited PNG, ничего сверху не накладываем.
 */
interface Props {
  content: CasinoBottomCtaContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-cta" data-section="casino-bottom-cta">
    <img
      :src="content.glow.src"
      :alt="content.glow.alt"
      class="casino-cta__glow"
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />

    <div class="casino-cta__inner">
      <p class="casino-cta__text">
        <span class="casino-cta__text-primary">{{ content.textPrimary }}</span>
        <span class="casino-cta__text-secondary">{{ content.textSecondary }}</span>
      </p>

      <div class="casino-cta__buttons">
        <template v-for="button in content.buttons" :key="button.label">
          <BaseButton
            v-if="button.external"
            :variant="button.variant"
            size="large"
            :href="button.href"
            class="casino-cta__button"
          >
            {{ button.label }}
          </BaseButton>
          <BaseButton
            v-else
            :variant="button.variant"
            size="large"
            :to="button.href"
            class="casino-cta__button"
          >
            {{ button.label }}
          </BaseButton>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70.
 * Desktop : px 260, py 100 (Figma).
 * Glow выходит за правую границу — overflow-x: clip.
 * ============================================================ */
.casino-cta {
  position: relative;
  overflow-x: clip;

  @include section-padding($desktop-inline: to-rem(200));
}

/* ============================================================
 * Glow — pre-composited PNG, rotated блик в правой части.
 * Figma desktop: left 677, top -245, w 1287, h 700.
 * Mobile коэффициент ≈ 0.6× и подвинут к правому краю.
 * ============================================================ */
.casino-cta__glow {
  position: absolute;
  top: to-rem(-150);
  right: to-rem(-280);
  width: to-rem(700);
  height: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  @include mq($from: tablet) {
    top: to-rem(-245);
    right: to-rem(-460);
    width: to-rem(1287);
  }
}

.casino-cta__inner {
  position: relative;
  z-index: 1;
  @include section-stack($align: center, $gap-mobile: to-rem(40));
  @include container(var(--container-cta));
}

/* ============================================================
 * Text — большой 24/32 mobile, 40/48 desktop, центр.
 * Primary часть — белая, secondary — text-tertiary.
 * ============================================================ */
.casino-cta__text {
  margin: 0;
  width: 100%;
  text-align: center;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: to-rem(-0.24);
  color: var(--color-text-tertiary);

  @include mq($from: tablet) {
    font-size: to-rem(40);
    line-height: to-rem(48);
    letter-spacing: to-rem(-0.4);
  }
}

.casino-cta__text-primary {
  color: var(--color-text-primary);
}

.casino-cta__text-secondary {
  color: var(--color-text-tertiary);
}

/* ============================================================
 * Buttons — column-stack mobile (full-width),
 * row inline desktop (gap 8 — по Figma).
 * ============================================================ */
.casino-cta__buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(12);
  width: 100%;
  max-width: to-rem(360);

  @include mq($from: mobile) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: to-rem(8);
    width: auto;
    max-width: none;
  }
}

.casino-cta__button {
  width: 100%;
  text-align: center;

  @include mq($from: mobile) {
    width: to-rem(250);
  }
}
</style>
