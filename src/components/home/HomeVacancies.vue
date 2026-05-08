<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeVacancies } from '@/composables/useContent'

const content = useHomeVacancies()
</script>

<template>
  <section id="vacancies" class="home-vacancies" data-section="vacancies">
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

    <div class="home-vacancies__inner">
      <h2 class="home-vacancies__title">{{ content.title }}</h2>

      <div class="home-vacancies__content">
        <ul class="home-vacancies__cards">
          <li v-for="card in content.cards" :key="card.id" class="home-vacancies__card">
            <header class="home-vacancies__head">
              <span class="home-vacancies__badge">{{ card.type }}</span>
              <h3 class="home-vacancies__job">{{ card.title }}</h3>
            </header>

            <p class="home-vacancies__desc">{{ card.description }}</p>

            <RouterLink :to="card.learnMoreHref" class="home-vacancies__link">
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
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/section-patterns' as *;
@use '@/assets/styles/scss/typography' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, py 70, gap 48
 * Desktop : px 60, py 100, gap 70
 * Glow и target декорации торчат за viewport — overflow-x: clip.
 * ============================================================ */
.home-vacancies {
  position: relative;
  background-color: var(--color-bg-page);
  @include section-padding-default;
  overflow-x: clip;
}

/* ============================================================
 * Glow — pink radial декорация в правом верхнем углу,
 * повёрнута на 90deg (по Figma: rotate 90 у Group).
 * Mobile  : right -278.26, top -72.9, w 598.264, h 797.36
 * Desktop : left 925, top -67, w 989.282, h 742.264
 *           (на Figma viewport 1440 = right -(989.282 + 67 - 1440 + 925)? нет;
 *            проще: right = 1440 - 925 - 989.282 = -474.282)
 *           = right -474.28, top -67, w 989.28, h 742.26
 * ============================================================ */
.home-vacancies__glow {
  position: absolute;
  top: to-rem(-72.9);
  right: to-rem(-278.26);
  width: to-rem(598.264);
  height: to-rem(797.36);
  pointer-events: none;
  user-select: none;
  z-index: 0;
  transform: rotate(90deg);

  @include mq($from: tablet) {
    top: to-rem(-67);
    right: to-rem(-474.28);
    width: to-rem(989.282);
    height: to-rem(742.264);
  }
}

/* ============================================================
 * Target (dartboard) — 200x200, только desktop.
 * Figma: top 122, right 44 (от viewport).
 * ============================================================ */
.home-vacancies__target {
  display: none;

  @include mq($from: tablet) {
    display: block;
    position: absolute;
    top: to-rem(122);
    right: to-rem(44);
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
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(48);

  @include mq($from: tablet) {
    gap: to-rem(70);
  }
}

/* ============================================================
 * Title — H4 36/40 mobile, H3 56/64 desktop, центр.
 * ============================================================ */
.home-vacancies__title {
  @include font-section-title;
}

/* ============================================================
 * Content — ограничение 1200 (по Figma desktop), центрировано.
 * Под ним: список карточек + кнопка View All.
 * ============================================================ */
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

/* ============================================================
 * Cards — 1 col; ≥ mobile две колонки; ≥ tablet три.
 * ============================================================ */
.home-vacancies__cards {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: to-rem(16);

  @include mq($from: mobile) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
}

.home-vacancies__head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  width: 100%;
}

/* ============================================================
 * Badge "Remote" — pill, bg-subtle, padding 12/8
 * Caption Medium 14/16
 * ============================================================ */
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

/* ============================================================
 * Job title — H4 24/32 mobile, H4 32/40 desktop
 * ============================================================ */
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

/* ============================================================
 * Description — Body 2 Regular 16/24
 * ============================================================ */
.home-vacancies__desc {
  margin: 0;
  width: 100%;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

/* ============================================================
 * Learn More link — Body 1 SemiBold 18/24
 * Default : accent (pink), Hover: white (текст + стрелка через currentColor)
 * ============================================================ */
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

/* ============================================================
 * View All button — secondary (white), Large
 * ============================================================ */
.home-vacancies__cta {
  align-self: center;
}
</style>
