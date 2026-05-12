<script setup lang="ts">
import { ref } from 'vue'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeFaq } from '@/composables/useContent'

const content = useHomeFaq()

/* ------------------------------------------------------------------
 * Аккордеон: один активный пункт. По Figma первый вопрос открыт
 * (defaultOpenId), остальные закрыты. Клик по уже открытому — закрывает.
 * ------------------------------------------------------------------ */
const openId = ref<string | null>(content.defaultOpenId ?? null)

function toggle(id: string): void {
  openId.value = openId.value === id ? null : id
}

function isOpen(id: string): boolean {
  return openId.value === id
}

function panelId(id: string): string {
  return `faq-panel-${id}`
}

function buttonId(id: string): string {
  return `faq-button-${id}`
}

/* ------------------------------------------------------------------
 * Плавная анимация раскрытия через max-height (без CLS).
 * Используем фактический scrollHeight, чтобы переход работал
 * на любом объёме текста.
 * ------------------------------------------------------------------ */
function onEnter(el: Element): void {
  const target = el as HTMLElement
  target.style.maxHeight = '0px'
  target.style.opacity = '0'
  void target.offsetHeight
  target.style.maxHeight = `${target.scrollHeight}px`
  target.style.opacity = '1'
}

function onAfterEnter(el: Element): void {
  const target = el as HTMLElement
  target.style.maxHeight = ''
  target.style.opacity = ''
}

function onLeave(el: Element): void {
  const target = el as HTMLElement
  target.style.maxHeight = `${target.scrollHeight}px`
  target.style.opacity = '1'
  void target.offsetHeight
  target.style.maxHeight = '0px'
  target.style.opacity = '0'
}
</script>

<template>
  <section id="faq" class="home-faq" data-section="faq">
    <div class="home-faq__inner">
      <img
        :src="content.glow.src"
        :alt="content.glow.alt"
        class="home-faq__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-faq__title">{{ content.title }}</h2>

      <div class="home-faq__content">
        <img
          :src="content.questionMark.src"
          :alt="content.questionMark.alt"
          class="home-faq__mark"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />

        <ul class="home-faq__list">
          <li
            v-for="item in content.items"
            :key="item.id"
            class="home-faq__item"
            :class="{ 'is-open': isOpen(item.id) }"
          >
            <button
              :id="buttonId(item.id)"
              type="button"
              class="home-faq__head"
              :aria-expanded="isOpen(item.id)"
              :aria-controls="panelId(item.id)"
              @click="toggle(item.id)"
            >
              <span class="home-faq__question">{{ item.question }}</span>
              <span class="home-faq__toggle" aria-hidden="true">
                <BaseIcon name="chevron-down" :size="24" />
              </span>
            </button>

            <Transition
              name="home-faq-collapse"
              @enter="onEnter"
              @after-enter="onAfterEnter"
              @leave="onLeave"
            >
              <div
                v-show="isOpen(item.id)"
                :id="panelId(item.id)"
                class="home-faq__panel"
                role="region"
                :aria-labelledby="buttonId(item.id)"
              >
                <div class="home-faq__divider" aria-hidden="true" />
                <p class="home-faq__answer">{{ item.answer }}</p>
              </div>
            </Transition>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70, gap 48
 * Desktop : px 60, py 100, gap 70
 * Glow декорация торчит влево за viewport — нужен overflow-x: clip.
 * ============================================================ */
.home-faq {
  position: relative;
  overflow-x: clip;

  @include section-padding(to-rem(230));

  @include mq($from: tablet) {
    padding-inline: to-rem(150);
  }

  @include mq($from: wide) {
    padding-inline: to-rem(230);
  }
}

.home-faq__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack;
}

/* ============================================================
 * Glow — pink radial декорация в левом верхнем углу.
 * Figma desktop : left -311, top -136, w 989.28, h 742.26
 * Figma mobile  : left -317, top -107.9, w 756.01, h 567.24
 * ============================================================ */
.home-faq__glow {
  position: absolute;
  top: to-rem(-175);
  left: to-rem(-390);
  width: to-rem(756);
  max-width: unset;
  height: auto;
  pointer-events: none;
  user-select: none;
  z-index: 0;

  @include mq($from: tablet) {
    top: to-rem(-236);
    left: to-rem(-311);
    width: to-rem(742);
    height: to-rem(989);
    transform: scaleX(-1);
  }
}

/* ============================================================
 * Title — 36/40 mobile, H3 56/64 desktop. По центру всегда (Figma).
 * ============================================================ */
.home-faq__title {
  @include font-section-title;
}

/* ============================================================
 * Content — обёртка для list + question-mark.
 * Desktop : ширина 980, по центру; question-mark абсолютно слева
 * по координатам Figma (frame "Image" 246.722, top 135, left 97
 * относительно секции с padding-x = 230).
 * ============================================================ */
.home-faq__content {
  position: relative;
  width: 100%;

  @include mq($from: tablet) {
    max-width: to-rem(980);
    margin-inline: auto;
  }
}

/* Question-mark — только desktop (по Figma на mobile отсутствует) */
.home-faq__mark {
  display: none;

  @include mq($from: tablet) {
    display: block;
    position: absolute;
    width: to-rem(200);
    height: to-rem(200);
    /*
     * По Figma image-frame 246.722×246.722 (rotated bbox), left 97 / top 135
     * относительно section (padding 100/230). Section→content offset:
     *   top  : -(padding-top 100 + title 64 + gap 70 - 135 + (246.722-200)/2) = -76
     *   left : -((1440-980)/2 - 97 - (246.722-200)/2) = -110
     */
    top: to-rem(-76);
    left: to-rem(-110);
    transform: rotate(-15.73deg);
    pointer-events: none;
    user-select: none;
    z-index: 1;
  }
}

/* ============================================================
 * List
 * Mobile  : gap 16
 * Desktop : gap 20
 * ============================================================ */
.home-faq__list {
  position: relative;
  z-index: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: to-rem(16);

  @include mq($from: tablet) {
    gap: to-rem(20);
  }
}

/* ============================================================
 * Item card — Bg/Surface, border subtle, radius 24
 * ============================================================ */
.home-faq__item {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: border-color var(--transition-base);

  &:hover {
    border-color: var(--color-border-default);
  }

  &.is-open {
    border-color: var(--color-border-default);
  }
}

/* ============================================================
 * Head (button)
 * Mobile  : padding 20, gap 20
 * Desktop : padding 24, gap 24
 * ============================================================ */
.home-faq__head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: to-rem(20);
  padding: to-rem(20);
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  color: inherit;
  font: inherit;

  @include mq($from: tablet) {
    gap: to-rem(24);
    padding: to-rem(24);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: -2px;
    border-radius: var(--radius-xl);
  }
}

/* ============================================================
 * Question text
 * Mobile  : 24/32, weight 500, tracking -0.01em
 * Desktop : 32/40, weight 500, tracking -0.01em
 * Активный пункт — цвет accent (pink).
 * ============================================================ */
.home-faq__question {
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  transition: color var(--transition-base);

  @include mq($from: tablet) {
    font-size: to-rem(32);
    line-height: to-rem(40);
  }

  .is-open & {
    color: var(--color-text-accent);
  }
}

/* ============================================================
 * Toggle (round icon-button) — 32 mobile / 40 desktop
 * Одна иконка chevron-down: на is-open поворачивается на 180deg
 * с плавным transition (вместо подмены up/down).
 * ============================================================ */
.home-faq__toggle {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: to-rem(32);
  height: to-rem(32);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-icon-primary);
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  @include mq($from: tablet) {
    width: to-rem(40);
    height: to-rem(40);
  }

  .home-faq__head:hover & {
    background-color: var(--color-bg-hovered);
  }

  /* Иконка внутри: chevron-down 16px на mobile, 24px на desktop. */
  :deep(.base-icon) {
    width: to-rem(16);
    height: to-rem(16);
    transition: transform var(--transition-base);

    @include mq($from: tablet) {
      width: to-rem(24);
      height: to-rem(24);
    }
  }

  /* Поворот стрелки в is-open состоянии */
  .is-open & :deep(.base-icon) {
    transform: rotate(180deg);
  }
}

/* ============================================================
 * Panel (answer)
 * ============================================================ */
.home-faq__panel {
  overflow: hidden;
}

.home-faq__divider {
  height: 1px;
  background-color: var(--color-border-subtle);
}

.home-faq__answer {
  margin: 0;
  padding: to-rem(20);
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);

  @include mq($from: tablet) {
    padding: to-rem(24);
  }
}

/* ============================================================
 * Collapse transition (max-height управляется через JS-хуки)
 * ============================================================ */
.home-faq-collapse-enter-active,
.home-faq-collapse-leave-active {
  overflow: hidden;
  transition:
    max-height var(--transition-base),
    opacity var(--transition-base);
}
</style>
