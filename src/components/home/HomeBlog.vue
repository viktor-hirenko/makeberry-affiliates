<script setup lang="ts">
import { computed } from 'vue'
import ArticleCard from '@/components/shared/ArticleCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useArticles, useHomeBlog } from '@/composables/useContent'

const content = useHomeBlog()
const articles = useArticles()

/* На главной показываем 3 свежих поста — те же первые 3 карточки,
 * что и на странице блога, с теми же slug. */
const previewArticles = computed(() => articles.slice(0, 3))
</script>

<template>
  <section id="blog" class="home-blog" data-section="blog">
    <div class="home-blog__inner">
      <h2 class="home-blog__title">{{ content.title }}</h2>

      <div class="home-blog__content">
        <ul class="home-blog__list">
          <li v-for="article in previewArticles" :key="article.slug" class="home-blog__item">
            <ArticleCard :article="article" />
          </li>
        </ul>

        <BaseButton variant="secondary" :to="content.viewAll.href" class="home-blog__cta">
          {{ content.viewAll.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-blog {
  position: relative;

  @include section-padding(to-rem(120));
}

.home-blog__inner {
  position: relative;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack;
}

.home-blog__title {
  @include font-section-title;
}

.home-blog__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(48);
  width: 100%;

  @include mq($from: tablet) {
    max-width: to-rem(1200);
    margin-inline: auto;
  }
}

/* Третья карточка только с tablet: на mobile две + CTA → /blog. */
.home-blog__list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(48);

  @include mq($from: compact) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(16);
  }

  @include mq($from: mobile) {
    gap: to-rem(20);
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: to-rem(20);
  }
}

.home-blog__item {
  display: flex;

  &:nth-child(3) {
    display: none;

    @include mq($from: tablet) {
      display: flex;
    }
  }
}

.home-blog__item > :deep(*) {
  flex: 1;
}

.home-blog__cta {
  align-self: center;
}
</style>
