<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseLogo from '@/components/ui/BaseLogo.vue'
import { classifyLinkType, useAnalytics } from '@/composables/useAnalytics'
import { useFooter, useNav, useSharedUi } from '@/composables/useContent'

const nav = useNav()
const footer = useFooter()
const ui = useSharedUi()

const { trackCtaClick } = useAnalytics()

/** Explore | (Solutions + Direct Advertiser) | Partners | Awards — как в макете. */
const STACKED_TITLES = new Set(['Solutions', 'Direct Advertiser'])

const exploreColumn = computed(() => footer.columns.find((c) => c.title === 'Explore'))
const stackedColumns = computed(() => footer.columns.filter((c) => STACKED_TITLES.has(c.title)))
const sideColumns = computed(() =>
  footer.columns.filter((c) => c.title !== 'Explore' && !STACKED_TITLES.has(c.title)),
)

function trackFooterLink(label: string, href: string | undefined, location: string): void {
  if (!href) return
  trackCtaClick({
    cta_location: location,
    cta_label: label,
    link_url: href,
    link_type: classifyLinkType(href),
    target_domain: href.startsWith('http') ? tryGetHostname(href) : undefined,
  })
}

function tryGetHostname(url: string): string | undefined {
  try {
    return new URL(url).hostname
  } catch {
    return undefined
  }
}

function isProtocolLink(href: string): boolean {
  return /^(mailto:|tel:)/i.test(href)
}
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <div class="app-footer__inner">
      <div class="app-footer__header">
        <div class="app-footer__brand">
          <RouterLink to="/" class="app-footer__logo" :aria-label="nav.logoAlt">
            <BaseLogo variant="full" :aria-label="nav.logoAlt" :height="40" />
          </RouterLink>

          <ul class="app-footer__social" :aria-label="ui.aria.socialLinks">
            <li v-for="social in footer.social" :key="social.network">
              <a
                :href="social.href"
                class="app-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="social.label"
                @click="trackFooterLink(social.label, social.href, 'footer_social')"
              >
                <BaseIcon :name="social.network" :size="24" />
              </a>
            </li>
          </ul>
        </div>

        <nav class="app-footer__nav" :aria-label="ui.aria.navFooter">
          <div v-if="exploreColumn" class="app-footer__column">
            <h3 class="app-footer__column-title">{{ exploreColumn.title }}</h3>
            <ul class="app-footer__column-list">
              <li v-for="link in exploreColumn.links" :key="link.label">
                <RouterLink
                  v-if="link.path"
                  :to="link.path"
                  class="app-footer__column-link"
                  @click="trackFooterLink(link.label, link.path, 'footer_nav')"
                >
                  {{ link.label }}
                </RouterLink>
                <a
                  v-else-if="link.href"
                  :href="link.href"
                  class="app-footer__column-link"
                  :target="isProtocolLink(link.href) ? undefined : '_blank'"
                  :rel="isProtocolLink(link.href) ? undefined : 'noopener noreferrer'"
                  @click="trackFooterLink(link.label, link.href, 'footer_nav')"
                >
                  {{ link.label }}
                </a>
                <span v-else class="app-footer__column-text">{{ link.label }}</span>
              </li>
            </ul>
          </div>

          <div v-if="stackedColumns.length" class="app-footer__column-stack">
            <div
              v-for="column in stackedColumns"
              :key="column.title"
              class="app-footer__column"
            >
              <h3 class="app-footer__column-title">{{ column.title }}</h3>
              <ul class="app-footer__column-list">
                <li v-for="link in column.links" :key="link.label">
                  <RouterLink
                    v-if="link.path"
                    :to="link.path"
                    class="app-footer__column-link"
                    @click="trackFooterLink(link.label, link.path, 'footer_nav')"
                  >
                    {{ link.label }}
                  </RouterLink>
                  <a
                    v-else-if="link.href"
                    :href="link.href"
                    class="app-footer__column-link"
                    :target="isProtocolLink(link.href) ? undefined : '_blank'"
                    :rel="isProtocolLink(link.href) ? undefined : 'noopener noreferrer'"
                    @click="trackFooterLink(link.label, link.href, 'footer_nav')"
                  >
                    {{ link.label }}
                  </a>
                  <span v-else class="app-footer__column-text">{{ link.label }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            v-for="column in sideColumns"
            :key="column.title"
            class="app-footer__column"
          >
            <h3 class="app-footer__column-title">{{ column.title }}</h3>
            <ul class="app-footer__column-list">
              <li v-for="link in column.links" :key="link.label">
                <RouterLink
                  v-if="link.path"
                  :to="link.path"
                  class="app-footer__column-link"
                  @click="trackFooterLink(link.label, link.path, 'footer_nav')"
                >
                  {{ link.label }}
                </RouterLink>
                <a
                  v-else-if="link.href"
                  :href="link.href"
                  class="app-footer__column-link"
                  :target="isProtocolLink(link.href) ? undefined : '_blank'"
                  :rel="isProtocolLink(link.href) ? undefined : 'noopener noreferrer'"
                  @click="trackFooterLink(link.label, link.href, 'footer_nav')"
                >
                  {{ link.label }}
                </a>
                <span v-else class="app-footer__column-text">{{ link.label }}</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="app-footer__bottom">
        <template v-for="(link, index) in footer.bottomLinks" :key="link.label">
          <a v-if="link.href" :href="link.href" class="app-footer__bottom-link">
            {{ link.label }}
          </a>
          <RouterLink v-else :to="link.path ?? '/'" class="app-footer__bottom-link">
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
@use '@/assets/styles/scss/mixins' as *;

.app-footer {
  z-index: 1;
  background-color: var(--color-bg-surface);
  overflow-x: clip;

  @include section-padding(
    $desktop-inline: to-rem(100),
    $desktop-top: to-rem(80),
    $desktop-bottom: to-rem(40),
    $mobile-bottom: to-rem(16)
  );
}

.app-footer__inner {
  display: flex;
  flex-direction: column;
  gap: to-rem(60);
  @include container(to-rem(1240));

  @include mq($from: tablet) {
    gap: to-rem(100);
  }
}

.app-footer__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(60);

  @include mq($from: mobile) {
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

/* Explore | Solutions+DA stack | Partners | Awards */
.app-footer__nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(48);
  width: 100%;

  @include mq($from: compact) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: to-rem(32);
  }

  @include mq($from: tablet) {
    flex-wrap: nowrap;
    gap: to-rem(48);
    width: auto;
  }

  @include mq($from: desktop) {
    gap: to-rem(64);
  }
}

.app-footer__column-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(48);
}

.app-footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: to-rem(16);
  width: auto;

  @include mq($from: desktop) {
    width: to-rem(165);
  }
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
  gap: to-rem(8);
  width: 100%;
}

.app-footer__column-link,
.app-footer__column-text {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(16);
  line-height: to-rem(24);
  letter-spacing: -0.01em;
  color: var(--color-text-tertiary);
}

.app-footer__column-link {
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
