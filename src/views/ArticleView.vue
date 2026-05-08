<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { getAdjacentArticles, getArticleBySlug, useBlogMeta } from '@/composables/useContent'
import type { ArticleSection } from '@/types/content'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const article = computed(() => getArticleBySlug(props.slug))
const adjacent = computed(() => getAdjacentArticles(props.slug))
const blogMeta = useBlogMeta()

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
    <!-- Декоративные гловы -->
    <img
      :src="blogMeta.glow.leftSrc"
      :alt="blogMeta.glow.alt"
      class="article__glow article__glow--left"
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
    <img
      :src="blogMeta.glow.rightSrc"
      :alt="blogMeta.glow.alt"
      class="article__glow article__glow--right"
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />

    <div class="article__inner">
      <!-- BACK link -->
      <RouterLink to="/blog" class="article__back">
        <span>Back</span>
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
            <figure
              v-for="img in section.images"
              :key="img.alt"
              class="article__image"
            >
              <img
                v-if="img.src"
                :src="img.src"
                :alt="img.alt"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="article__image-placeholder" aria-hidden="true" />
            </figure>
          </div>

          <!-- Text section -->
          <section v-else-if="isTextSection(section)" class="article__section">
            <h2 v-if="section.title" class="article__section-title">
              {{ section.title }}
            </h2>
            <div
              v-if="section.bodyHtml"
              class="article__section-body"
              v-html="section.bodyHtml"
            />
            <div
              v-for="sub in section.subsections"
              :key="sub.id"
              class="article__subsection"
            >
              <p v-if="sub.title" class="article__subsection-title">
                {{ sub.title }}
              </p>
              <div
                v-if="sub.bodyHtml"
                class="article__subsection-body"
                v-html="sub.bodyHtml"
              />
            </div>
          </section>
        </template>
      </div>

      <!-- PAGINATION: Previous / Next -->
      <nav
        v-if="adjacent.prev || adjacent.next"
        class="article__pagination"
        aria-label="Article navigation"
      >
        <BaseButton
          v-if="adjacent.prev"
          variant="tetriary"
          size="large"
          :to="`/blog/${adjacent.prev.slug}`"
          class="article__pagination-btn"
        >
          Previous
        </BaseButton>
        <span v-else class="article__pagination-spacer" aria-hidden="true" />

        <BaseButton
          v-if="adjacent.next"
          variant="primary"
          size="large"
          :to="`/blog/${adjacent.next.slug}`"
          class="article__pagination-btn"
        >
          Next
        </BaseButton>
        <span v-else class="article__pagination-spacer" aria-hidden="true" />
      </nav>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section root
 * Mobile  : px 16, py 70
 * Desktop : px 60, py 100
 * ============================================================ */
.article {
  position: relative;
  background-color: var(--color-bg-page);
  padding: to-rem(70) to-rem(16);
  overflow: hidden;

  @include mq($from: mobile) {
    padding-inline: to-rem(32);
  }

  @include mq($from: tablet) {
    padding: to-rem(100) to-rem(60);
  }
}

/* ============================================================
 * Декоративные гловы (как на Blog page)
 * ============================================================ */
.article__glow {
  position: absolute;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.article__glow--left {
  width: to-rem(500);
  height: to-rem(375);
  top: to-rem(-63);
  left: to-rem(-183);

  @include mq($from: tablet) {
    width: to-rem(989);
    height: to-rem(742);
    top: to-rem(-269);
    left: to-rem(-354);
  }
}

.article__glow--right {
  display: none;

  @include mq($from: tablet) {
    display: block;
    width: to-rem(1206);
    height: to-rem(840);
    top: to-rem(-43);
    right: to-rem(-322);
  }
}

/* ============================================================
 * Inner — main container
 * ============================================================ */
.article__inner {
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
    max-width: to-rem(1200);
    gap: to-rem(56);
  }
}

/* ============================================================
 * BACK link — text + U-turn icon
 * Body 2/Medium 16/24, color text/link (#d9d9d9)
 * ============================================================ */
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

/* ============================================================
 * HEADER — title + tags
 * ============================================================ */
.article__header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(24);
}

/* H4 mobile (32/40 medium), H3 desktop (56/64 medium) */
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

/* Tags row: flex wrap, центрировано */
.article__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: to-rem(8);
}

/* Tag pill: bg subtle, padding 12/8, radius pill, Caption/Medium 14/16 */
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

/* ============================================================
 * HERO image — full width 1200×400 (desktop), 328×210 (mobile)
 * radius 24, bg #1a1a1a placeholder если нет картинки
 * ============================================================ */
.article__hero {
  margin: 0;
  width: 100%;
  height: to-rem(210);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background-color: #1a1a1a;

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
  background-color: #1a1a1a;
}

/* ============================================================
 * BODY — text content, max-width 800 desktop / full mobile
 * ============================================================ */
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

/* Intro — Body 2/Regular 16/24, color text/secondary */
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

/* Divider — 1px subtle line */
.article__divider {
  margin: 0;
  width: 100%;
  height: 1px;
  border: 0;
  background-color: var(--color-border-default);
}

/* Section block: title H4 + body paragraphs + subsections */
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

/* Section body — paragraphs */
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

/* Subsection: lead paragraph + bullet list */
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

/* ============================================================
 * IMAGES ROW — 2 cards
 * Desktop : 2 cols, gap 20, 300 height
 * Mobile  : stack, gap 16, 200 height
 * ============================================================ */
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
  background-color: #1a1a1a;

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
  background-color: #1a1a1a;
}

/* ============================================================
 * PAGINATION — Previous (tetriary) / Next (primary)
 * Mobile  : full-width 328 wide row, gap 8
 * Desktop : centered 286 wide
 * ============================================================ */
.article__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(8);
  width: 100%;

  @include mq($from: tablet) {
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
