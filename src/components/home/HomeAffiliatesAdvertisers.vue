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
@use '@/assets/styles/scss/mixins' as *;

.home-aff-adv {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: stretch;
  gap: to-rem(60);
  margin-inline: auto;

  @include section-padding(to-rem(160));

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(20);
  }

  @include mq($from: tablet) {
    gap: to-rem(40);
  }
}

/* overflow visible — декорация выходит за границы карточки. */
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

.home-aff-adv__divider {
  width: 100%;
  height: 1px;
  background-color: var(--color-border-subtle);
}

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

/* Декорации: sparkle peek-up над affiliates, cursor peek-down под advertisers. */
.home-aff-adv__decoration {
  position: absolute;
  width: to-rem(100);
  height: to-rem(100);
  object-fit: cover;
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.home-aff-adv__card[data-card='affiliates'] .home-aff-adv__decoration {
  top: to-rem(-45);
  right: to-rem(-10);

  @include mq($from: tablet) {
    width: to-rem(200);
    height: to-rem(200);
    top: to-rem(-87);
    top: to-rem(-102);
    right: to-rem(-47);
  }
}

.home-aff-adv__card[data-card='advertisers'] .home-aff-adv__decoration {
  top: to-rem(-45);
  right: to-rem(-20);

  @include mq($from: tablet) {
    width: to-rem(200);
    height: to-rem(200);
    top: auto;
    bottom: to-rem(-126);
    right: to-rem(-109);
  }
}
</style>
