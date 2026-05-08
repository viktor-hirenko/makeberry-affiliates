<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { useHomeAffiliatesAdvertisers } from '@/composables/useContent'

const content = useHomeAffiliatesAdvertisers()
</script>

<template>
  <section id="affiliates-advertisers" class="home-aff-adv" data-section="affiliates-advertisers">
    <article
      v-for="card in content.cards"
      :key="card.id"
      class="home-aff-adv__card"
      :data-card="card.id"
    >
      <header class="home-aff-adv__header">
        <h3 class="home-aff-adv__title">{{ card.title }}</h3>
      </header>

      <div class="home-aff-adv__divider" aria-hidden="true"></div>

      <div class="home-aff-adv__body">
        <p class="home-aff-adv__description">{{ card.description }}</p>

        <div class="home-aff-adv__buttons">
          <BaseButton
            variant="primary"
            size="large"
            :to="card.primaryCta.path"
            class="home-aff-adv__cta"
          >
            {{ card.primaryCta.label }}
          </BaseButton>
          <BaseButton
            variant="tetriary"
            size="large"
            :to="card.secondaryCta.path"
            class="home-aff-adv__cta"
          >
            {{ card.secondaryCta.label }}
          </BaseButton>
        </div>
      </div>

      <img
        :src="card.decoration.src"
        :alt="card.decoration.alt"
        class="home-aff-adv__decoration"
        loading="lazy"
        decoding="async"
      />
    </article>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * До mobile: одна колонка, gap 60
 * От mobile: две карточки в ряд, gap 40
 * От tablet: увеличенные отступы секции
 * ============================================================ */
.home-aff-adv {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: stretch;
  gap: to-rem(60);
  margin-inline: auto;
  background-color: var(--color-bg-page);
  padding: to-rem(70) var(--container-pad-mobile);
  /*
   * Декорации (sparkle / cursor) намеренно вылезают за карточки
   * через position: absolute + отрицательные top/right/bottom.
   * Карточка их НЕ клипает (overflow visible — by design),
   * поэтому ответственность клипа возложена на саму секцию.
   * Используем overflow-x: clip — он не ломает sticky-родителей
   * и точечно режет только горизонтальный «вылет».
   */
  overflow-x: clip;

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(20);
    padding-inline: var(--container-pad-tablet);
  }

  @include mq($from: tablet) {
    gap: to-rem(40);
    padding: to-rem(170) var(--container-pad-desktop);
  }

  @include mq($from: desktop) {
    padding-inline: to-rem(160);
  }
}

/* ============================================================
 * Card — bg-surface, border-subtle, rounded-24, overflow visible
 * (декорация выходит за границы)
 * ============================================================ */
.home-aff-adv__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);

  @include mq($from: mobile) {
    max-width: to-rem(460);
    justify-self: center;
  }
}

/* ============================================================
 * Header — H4 32/40 (desktop) | H5 24/32 (mobile)
 * ============================================================ */
.home-aff-adv__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: to-rem(24);
}

.home-aff-adv__title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;

  @include mq($from: tablet) {
    @include font-h4;
  }
}

/* ============================================================
 * Divider — 1px line border-subtle, full width
 * ============================================================ */
.home-aff-adv__divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border-subtle);
}

/* ============================================================
 * Body — description + buttons
 * ============================================================ */
.home-aff-adv__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(24);
  height: 100%;
  padding: to-rem(24);
}

.home-aff-adv__description {
  margin: 0;
  width: 100%;
  flex: 1;
  @include font-body-s-regular;
  color: var(--color-text-secondary);
}

/* ============================================================
 * Buttons — full-width column on mobile, inline row on desktop
 * ============================================================ */
.home-aff-adv__buttons {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(8);
  width: 100%;

  @include mq($from: tablet) {
    flex-direction: row;
    align-items: flex-start;
    width: auto;
  }
}

.home-aff-adv__cta {
  width: 100%;
  text-align: center;

  @include mq($from: tablet) {
    width: auto;
  }
}

/* ============================================================
 * Decorations
 * Mobile  : 100×100, peek above each card top-right
 * Desktop : 200×200,
 *   — sparkle (affiliates) → above card top-right (peek up)
 *   — cursor  (advertisers) → below card bottom-right (peek down)
 * ============================================================ */
.home-aff-adv__decoration {
  position: absolute;
  width: to-rem(100);
  height: to-rem(100);
  object-fit: cover;
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

/* — Affiliates → sparkle */
.home-aff-adv__card[data-card='affiliates'] .home-aff-adv__decoration {
  top: to-rem(-45);
  right: to-rem(-10);

  @include mq($from: tablet) {
    width: to-rem(200);
    height: to-rem(200);
    top: to-rem(-87);
    right: to-rem(-41);
  }
}

/* — Advertisers → cursor */
.home-aff-adv__card[data-card='advertisers'] .home-aff-adv__decoration {
  top: to-rem(-45);
  right: to-rem(-20);

  @include mq($from: tablet) {
    /* Десктоп: курсор уходит вниз-вправо за карточку */
    width: to-rem(200);
    height: to-rem(200);
    top: auto;
    bottom: to-rem(-150);
    right: to-rem(-119);
  }
}
</style>
