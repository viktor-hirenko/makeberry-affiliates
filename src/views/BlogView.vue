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
  <div class="blog-page">
    <picture class="blog-page__glow" aria-hidden="true">
      <source media="(min-width: 1024px)" :srcset="meta.glow.src" />
      <img
        :src="meta.glow.mobileSrc"
        :alt="meta.glow.alt"
        loading="eager"
        decoding="async"
      />
    </picture>

    <div class="blog-page__inner">
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
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.blog-page {
  position: relative;

  @include section-padding(
    $desktop-inline: to-rem(120),
    $mobile-top: to-rem(160),
    $desktop-top: to-rem(160)
  );
}

.blog-page__glow {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  pointer-events: none;
  user-select: none;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.blog-page__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center);
}

/* Бейджи только desktop (на mobile отсутствуют). */
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

.blog-page__badge--brand-fill {
  background-color: var(--color-bg-brand);
  color: var(--color-text-primary);
}

.blog-page__badge--outlined-white {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  border: 2px solid var(--color-text-primary);
}

.blog-page__badge--outlined-brand {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-brand);
}

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

.blog-page__more {
  align-self: center;
}
</style>
