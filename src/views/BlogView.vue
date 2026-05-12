<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleCard from '@/components/shared/ArticleCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useArticles, useBlogMeta } from '@/composables/useContent'

const meta = useBlogMeta()
const articles = useArticles()

/* Из Figma layout 3×3 = 9 карточек на первый экран. */
const PAGE_SIZE = 9
const visibleCount = ref(PAGE_SIZE)

const visibleArticles = computed(() => articles.slice(0, visibleCount.value))
const hasMore = computed(() => visibleArticles.value.length < articles.length)

function loadMore() {
  visibleCount.value += PAGE_SIZE
}
</script>

<template>
  <article class="blog-page">
    <div class="blog-page__inner">
      <!-- Декоративные гловы (только desktop) -->
      <img
        :src="meta.glow.leftSrc"
        :alt="meta.glow.alt"
        class="blog-page__glow blog-page__glow--left"
        aria-hidden="true"
        loading="eager"
        decoding="async"
      />
      <img
        :src="meta.glow.rightSrc"
        :alt="meta.glow.alt"
        class="blog-page__glow blog-page__glow--right"
        aria-hidden="true"
        loading="eager"
        decoding="async"
      />

      <!-- HEADER: title + декоративные badges -->
      <header class="blog-page__header">
        <h1 class="blog-page__title">{{ meta.title }}</h1>

        <ul class="blog-page__badges" aria-hidden="true">
          <li
            v-for="badge in meta.badges"
            :key="badge.id"
            class="blog-page__badge-slot"
            :style="{
              '--badge-x': `${badge.offsetX}px`,
              '--badge-y': `${badge.offsetY}px`,
            }"
          >
            <span
              class="blog-page__badge"
              :class="`blog-page__badge--${badge.variant}`"
              :style="{ '--badge-rotate': `${badge.rotate}deg` }"
            >
              {{ badge.label }}
            </span>
          </li>
        </ul>
      </header>

      <!-- GRID -->
      <div class="blog-page__grid">
        <ArticleCard v-for="article in visibleArticles" :key="article.slug" :article="article" />
      </div>

      <!-- View More button -->
      <BaseButton
        v-if="hasMore"
        variant="secondary"
        size="large"
        class="blog-page__more"
        @click="loadMore"
      >
        {{ meta.loadMoreLabel }}
      </BaseButton>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/section-patterns' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70
 * Desktop : px 60, py 100, gap 70 между header → grid → button
 * Гловы — абсолютно позиционируем относительно секции.
 * ============================================================ */
.blog-page {
  position: relative;
  background-color: var(--color-bg-page);
  overflow: hidden;

  @include section-padding(
    $desktop-inline: to-rem(120),
    $mobile-top: to-rem(160),
    $desktop-top: to-rem(160)
  );
}

/* ============================================================
 * Декоративные гловы
 * Mobile  : только левая ~500×375 на (-183, -63)
 * Desktop : левая 989×742 на (-354, -269), правая 1206×840 на (1762, -43)
 * Pointer-events отключены, чтобы не мешали кликам.
 * ============================================================ */
.blog-page__glow {
  position: absolute;
  max-width: unset;
  height: auto;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.blog-page__glow--left {
  width: to-rem(500);
  top: to-rem(-207);
  left: to-rem(-183);

  @include mq($from: tablet) {
    width: to-rem(989);
    top: to-rem(-429);
    left: to-rem(-454);
  }
}

.blog-page__glow--right {
  /* На mobile правой гловы нет (Figma 3861:19714) */
  display: none;

  @include mq($from: mobile) {
    display: block;
    width: to-rem(1094);
    top: to-rem(-456);
    right: to-rem(-513);
  }

  @include mq($from: tablet) {
    display: block;
    top: to-rem(-392);
    right: to-rem(-322);
  }
}

.blog-page__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * HEADER
 * Mobile  : только заголовок (Figma 3861:19719) — без бейджей
 * Desktop : 1200px ширина, бейджи абсолютно позиционируем
 *           вокруг центрального заголовка
 * ============================================================ */
.blog-page__header {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: to-rem(48);

  @include mq($from: tablet) {
    max-width: to-rem(1200);
    margin-inline: auto;
    min-height: to-rem(118);
    padding-top: to-rem(20);
  }
}

/* H4 mobile (36/40), H1 64/72 desktop (Figma "Blog" 64/72 SemiBold) */
.blog-page__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    font-size: to-rem(64);
    line-height: to-rem(72);
    letter-spacing: to-rem(-0.64);
  }
}

/* ============================================================
 * BADGES — декоративные пилюли только на desktop
 * ============================================================ */
.blog-page__badges {
  display: none;

  @include mq($from: tablet) {
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
}

.blog-page__badge-slot {
  position: absolute;
  top: var(--badge-y, 0);
  left: 50%;
  transform: translateX(calc(-50% + var(--badge-x, 0px)));

  &:last-child {
    z-index: -1;
  }
}

/* Базовый стиль для бейджей */
.blog-page__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(16) to-rem(24);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(32);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  text-align: center;
  white-space: nowrap;
  transform: rotate(var(--badge-rotate, 0deg));
  transform-origin: center;
}

/* brand-fill: розовый bg, белый текст */
.blog-page__badge--brand-fill {
  background-color: var(--color-bg-brand);
  color: var(--color-text-primary);
}

/* outlined-white: чёрный bg, белый бордер */
.blog-page__badge--outlined-white {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  border: 2px solid var(--color-text-primary);
}

/* outlined-brand: чёрный bg, розовый бордер */
.blog-page__badge--outlined-brand {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-brand);
}

/* ============================================================
 * GRID — articles
 * Узкий телефон (меньше 768px): 1 col, gap 48
 * mobile–tablet (768–1023): 2 col, gap 20 — как сетки на главной
 * ≥ tablet: 3 col (Figma 2503:5464)
 * ============================================================ */
.blog-page__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(48);
  width: 100%;

  @include mq($from: mobile, $until: tablet) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(20);
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: to-rem(20);
    row-gap: to-rem(48);
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}

/* ============================================================
 * View More button — secondary (white bg, black text)
 * ============================================================ */
.blog-page__more {
  align-self: center;
}
</style>
