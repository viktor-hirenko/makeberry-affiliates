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
  <section
    id="blog"
    class="home-blog"
    data-section="blog"
  >
    <div class="home-blog__inner">
      <h2 class="home-blog__title">{{ content.title }}</h2>

      <div class="home-blog__content">
        <ul class="home-blog__list">
          <li
            v-for="article in previewArticles"
            :key="article.slug"
            class="home-blog__item"
          >
            <ArticleCard :article="article" />
          </li>
        </ul>

        <BaseButton
          variant="secondary"
          :to="content.viewAll.href"
          class="home-blog__cta"
        >
          {{ content.viewAll.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70, gap 48
 * Desktop : px 60, py 100, gap 70
 * Без декораций.
 * ============================================================ */
.home-blog {
  position: relative;
  background-color: var(--color-bg-page);
  padding: to-rem(70) var(--container-pad-mobile);

  @include mq($from: mobile) {
    padding-inline: var(--container-pad-tablet);
  }

  @include mq($from: tablet) {
    padding: to-rem(100) var(--container-pad-desktop);
  }
}

.home-blog__inner {
  position: relative;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(48);

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * Title — H4 36/40 mobile, H3 56/64 desktop, центр
 * ============================================================ */
.home-blog__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    font-size: to-rem(56);
    line-height: to-rem(64);
  }
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

/* ============================================================
 * List — 1 col; ≥ mobile две; ≥ tablet три (как превью на всю ширину).
 * ============================================================ */
.home-blog__list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(48);

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: to-rem(20);
  }

  @include mq($from: tablet) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: to-rem(20);
  }
}

.home-blog__item {
  display: flex;
}

.home-blog__item > :deep(*) {
  flex: 1;
}

.home-blog__cta {
  align-self: center;
}
</style>
