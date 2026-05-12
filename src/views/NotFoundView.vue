<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <section class="not-found">
    <div class="not-found__inner">
      <!-- Декоративный glow — pure CSS radial-gradient (Figma 3861:23211).
         Один эллипс, без вложенной группы. Геометрия и цвет — из Figma. -->
      <div class="not-found__glow" aria-hidden="true"></div>
      <!-- Visual: большая полупрозрачная "404" + truck/berry поверх.
           На mobile (<1024) грузим уменьшенную картинку 600×400 (~110 KB),
           на desktop полноразмерную 1200×799 для retina (~344 KB). -->
      <div class="not-found__visual">
        <span class="not-found__big" aria-hidden="true">404</span>
        <picture>
          <source media="(min-width: 1024px)" srcset="/images/404/truck.png" />
          <img
            src="/images/404/truck-mobile.png"
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
        <h1 class="not-found__title">Page is on the way</h1>
        <p class="not-found__copy">While it’s traveling, you might want to check this instead.</p>
        <BaseButton variant="secondary" size="large" to="/" class="not-found__cta">
          Go Home
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section root
 * Страница идёт flush до верха viewport (header floating overlay'ит
 * контент сверху). Hero занимает полный 100svh, футер скрыт через
 * router meta.hideFooter.
 * ============================================================ */
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

/* ============================================================
 * GLOW — pure CSS radial-gradient ellipse, без PNG (Figma 3861:23211).
 * Один эллипс. Mobile : 562×190 / top -27 / left -170 / rotate 15.32deg
 *              Desktop: 1458×492 / top 155 / left -149 / rotate 15.32deg
 * Gradient: 48.94% 40.37% at 40.33% 51.95%, #ff0180
 *           stops 0/0.45 → 7.21%/0.45 → 100%/0.
 * ============================================================ */
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

/* ============================================================
 * Inner — content wrapper
 * gap между visual и content (Figma): минимальный, ~16-24px,
 * т.к. сам visual frame уже включает свободное вертикальное
 * пространство (truck height ~70% от высоты frame).
 * ============================================================ */
.not-found__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  // gap: to-rem(16);
  width: 100%;
  max-width: to-rem(792);

  @include mq($from: tablet) {
    // gap: to-rem(24);
  }
}

/* ============================================================
 * VISUAL — composition frame: «404» текст занимает всю высоту,
 * truck/berry лежит поверх, по центру, с собственной высотой.
 * Высоту фиксируем под font-size «404» (160 mobile / 400 desktop),
 * чтобы 404 не обрезалось: Mobile 320×160, Desktop 792×400.
 * ============================================================ */
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

/* «404» — Inter Semi Bold (600) с gradient text по Figma 3104:1322:
 *   linear-gradient(
 *     176.23deg,
 *     rgba(192, 0, 84, 0)  18.595%,   ← верх блока ПОЛНОСТЬЮ прозрачный
 *     rgba(0, 0, 0, 0.75)  70.151%    ← низ — semi-transparent чёрный
 *   );
 * Текст: color: transparent + background-clip: text — буквы окрашены
 * градиентом. Верх 18.6% — invisible (glow свободно просвечивает),
 * с 70% и ниже — тёмная маска, дающая «контур» нижней половины 404.
 * Mobile : 160px, Desktop : 400px (по Figma). */
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

/* Truck/berry — поверх «404». Wrapper <picture> не должен ломать
 * центрирование (default display:inline) → display:contents.
 * Сам img абсолютно позиционируем внутри visual: высота ~70% от
 * frame, ширина auto (сохраняет пропорции PNG). */
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

/* ============================================================
 * CONTENT — title + copy + button
 * gap внутри content: 16 (title↔copy) и 32 (text↔button) — по Figma.
 * ============================================================ */
.not-found__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(16);
  width: 100%;
  text-align: center;
}

/* Title: H4 32/40 mobile, H3 56/64 desktop */
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

/* Copy: Body 2 Regular 16/24 mobile, Body 1 Regular 18/24 desktop */
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

/* Кнопка стоит на расстоянии 32 от копии (16 gap родителя + 16 margin) */
.not-found__cta {
  margin-top: to-rem(16);
}
</style>
