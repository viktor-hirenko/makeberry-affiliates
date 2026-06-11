<script setup lang="ts">
import PillHeaderCard from '@/components/shared/PillHeaderCard.vue'
import type { CasinoKeyHighlightsContent } from '@/types/content'

/**
 * Casino → Key Highlights — Figma mobile 12365:9109 / desktop 12269:10376.
 * Glow: mobile 12365:9610, desktop 12269:11353 (Frame 204).
 * Sparkle справа от title — tablet+, Figma 12269:10394.
 */
interface Props {
  content: CasinoKeyHighlightsContent
}

defineProps<Props>()
</script>

<template>
  <section class="casino-highlights" data-section="casino-highlights">
    <picture aria-hidden="true">
      <source
        media="(min-width: 1024px)"
        srcset="/images/decorations/glow-casino-highlights-desktop.webp"
      />
      <img
        src="/images/decorations/glow-casino-highlights-mobile.webp"
        alt=""
        class="casino-highlights__glow"
        loading="lazy"
        decoding="async"
        width="193"
        height="292"
      />
    </picture>

    <div class="casino-highlights__inner">
      <div class="casino-highlights__heading">
        <h2 class="casino-highlights__title">{{ content.title }}</h2>
        <img
          :src="content.decoration.src"
          :alt="content.decoration.alt"
          class="casino-highlights__decoration"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </div>

      <ul class="casino-highlights__grid" role="list">
        <PillHeaderCard v-for="card in content.cards" :key="card.id" :title="card.title">
          <p>{{ card.description }}</p>
        </PillHeaderCard>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

// Desktop glow tuned @1440: left -423px → calc(50% - 1143px).
$glow-desktop-left-calc-offset: to-rem(1143);

.casino-highlights {
  position: relative;
  overflow-x: clip;

  @include section-padding();
}

.casino-highlights__glow {
  display: block;
  position: absolute;
  z-index: 0;
  max-width: unset;
  pointer-events: none;
  user-select: none;

  top: to-rem(-246);
  left: to-rem(-95);
  width: to-rem(192.73);
  height: to-rem(292.117);
  transform: rotate(101.697deg);

  @include mq($from: tablet) {
    top: to-rem(-157);
    left: calc(50% - #{$glow-desktop-left-calc-offset});
    width: to-rem(659.008);
    height: to-rem(998.846);
    transform: rotate(118.17deg);
  }

  @include mq($from: laptop) {
    left: calc(50% - #{$glow-desktop-left-calc-offset});
  }

  @include mq($from: desktop) {
    top: to-rem(-87);
  }
}

.casino-highlights__inner {
  position: relative;
  z-index: 1;
  @include section-stack;
  @include container(var(--container-default));
}

/* Sparkle стоит inline справа от заголовка (не absolute). */
.casino-highlights__heading {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(12);

  @include mq($from: desktop) {
    gap: to-rem(20);
  }
}

.casino-highlights__title {
  @include font-section-title;
}

.casino-highlights__decoration {
  display: none;
  flex-shrink: 0;
  width: to-rem(48);
  height: to-rem(48);
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  translate: 0 to-rem(15);

  @include mq($from: tablet) {
    display: block;
    width: to-rem(160);
    height: to-rem(160);
    translate: 0 to-rem(10);
  }

  @include mq($from: desktop) {
    width: to-rem(200);
    height: to-rem(200);
  }
}

.casino-highlights__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: to-rem(20);
  width: 100%;

  @include mq($from: mobile) {
    gap: to-rem(20);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
