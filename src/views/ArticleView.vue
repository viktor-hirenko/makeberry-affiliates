<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import {
  getAdjacentArticles,
  getArticleBySlug,
  useBlogMeta,
  useSharedUi,
} from '@/composables/useContent'
import type { ArticleSection } from '@/types/content'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const article = computed(() => getArticleBySlug(props.slug))
const adjacent = computed(() => getAdjacentArticles(props.slug))
const blogMeta = useBlogMeta()
const ui = useSharedUi()

if (!article.value) {
  router.replace({ name: 'not-found' })
}

function isImageRow(section: ArticleSection): boolean {
  return Boolean(section.images?.length)
}

function isTextSection(section: ArticleSection): boolean {
  return Boolean(section.title || section.bodyHtml || section.subsections?.length)
}
</script>

<template>
  <article v-if="article" class="article">
    <picture class="article__glow" aria-hidden="true">
      <source media="(min-width: 1024px)" :srcset="blogMeta.glow.src" />
      <img
        :src="blogMeta.glow.mobileSrc"
        :alt="blogMeta.glow.alt"
        loading="eager"
        decoding="async"
      />
    </picture>

    <div class="article__inner">
      <RouterLink to="/blog" class="article__back">
        <span>{{ ui.actions.back }}</span>
        <BaseIcon name="arrow-back" :size="24" />
      </RouterLink>

      <!-- TITLE + TAGS -->
      <header class="article__header">
        <h1 class="article__title">{{ article.title }}</h1>
        <ul v-if="article.tags?.length" class="article__tags">
          <li v-for="tag in article.tags" :key="tag" class="article__tag">
            {{ tag }}
          </li>
        </ul>
      </header>

      <!-- HERO image -->
      <figure class="article__hero">
        <img
          v-if="article.heroImageSrc"
          :src="article.heroImageSrc"
          :alt="article.heroImageAlt"
          loading="eager"
          decoding="async"
        />
        <div v-else class="article__hero-placeholder" aria-hidden="true" />
      </figure>

      <!-- BODY -->
      <div class="article__body">
        <div v-if="article.introHtml" class="article__intro" v-html="article.introHtml" />

        <hr v-if="article.sections?.length" class="article__divider" />

        <template v-for="section in article.sections" :key="section.id">
          <!-- Image row -->
          <div v-if="isImageRow(section)" class="article__images">
            <figure v-for="img in section.images" :key="img.alt" class="article__image">
              <img v-if="img.src" :src="img.src" :alt="img.alt" loading="lazy" decoding="async" />
              <div v-else class="article__image-placeholder" aria-hidden="true" />
            </figure>
          </div>

          <!-- Text section -->
          <section v-else-if="isTextSection(section)" class="article__section">
            <h2 v-if="section.title" class="article__section-title">
              {{ section.title }}
            </h2>
            <div v-if="section.bodyHtml" class="article__section-body" v-html="section.bodyHtml" />
            <div v-for="sub in section.subsections" :key="sub.id" class="article__subsection">
              <p v-if="sub.title" class="article__subsection-title">
                {{ sub.title }}
              </p>
              <div v-if="sub.bodyHtml" class="article__subsection-body" v-html="sub.bodyHtml" />
            </div>
          </section>
        </template>
      </div>

      <!-- PAGINATION: Previous / Next -->
      <nav
        v-if="adjacent.prev || adjacent.next"
        class="article__pagination"
        :aria-label="ui.aria.navArticle"
      >
        <BaseButton
          v-if="adjacent.prev"
          variant="tetriary"
          size="large"
          :to="`/blog/${adjacent.prev.slug}`"
          class="article__pagination-btn"
        >
          {{ ui.actions.previous }}
        </BaseButton>
        <span v-else class="article__pagination-spacer" aria-hidden="true" />

        <BaseButton
          v-if="adjacent.next"
          variant="primary"
          size="large"
          :to="`/blog/${adjacent.next.slug}`"
          class="article__pagination-btn"
        >
          {{ ui.actions.next }}
        </BaseButton>
        <span v-else class="article__pagination-spacer" aria-hidden="true" />
      </nav>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.article {
  position: relative;
  flex: 1;
  width: 100%;
  padding-block-start: to-rem(160);

  @include section-padding(
    $desktop-inline: to-rem(120),
    $mobile-top: to-rem(160),
    $desktop-top: to-rem(160)
  );
}

/* Декоративный ellipse-glow — те же ассеты, что на Blog page. */
.article__glow {
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

.article__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack($align: center, $gap-tablet: to-rem(56));

  @include mq($from: tablet) {
    max-width: to-rem(1200);
  }
}

.article__back {
  display: inline-flex;
  align-items: center;
  gap: to-rem(8);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-link);
  text-decoration: none;
  transition: color var(--transition-base);
  align-self: center;

  &:hover {
    color: var(--color-text-primary);
  }
}

.article__header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(24);
}

.article__title {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(32);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;

  @include mq($from: tablet) {
    font-size: to-rem(56);
    line-height: to-rem(64);
    letter-spacing: to-rem(-0.56);
  }
}

.article__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: to-rem(8);
}

.article__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(12);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* Hero image: placeholder bg-card если src отсутствует. */
.article__hero {
  margin: 0;
  width: 100%;
  height: to-rem(210);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--color-bg-card);

  @include mq($from: tablet) {
    height: to-rem(400);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.article__hero-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-card);
}

.article__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(48);

  @include mq($from: tablet) {
    max-width: to-rem(800);
    margin-inline: auto;
  }
}

.article__intro {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);

  :deep(p) {
    margin: 0 0 to-rem(16);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }
}

.article__divider {
  margin: 0;
  width: 100%;
  height: 1px;
  border: 0;
  background-color: var(--color-border-default);
}

.article__section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(24);
}

.article__section-title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    font-size: to-rem(32);
    line-height: to-rem(40);
  }
}

.article__section-body {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);

  :deep(p) {
    margin: 0 0 to-rem(16);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(a) {
    color: var(--color-text-accent);
    text-decoration: none;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.8;
    }
  }
}

.article__subsection {
  display: flex;
  flex-direction: column;
  gap: to-rem(8);
  font-family: var(--font-sans);
  color: var(--color-text-secondary);
}

.article__subsection-title {
  margin: 0;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  font-weight: 400;
}

.article__subsection-body {
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;

  :deep(ul) {
    margin: 0;
    padding-left: to-rem(24);
    list-style: disc;
  }

  :deep(li) {
    margin-bottom: to-rem(4);
  }

  :deep(li:last-child) {
    margin-bottom: 0;
  }

  :deep(p) {
    margin: 0 0 to-rem(16);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }
}

.article__images {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  width: 100%;

  @include mq($from: tablet) {
    flex-direction: row;
    gap: to-rem(20);
  }
}

.article__image {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  height: to-rem(200);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: var(--color-bg-card);

  @include mq($from: tablet) {
    height: to-rem(300);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.article__image-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-card);
}

.article__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  width: 100%;

  @include mq($from: mobile) {
    width: to-rem(286);
  }
}

.article__pagination-btn {
  flex: 1 1 0;
  min-width: 0;
}

.article__pagination-spacer {
  flex: 1 1 0;
}
</style>
