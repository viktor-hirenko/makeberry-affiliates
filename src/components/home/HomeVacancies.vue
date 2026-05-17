<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeVacancies } from '@/composables/useContent'

const content = useHomeVacancies()
</script>

<template>
  <section id="vacancies" class="home-vacancies" data-section="vacancies">
    <div class="home-vacancies__inner">
      <img
        :src="content.glow.src"
        :alt="content.glow.alt"
        class="home-vacancies__glow"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <img
        :src="content.target.src"
        :alt="content.target.alt"
        class="home-vacancies__target"
        aria-hidden="true"
        loading="lazy"
        decoding="async"
      />

      <h2 class="home-vacancies__title">{{ content.title }}</h2>

      <div class="home-vacancies__content">
        <ul class="home-vacancies__cards">
          <li v-for="card in content.cards" :key="card.id" class="home-vacancies__card">
            <header class="home-vacancies__head">
              <span class="home-vacancies__badge">{{ card.type }}</span>
              <h3 class="home-vacancies__job">{{ card.title }}</h3>
            </header>

            <p class="home-vacancies__desc">{{ card.description }}</p>

            <RouterLink
              :to="card.learnMoreHref"
              class="home-vacancies__link"
              :aria-label="`Learn more about ${card.title}`"
            >
              <span>{{ card.learnMoreLabel }}</span>
              <BaseIcon name="arrow-right" :size="24" />
            </RouterLink>
          </li>
        </ul>

        <BaseButton variant="secondary" :to="content.viewAll.href" class="home-vacancies__cta">
          {{ content.viewAll.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-vacancies {
  position: relative;
  overflow-x: clip;

  @include section-padding(to-rem(120));
}

.home-vacancies__glow {
  position: absolute;
  top: to-rem(-172);
  right: to-rem(-278);
  width: to-rem(598.264);
  max-width: unset;
  height: to-rem(797.36);
  pointer-events: none;
  user-select: none;
  z-index: 0;

  @include mq($from: tablet) {
    top: to-rem(-167);
    right: to-rem(-290);
  }
}

/* Dartboard-декор: скрыт <1024px, виден с ≥1024px (tablet+). */
.home-vacancies__target {
  display: none;

  @include mq($from: tablet) {
    display: block;
    position: absolute;
    top: to-rem(22);
    right: to-rem(-20);
    width: to-rem(200);
    height: to-rem(200);
    pointer-events: none;
    user-select: none;
    z-index: 2;
  }
}

.home-vacancies__inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: to-rem(1320);
  margin-inline: auto;
  @include section-stack;
}

.home-vacancies__title {
  @include font-section-title;
}

.home-vacancies__content {
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

/* Сетка: <768 — 1 кол.; 768–1023 — 2 кол.; ≥1024 — 3 кол.
 * 3-я карточка (`:nth-child(3)`) скрыта <1024px — в макете две + View All. */
.home-vacancies__cards {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(16);

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

.home-vacancies__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(24);
  padding: to-rem(24);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  transition: border-color var(--transition-base);

  &:hover {
    border-color: var(--color-border-default);
  }

  &:nth-child(3) {
    display: none;

    @include mq($from: tablet) {
      display: flex;
    }
  }
}

.home-vacancies__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  width: 100%;
}

.home-vacancies__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(12);
  background-color: var(--color-bg-subtle);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.home-vacancies__job {
  margin: 0;
  width: 100%;
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

.home-vacancies__desc {
  margin: 0;
  width: 100%;
  flex-grow: 1;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

/* Стрелка наследует цвет через currentColor — меняется вместе с текстом. */
.home-vacancies__link {
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

.home-vacancies__cta {
  align-self: center;
}
</style>
