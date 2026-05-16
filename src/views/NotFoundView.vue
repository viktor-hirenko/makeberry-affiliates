<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { useNotFound } from '@/composables/useContent'

const content = useNotFound()
</script>

<template>
  <section class="not-found">
    <div class="not-found__inner">
      <div class="not-found__glow" aria-hidden="true"></div>

      <div class="not-found__visual">
        <span class="not-found__big" aria-hidden="true">404</span>
        <picture>
          <source media="(min-width: 1024px)" srcset="/images/404/truck.webp" />
          <img
            src="/images/404/truck-mobile.webp"
            alt=""
            class="not-found__truck"
            decoding="async"
            fetchpriority="high"
            width="600"
            height="400"
          />
        </picture>
      </div>

      <div class="not-found__content">
        <h1 class="not-found__title">{{ content.title }}</h1>
        <p class="not-found__copy">{{ content.copy }}</p>
        <BaseButton variant="secondary" size="large" :to="content.cta.path" class="not-found__cta">
          {{ content.cta.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.not-found {
  position: relative;
  min-height: 100svh;
  padding: to-rem(24) var(--container-pad-x);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @include mq($from: tablet) {
    padding-block: to-rem(40);
  }
}

/* CSS radial-gradient вместо растрового glow — Figma 3861:23211. */
.not-found__glow {
  position: absolute;
  top: to-rem(-40);
  left: 50%;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  width: to-rem(562);
  height: to-rem(220);
  transform: translateX(-64%) rotate(15.32deg);
  transform-origin: center;
  border-radius: 50%;
  background: radial-gradient(
    48.94% 40.37% at 40.33% 51.95%,
    rgba(255, 1, 128, 0.45) 0%,
    rgba(255, 1, 128, 0.45) 7.21%,
    rgba(255, 1, 128, 0) 100%
  );

  @include mq($from: tablet) {
    top: to-rem(-70);
    transform: translateX(-67%) rotate(15.32deg);
    width: to-rem(1170);
    height: to-rem(572);
  }
}

/* gap не задаётся: visual frame уже содержит вертикальный воздух
 * (truck height ~70% от frame). */
.not-found__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: to-rem(792);
}

/* Высота фиксирована под font-size «404», чтобы цифры не обрезались. */
.not-found__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: to-rem(300);
  height: to-rem(200);

  @include mq($from: tablet) {
    max-width: to-rem(792);
    height: to-rem(400);
  }
}

/* Gradient text через background-clip: text — верхняя часть букв
 * прозрачна, чтобы glow просвечивал; нижняя проявляется тёмной маской.*/
.not-found__big {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(160);
  line-height: 1;
  letter-spacing: to-rem(-1.6);
  text-align: center;
  white-space: nowrap;
  background: linear-gradient(354deg, rgb(192 0 84 / 0%) 32%, rgb(192 0 84 / 29%) 70.151%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  pointer-events: none;

  @include mq($from: tablet) {
    font-size: to-rem(400);
    letter-spacing: to-rem(-4);
  }
}

/* <picture> по умолчанию inline и ломает flex-центрирование — снимаем
 * его из layout через display:contents, чтобы position'ировать img напрямую. */
.not-found__visual :deep(picture) {
  display: contents;
}

.not-found__truck {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.not-found__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(16);
  width: 100%;
  text-align: center;
}

.not-found__title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(32);
  line-height: to-rem(40);
  letter-spacing: to-rem(-0.32);
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    font-size: to-rem(56);
    line-height: to-rem(64);
    letter-spacing: to-rem(-0.56);
  }
}

.not-found__copy {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: to-rem(-0.16);
  color: var(--color-text-secondary);

  @include mq($from: tablet) {
    font-size: to-rem(18);
    letter-spacing: to-rem(-0.18);
  }
}

.not-found__cta {
  margin-top: to-rem(16);
}
</style>
