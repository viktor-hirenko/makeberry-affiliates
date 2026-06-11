<script setup lang="ts">
import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import type { CasinoCooperationContent } from '@/types/content'

/**
 * Casino → Cooperation Models — Figma mobile 12365:9145 / desktop 12269:10417.
 * Glow: тот же Frame 204, что Key Highlights; mobile — зеркало highlights (top-right).
 * Desktop tuned @1440: scaleY(-1) rotate(-57°).
 */
interface Props {
  content: CasinoCooperationContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-coop" data-section="casino-cooperation">
    <picture aria-hidden="true">
      <source
        media="(min-width: 1024px)"
        srcset="/images/decorations/glow-casino-highlights-desktop.webp"
      />
      <img
        src="/images/decorations/glow-casino-highlights-mobile.webp"
        alt=""
        class="casino-coop__glow"
        loading="lazy"
        decoding="async"
        width="193"
        height="292"
      />
    </picture>

    <div class="casino-coop__inner">
      <h2 class="casino-coop__title">{{ content.title }}</h2>

      <ul class="casino-coop__grid" role="list">
        <PillHeaderCard
          v-for="model in content.models"
          :key="model.id"
          :title="model.title"
          :body-gap="16"
        >
          <p v-for="(line, index) in model.lines" :key="index">{{ line }}</p>
        </PillHeaderCard>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

// Desktop glow tuned @1440: left calc(50% + 490.91px).
$coop-glow-desktop-left-calc-offset: to-rem(490.91);

.casino-coop {
  position: relative;
  overflow-x: clip;

  @include section-padding();
}

.casino-coop__glow {
  display: block;
  position: absolute;
  z-index: 0;
  max-width: unset;
  pointer-events: none;
  user-select: none;

  top: to-rem(-75);
  right: to-rem(-130);
  left: auto;
  width: to-rem(192.73);
  height: to-rem(292.117);
  transform: scaleX(-1) rotate(127deg);

  @include mq($from: tablet) {
    top: to-rem(-224.49);
    right: auto;
    left: calc(50% + #{$coop-glow-desktop-left-calc-offset});
    width: to-rem(659.008); 
    height: to-rem(998.846);
    transform: scaleY(-1) rotate(-57deg);
  }
}

.casino-coop__inner {
  position: relative;
  z-index: 1;
  @include section-stack($align: center);
  @include container(var(--container-2xl));
}

.casino-coop__title {
  @include font-section-title;

  max-width: to-rem(210);

  @include mq($from: tablet) {
    max-width: 100%;
  }
}

/* align-items: stretch — pill-заголовки выровнены по верху,
 * высоты карточек равны при разной длине описаний. */
.casino-coop__grid {
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(20);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}
</style>
