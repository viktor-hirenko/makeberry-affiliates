<template>
  <article class="legal-page">
    <div class="legal-page__inner">
      <h1 class="legal-page__title">{{ content.title }}</h1>

      <div class="legal-page__body" v-html="content.introHtml"></div>

      <section
        v-for="section in content.sections"
        :key="section.id"
        class="legal-page__section"
      >
        <h2 class="legal-page__section-title">{{ section.title }}</h2>

        <div v-if="section.introHtml" class="legal-page__content" v-html="section.introHtml"></div>

        <template v-if="section.subsections">
          <template v-for="sub in section.subsections" :key="sub.id">
            <h3 v-if="sub.title" class="legal-page__subsection-title">{{ sub.title }}</h3>
            <div class="legal-page__content" v-html="sub.bodyHtml"></div>
          </template>
        </template>
      </section>
    </div>
  </article>
</template>

<script setup lang="ts">
import { usePrivacy } from '@/composables/useContent'

const content = usePrivacy()
</script>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.legal-page {
  flex: 1;
  width: 100%;

  @include section-padding(
    $desktop-inline: to-rem(60),
    $mobile-top: to-rem(100),
    $mobile-bottom: to-rem(80),
    $desktop-top: to-rem(150),
    $desktop-bottom: to-rem(100)
  );

  @include mq($from: tablet) {
    padding-top: to-rem(150);
  }
}

.legal-page__inner {
  width: 100%;
  max-width: var(--container-md);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: to-rem(40);

  @include mq($from: tablet) {
    gap: to-rem(48);
  }
}

/* h1 — шкала font-section-title, без text-align: center, ALL CAPS */
.legal-page__title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(36);
  line-height: to-rem(40);
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    font-size: to-rem(56);
    line-height: to-rem(64);
  }
}

.legal-page__body {
  display: flex;
  flex-direction: column;
  gap: to-rem(12);

  :deep(p) {
    margin: 0;
    @include font-body-s-regular;
    line-height: to-rem(26);
    color: var(--color-text-secondary);
  }

  :deep(a) {
    color: var(--color-text-accent, var(--color-text-primary));
    text-decoration: none;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.75;
    }
  }
}

.legal-page__section {
  display: flex;
  flex-direction: column;
  gap: to-rem(12);
  padding-top: to-rem(24);
  border-top: 1px solid var(--color-border-default);
}

.legal-page__content {
  display: flex;
  flex-direction: column;
  gap: to-rem(12);

  :deep(p) {
    margin: 0;
    @include font-body-s-regular;
    line-height: to-rem(26);
    color: var(--color-text-secondary);
  }

  :deep(ul),
  :deep(ol) {
    margin: to-rem(4) 0;
    padding-left: to-rem(28);
  }

  :deep(li) {
    @include font-body-s-regular;
    line-height: to-rem(26);
    color: var(--color-text-secondary);
  }

  :deep(li:not(:last-child)) {
    margin-bottom: to-rem(8);
  }

  :deep(ul li) {
    list-style: disc;
  }

  :deep(ol li) {
    list-style: decimal;
  }

  :deep(a) {
    color: var(--color-text-accent, var(--color-text-primary));
    text-decoration: none;
    transition: opacity var(--transition-base);

    &:hover {
      opacity: 0.8;
    }
  }

  /* Таблица «Как мы используем данные» */
  :deep(.legal-page__table-wrap) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: to-rem(8);
    border: 1px solid var(--color-border-default);
  }

  :deep(.legal-page__table) {
    width: 100%;
    min-width: to-rem(520);
    border-collapse: collapse;

    th,
    td {
      padding: to-rem(12) to-rem(16);
      text-align: left;
      vertical-align: top;
      @include font-body-s-regular;
      line-height: to-rem(24);
      color: var(--color-text-secondary);
      border-bottom: 1px solid var(--color-border-default);
    }

    th {
      @include font-body-s-semibold;
      color: var(--color-text-primary);
      background-color: var(--color-bg-subtle);
    }

    tr:last-child td {
      border-bottom: none;
    }

    td:first-child,
    th:first-child {
      width: 60%;
    }
  }
}

/* h2 — font-h5 (20/24) mobile → font-h4 (32/40) tablet, ALL CAPS */
.legal-page__section-title {
  margin: 0;
  @include font-h5;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-primary);

  @include mq($from: tablet) {
    @include font-h4;
    font-weight: 600;
  }
}

/* h3 — font-body-l-semibold (18/24) */
.legal-page__subsection-title {
  margin: to-rem(4) 0 0;
  @include font-body-l-semibold;
  color: var(--color-text-primary);
}
</style>
