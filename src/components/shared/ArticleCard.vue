<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import type { ArticleSummary } from '@/types/content'

interface ArticleCardProps {
  article: ArticleSummary
  /** надпись для ссылки "Learn More" */
  learnMoreLabel?: string
}

withDefaults(defineProps<ArticleCardProps>(), {
  learnMoreLabel: 'Learn More',
})
</script>

<template>
  <article class="article-card">
    <RouterLink
      :to="`/blog/${article.slug}`"
      class="article-card__media"
      :aria-label="article.title"
    >
      <img
        v-if="article.imageSrc"
        :src="article.imageSrc"
        :alt="article.imageAlt"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="article-card__placeholder" aria-hidden="true" />
    </RouterLink>

    <div class="article-card__body">
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p v-if="article.excerpt" class="article-card__excerpt">
        {{ article.excerpt }}
      </p>
    </div>

    <RouterLink
      :to="`/blog/${article.slug}`"
      class="article-card__link"
      :aria-label="`Learn more about ${article.title}`"
    >
      <span>{{ learnMoreLabel }}</span>
      <BaseIcon name="arrow-right" :size="24" />
    </RouterLink>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* Карточка статьи — Figma 2556:1182. */
.article-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(24);
}

.article-card__media {
  display: block;
  width: 100%;
  height: to-rem(210);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--color-bg-card);
  position: relative;
  text-decoration: none;

  @include mq($from: tablet) {
    height: to-rem(250);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-base);
  }

  &:hover img {
    transform: scale(1.04);
  }
}

.article-card__placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-card);
}

.article-card__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  width: 100%;
}

.article-card__title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;

  @include mq($from: tablet) {
    font-size: to-rem(32);
    line-height: to-rem(40);
  }
}

.article-card__excerpt {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Стрелка наследует цвет через currentColor — меняется вместе с текстом. */
.article-card__link {
  display: inline-flex;
  align-items: center;
  gap: to-rem(8);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(18);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-accent);
  text-decoration: none;
  transition: color var(--transition-base);

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }
}
</style>
