<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseLogo from '@/components/ui/BaseLogo.vue'
import { useFooter, useNav } from '@/composables/useContent'

const nav = useNav()
const footer = useFooter()
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <div class="app-footer__inner">
      <!-- Header: logo + social vs nav columns -->
      <div class="app-footer__header">
        <div class="app-footer__brand">
          <RouterLink to="/" class="app-footer__logo" :aria-label="nav.logoAlt">
            <BaseLogo variant="full" :aria-label="nav.logoAlt" :height="40" />
          </RouterLink>

          <ul class="app-footer__social" aria-label="Social links">
            <li v-for="social in footer.social" :key="social.network">
              <a
                :href="social.href"
                class="app-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="social.label"
              >
                <BaseIcon :name="social.network" :size="24" />
              </a>
            </li>
          </ul>
        </div>

        <nav class="app-footer__nav" aria-label="Footer">
          <div v-for="column in footer.columns" :key="column.title" class="app-footer__column">
            <h3 class="app-footer__column-title">{{ column.title }}</h3>
            <ul class="app-footer__column-list">
              <li v-for="link in column.links" :key="link.label">
                <RouterLink :to="link.path" class="app-footer__column-link">
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Partners and Awards -->
      <div class="app-footer__pa">
        <section class="app-footer__partners" :aria-label="footer.partners.label">
          <span class="app-footer__badge app-footer__badge--partners">
            {{ footer.partners.label }}
          </span>
          <ul class="app-footer__partner-list">
            <li
              v-for="partner in footer.partners.items"
              :key="partner.id"
              class="app-footer__partner"
            >
              <component
                :is="partner.href ? 'a' : 'div'"
                v-bind="
                  partner.href
                    ? {
                        href: partner.href,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        'aria-label': partner.name,
                      }
                    : {}
                "
                class="app-footer__partner-link"
              >
                <img
                  :src="partner.src"
                  :alt="partner.alt"
                  :width="partner.width"
                  :height="partner.height"
                  class="app-footer__partner-img"
                  :class="{ 'is-rounded': partner.rounded }"
                  :style="{
                    '--partner-w': partner.width + 'px',
                    '--partner-h': partner.height + 'px',
                    '--partner-w-mobile': partner.mobileWidth + 'px',
                    '--partner-h-mobile': partner.mobileHeight + 'px',
                  }"
                  loading="lazy"
                  decoding="async"
                />
              </component>
            </li>
          </ul>
        </section>

        <section class="app-footer__awards" :aria-label="footer.awards.label">
          <span class="app-footer__badge app-footer__badge--awards">
            {{ footer.awards.label }}
          </span>
          <ul class="app-footer__award-list">
            <li v-for="award in footer.awards.items" :key="award.id" class="app-footer__award">
              <img
                :src="award.src"
                :alt="award.alt"
                :width="award.width"
                :height="award.height"
                class="app-footer__award-img"
                :style="{
                  '--award-w': award.width + 'px',
                  '--award-h': award.height + 'px',
                  '--award-w-mobile': award.mobileWidth + 'px',
                  '--award-h-mobile': award.mobileHeight + 'px',
                }"
                loading="lazy"
                decoding="async"
              />
            </li>
          </ul>
        </section>
      </div>

      <!-- Bottom: legal + copyright -->
      <div class="app-footer__bottom">
        <template v-for="(link, index) in footer.bottomLinks" :key="link.label">
          <RouterLink :to="link.path" class="app-footer__bottom-link">
            {{ link.label }}
          </RouterLink>
          <span
            v-if="index < footer.bottomLinks.length - 1 || footer.copyright"
            class="app-footer__bottom-divider"
            aria-hidden="true"
          />
        </template>
        <p v-if="footer.copyright" class="app-footer__copyright">
          {{ footer.copyright }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;
@use '@/assets/styles/scss/units' as *;

/* ============================================================
 * Section
 * Mobile  : px 16, pt 70, pb 16, gap 60
 * Desktop : px 150, pt 80, pb 40, gap 100
 * ============================================================ */
.app-footer {
  background-color: var(--color-bg-surface);
  overflow-x: clip;
}

.app-footer__inner {
  width: 100%;
  max-width: to-rem(1440);
  margin-inline: auto;
  padding: to-rem(70) to-rem(16) to-rem(16);
  display: flex;
  flex-direction: column;
  gap: to-rem(60);

  @include mq($from: tablet) {
    padding: to-rem(80) to-rem(150) to-rem(40);
    gap: to-rem(100);
  }
}

/* ============================================================
 * Header (logo+social  +  nav columns)
 * Mobile : column, gap 60
 * Desktop: row, justify space-between
 * ============================================================ */
.app-footer__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(60);

  @include mq($from: tablet) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: to-rem(48);
  }
}

.app-footer__brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(32);
}

.app-footer__logo {
  display: inline-flex;
  align-items: center;

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 4px;
    border-radius: 4px;
  }
}

/* Social: 5 круглых иконок, gap 8, bg-subtle, p 8, icon 24 */
.app-footer__social {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: to-rem(8);
}

.app-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8);
  border-radius: var(--radius-pill);
  background-color: var(--color-bg-subtle);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: background-color var(--transition-base);

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-brand-soft, rgba(255, 1, 128, 0.16));
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}

/* ============================================================
 * Nav columns
 * Mobile : column gap 48
 * Desktop: row gap 50, каждая колонка 200
 * ============================================================ */
.app-footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(48);

  @include mq($from: mobile) {
    flex-direction: row;
    gap: to-rem(50);
  }
}

.app-footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(24);
  width: to-rem(200);
}

.app-footer__column-title {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(18);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-transform: none;
}

.app-footer__column-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(12);
}

.app-footer__column-link {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-base);

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
    border-radius: 2px;
  }
}

/* ============================================================
 * Partners + Awards
 * Mobile : column, gap 48
 * Desktop: row, justify center, gap 120
 * ============================================================ */
.app-footer__pa {
  display: flex;
  align-items: stretch;
  gap: to-rem(48);

  @include mq($from: tablet) {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: to-rem(120);
  }
}

/* Badge -- общий стиль для Partners/Awards.
 * bg-surface (#141414), 2px brand pink border, padding 16/8, radius pill,
 * text Body 1 SemiBold 18/24 white. На desktop badge абсолютно позиционирован
 * рядом с логотипами (см. modifier'ы ниже). */
.app-footer__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(16);
  background-color: var(--color-bg-surface);
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: to-rem(18);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
  text-align: center;
  white-space: nowrap;
}

/* Partners section */
.app-footer__partners {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(20);
}

.app-footer__partner-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: to-rem(20);

  @include mq($from: tablet) {
    flex-wrap: nowrap;
    gap: to-rem(32);
  }
}

.app-footer__partner-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity var(--transition-base);

  &:hover,
  &:focus-visible {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 4px;
    border-radius: 4px;
  }
}

.app-footer__partner-img {
  display: block;
  width: var(--partner-w-mobile);
  height: var(--partner-h-mobile);
  object-fit: contain;
  object-position: left center;

  @include mq($from: tablet) {
    width: var(--partner-w);
    height: var(--partner-h);
  }

  &.is-rounded {
    border-radius: to-rem(10);
    object-fit: cover;
  }
}

/* Awards section */
.app-footer__awards {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(20);
}

.app-footer__award-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: to-rem(16);
}

.app-footer__award-img {
  display: block;
  width: var(--award-w-mobile);
  height: var(--award-h-mobile);
  object-fit: contain;
  object-position: left bottom;

  @include mq($from: tablet) {
    width: var(--award-w);
    height: var(--award-h);
  }
}

/* Desktop-only: badge накладывается поверх логотипов с поворотом.
 * По Figma: Partners — left -54.63, top -40, rotate -7.6°
 *           Awards   — right -50.99, top -38, rotate 8.82°  */
@include mq($from: tablet) {
  .app-footer__badge--partners,
  .app-footer__badge--awards {
    position: absolute;
    z-index: 1;
  }

  .app-footer__badge--partners {
    left: to-rem(-54.63);
    top: to-rem(-40);
    transform: rotate(-7.6deg);
  }

  .app-footer__badge--awards {
    right: to-rem(-50.99);
    top: to-rem(-38);
    transform: rotate(8.82deg);
  }
}

/* ============================================================
 * Bottom row
 * Mobile : wrap, gap 16, align-start
 * Desktop: gap 24, align center, justify center
 * ============================================================ */
.app-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: to-rem(16);

  @include mq($from: mobile) {
    justify-content: center;
    gap: to-rem(24);
  }
}

.app-footer__bottom-link,
.app-footer__copyright {
  margin: 0;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(14);
  line-height: to-rem(16);
  letter-spacing: -0.01em;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

.app-footer__bottom-link {
  text-decoration: none;
  transition: color var(--transition-base);

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }
}

/* Вертикальный разделитель 1×16 между bottom элементами.
 * На mobile показываем только разделители между ссылками (не перед copyright),
 * чтобы повторить wrap-разметку Figma. */
.app-footer__bottom-divider {
  flex: none;
  display: inline-block;
  width: 1px;
  height: to-rem(16);
  background-color: var(--color-border-default);
}

@include mq($until: tablet) {
  .app-footer__bottom-divider:last-of-type {
    display: none;
  }
}
</style>
