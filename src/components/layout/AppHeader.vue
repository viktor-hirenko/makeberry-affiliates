<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseLogo from '@/components/ui/BaseLogo.vue'
import IconButton from '@/components/ui/IconButton.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import { useNav, useSharedUi } from '@/composables/useContent'
import { BREAKPOINT_TABLET_PX, BREAKPOINT_WIDE_PX } from '@/constants/breakpoints'
import type { NavLink } from '@/types/content'

const nav = useNav()
const ui = useSharedUi()
const route = useRoute()

/** Совпадает с `$breakpoints.tablet` / `@include mq($from: tablet)` — горизонтальная навигация в pill. */
const isTabletOrWider = useMediaQuery(`(min-width: ${BREAKPOINT_TABLET_PX}px)`)

/** Полный вордмарк «Makeberry» в SVG; до этого порога — только mark (шире места под ссылки 1024–1279). */
const isWideOrWider = useMediaQuery(`(min-width: ${BREAKPOINT_WIDE_PX}px)`)

/** Компактный бар + drawer при ширине < 1024; pill с навигацией от 1024. */
const isCompactBar = computed(() => !isTabletOrWider.value)
const showDesktopNav = computed(() => isTabletOrWider.value)
const logoVariant = computed<'full' | 'mark'>(() =>
  isWideOrWider.value ? 'full' : 'mark'
)

const openDropdown = ref<string | null>(null)
const mobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

onClickOutside(headerRef, () => {
  openDropdown.value = null
})

watch(
  () => route.fullPath,
  () => {
    openDropdown.value = null
    mobileMenuOpen.value = false
  }
)

function isLinkActive(link: NavLink): boolean {
  if (link.path) {
    if (link.path === '/') {
      return route.path === '/' && !route.hash
    }
    if (link.path.startsWith('/#')) {
      return route.path === '/' && route.hash === link.path.slice(1)
    }
    return route.path === link.path || route.path.startsWith(`${link.path}/`)
  }
  if (link.children?.length) {
    return link.children.some(child => route.path.startsWith(child.path))
  }
  return false
}

function toggleDropdown(label: string) {
  openDropdown.value = openDropdown.value === label ? null : label
}

function closeDropdown() {
  openDropdown.value = null
}

function openMobileMenu() {
  mobileMenuOpen.value = true
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header ref="headerRef" class="app-header" :class="{ 'app-header--mobile': isCompactBar }">
    <div v-if="showDesktopNav" class="app-header__pill">
      <RouterLink to="/" class="app-header__logo" :aria-label="nav.logoAlt" @click="closeDropdown">
        <BaseLogo :variant="logoVariant" :aria-label="nav.logoAlt" :height="40" />
      </RouterLink>

      <nav class="app-header__nav" :aria-label="ui.aria.navMain">
        <ul class="app-header__list">
          <li
            v-for="link in nav.links"
            :key="link.label"
            class="app-header__item"
            :class="{ 'app-header__item--has-menu': link.children?.length }"
          >
            <button
              v-if="link.children?.length"
              type="button"
              class="app-header__trigger"
              :class="{
                'is-expanded': openDropdown === link.label,
                'is-current': isLinkActive(link),
              }"
              :aria-expanded="openDropdown === link.label"
              :aria-haspopup="true"
              @click="toggleDropdown(link.label)"
            >
              <span>{{ link.label }}</span>
              <BaseIcon name="chevron-down-solid" :size="24" />
            </button>
            <RouterLink
              v-else-if="link.path"
              :to="link.path"
              class="app-header__link"
              :class="{ 'is-current': isLinkActive(link) }"
              @click="closeDropdown"
            >
              {{ link.label }}
            </RouterLink>

            <Transition name="dropdown">
              <div
                v-if="link.children?.length && openDropdown === link.label"
                class="app-header__dropdown"
              >
                <RouterLink
                  v-for="child in link.children"
                  :key="child.label"
                  :to="child.path"
                  class="app-header__dropdown-link"
                  @click="closeDropdown"
                >
                  {{ child.label }}
                </RouterLink>
              </div>
            </Transition>
          </li>
        </ul>
      </nav>

      <div class="app-header__actions">
        <BaseButton variant="secondary" size="small" :to="nav.ctaPath">
          {{ nav.ctaLabel }}
        </BaseButton>
      </div>
    </div>

    <div v-else class="app-header__bar">
      <RouterLink to="/" class="app-header__logo" :aria-label="nav.logoAlt">
        <BaseLogo variant="mark" :aria-label="nav.logoAlt" :height="40" />
      </RouterLink>

      <div class="app-header__actions">
        <BaseButton variant="secondary" size="small" :to="nav.ctaPath">
          {{ nav.ctaLabel }}
        </BaseButton>
        <IconButton
          icon="menu"
          :label="ui.aria.openMenu"
          :size="24"
          variant="ghost"
          @click="openMobileMenu"
        />
      </div>
    </div>

    <MobileMenu :open="mobileMenuOpen" :nav="nav" @close="closeMobileMenu" />
  </header>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.app-header {
  position: fixed;
  top: var(--header-pill-offset);
  left: 0;
  right: 0;
  z-index: var(--z-header);
  display: flex;
  justify-content: center;
  pointer-events: none;
  padding-inline: var(--header-pill-inset);
}

.app-header--mobile {
  top: 0;
  padding-inline: 0;
  /*
   * Фиксированный header участвует в расширении scrollable overflow страницы.
   * Если строка бара (лого + CTA + меню) шире viewport — без clip появляется
   * горизонтальный скролл у документа (не из‑за «логики трёх состояний» как таковой).
   */
  overflow-x: clip;
}

.app-header__pill,
.app-header__bar {
  pointer-events: auto;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--header-pill-height);
}

.app-header__pill {
  position: relative;
  max-width: calc(var(--container-max) - var(--header-pill-inset) * 2);
  padding: to-rem(16);
  gap: to-rem(16);
  background-color: var(--color-bg-overlay-header);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-pill);
  backdrop-filter: blur(12.5px);
  -webkit-backdrop-filter: blur(12.5px);
}

.app-header__bar {
  height: var(--header-mobile-height);
  padding: to-rem(16);
  box-sizing: border-box;
  min-width: 0;
  overflow-x: clip;
  background-color: var(--color-bg-overlay-header);
  backdrop-filter: blur(12.5px);
  -webkit-backdrop-filter: blur(12.5px);
}

.app-header__logo {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
}

.app-header__nav {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.app-header__list {
  display: flex;
  align-items: center;
  gap: to-rem(8);
}

.app-header__item {
  position: relative;
}

.app-header__trigger,
.app-header__link {
  @include font-body-s-medium;
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: to-rem(40);
  padding: to-rem(8);
  border: 0;
  background: transparent;
  color: var(--color-text-link);
  cursor: pointer;
  text-decoration: none;
  border-radius: var(--radius-pill);
  white-space: nowrap;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  > span {
    padding-inline: to-rem(8);
    white-space: nowrap;
  }

  /* Hover и текущий маршрут — только цвет текста, без подложки. */
  &:hover,
  &:focus-visible,
  &.is-current {
    color: var(--color-text-primary);
  }

  /* Раскрытый dropdown — pill-подложка bg-subtle (по Figma `Type=*expanded`). */
  &.is-expanded {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-primary);
  }
}

.app-header__trigger {
  font-family: inherit;

  /* Стрелка chevron — поворот на 180° в открытом состоянии. */
  :deep(.base-icon) {
    transition: transform var(--transition-base);
  }

  &.is-expanded :deep(.base-icon) {
    transform: rotate(180deg);
  }
}

.app-header__dropdown {
  position: absolute;
  top: calc(100% + #{to-rem(8)});
  left: 50%;
  transform: translateX(-50%);
  min-width: to-rem(185);
  padding: to-rem(16);
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  background-color: var(--color-bg-overlay-header);
  border: 1px solid var(--color-border-subtle);
  border-radius: to-rem(20);
  backdrop-filter: blur(12.5px);
  -webkit-backdrop-filter: blur(12.5px);
}

.app-header__dropdown-link {
  @include font-body-s-regular;
  display: block;
  color: var(--color-text-tertiary);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--transition-base);

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: to-rem(16);
  flex-shrink: 0;
}

.app-header--mobile .app-header__actions {
  margin-left: auto;
  min-width: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translate(-50%, #{to-rem(-6)});
}
</style>
