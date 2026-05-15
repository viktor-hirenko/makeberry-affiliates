<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseLogo from '@/components/ui/BaseLogo.vue'
import IconButton from '@/components/ui/IconButton.vue'
import { useScrollLock } from '@/composables/useScrollLock'
import { useSharedUi } from '@/composables/useContent'
import type { NavConfig, NavLink } from '@/types/content'

interface MobileMenuProps {
  open: boolean
  nav: NavConfig
}

const props = defineProps<MobileMenuProps>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const expanded = ref<string | null>(null)
const ui = useSharedUi()

useScrollLock(toRef(props, 'open'))

function findActiveParent(): string | null {
  for (const link of props.nav.links) {
    if (link.children?.some(child => route.path.startsWith(child.path))) {
      return link.label
    }
  }
  return null
}

watch(
  () => props.open,
  open => {
    if (open) expanded.value = findActiveParent()
  },
  { immediate: true }
)

function isParentExpanded(link: NavLink): boolean {
  return Boolean(link.children?.length) && expanded.value === link.label
}

function toggleSection(label: string) {
  expanded.value = expanded.value === label ? null : label
}

function isLeafActive(link: NavLink): boolean {
  if (!link.path) return false
  if (link.path === '/') return route.path === '/' && !route.hash
  if (link.path.startsWith('/#')) return route.path === '/' && route.hash === link.path.slice(1)
  return route.path === link.path || route.path.startsWith(`${link.path}/`)
}

function isChildActive(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function handleClose() {
  emit('close')
}

const ctaLabel = computed(() => props.nav.ctaLabel)
const ctaPath = computed(() => props.nav.ctaPath)
</script>

<template>
  <Transition name="drawer">
    <aside
      v-if="open"
      class="mobile-menu"
      role="dialog"
      aria-modal="true"
      :aria-label="ui.aria.navSite"
    >
      <div class="mobile-menu__top">
        <RouterLink to="/" class="mobile-menu__logo" :aria-label="nav.logoAlt" @click="handleClose">
          <BaseLogo variant="full" :aria-label="nav.logoAlt" :height="40" />
        </RouterLink>
        <IconButton
          icon="x"
          :label="ui.aria.closeMenu"
          :size="24"
          variant="ghost"
          @click="handleClose"
        />
      </div>

      <nav class="mobile-menu__nav" :aria-label="ui.aria.navMobile">
        <ul class="mobile-menu__list">
          <li v-for="link in nav.links" :key="link.label" class="mobile-menu__item">
            <button
              v-if="link.children?.length"
              type="button"
              class="mobile-menu__row mobile-menu__row--toggle"
              :class="{ 'is-expanded': isParentExpanded(link) }"
              :aria-expanded="isParentExpanded(link)"
              @click="toggleSection(link.label)"
            >
              <span>{{ link.label }}</span>
              <BaseIcon name="chevron-down-solid" :size="24" />
            </button>
            <RouterLink
              v-else-if="link.path"
              :to="link.path"
              class="mobile-menu__row"
              :class="{ 'is-active': isLeafActive(link) }"
              @click="handleClose"
            >
              <span>{{ link.label }}</span>
              <span v-if="isLeafActive(link)" class="mobile-menu__dot" aria-hidden="true" />
            </RouterLink>

            <Transition name="accordion">
              <div v-if="isParentExpanded(link)" class="mobile-menu__accordion">
                <div class="mobile-menu__accordion-inner">
                  <ul class="mobile-menu__sublist">
                    <li v-for="child in link.children" :key="child.label">
                      <RouterLink
                        :to="child.path"
                        class="mobile-menu__sublink"
                        :class="{ 'is-active': isChildActive(child.path) }"
                        @click="handleClose"
                      >
                        <span>{{ child.label }}</span>
                        <span
                          v-if="isChildActive(child.path)"
                          class="mobile-menu__dot"
                          aria-hidden="true"
                        />
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </div>
            </Transition>
          </li>
        </ul>
      </nav>

      <div v-if="nav.ctaEnabled !== false" class="mobile-menu__footer">
        <BaseButton variant="secondary" size="large" :to="ctaPath" @click="handleClose">
          {{ ctaLabel }}
        </BaseButton>
      </div>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-overlay-menu);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  padding: to-rem(16) to-rem(16) to-rem(40);
  overflow-y: auto;
  pointer-events: auto;
}

.mobile-menu__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: to-rem(40);
  margin-bottom: to-rem(16);
}

.mobile-menu__logo {
  display: inline-flex;
  align-items: center;
}

.mobile-menu__nav {
  flex: 1;
  padding: to-rem(16);
}

.mobile-menu__list {
  display: flex;
  flex-direction: column;
  gap: to-rem(32);
}

.mobile-menu__item {
  display: flex;
  flex-direction: column;
}

.mobile-menu__row {
  @include font-headline-h5;
  display: flex;
  align-items: center;
  gap: to-rem(8);
  width: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--color-text-primary);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  transition: color var(--transition-base);

  > span:first-child {
    flex: 1 0 0;
    min-width: 0;
  }

  &.is-active {
    color: var(--color-text-accent);
  }
}

.mobile-menu__row--toggle {
  /* Стрелка chevron — поворот на 180° в открытом состоянии (как в AppHeader). */
  :deep(.base-icon) {
    flex-shrink: 0;
    color: var(--color-text-primary);
    transition: transform var(--transition-base);
  }

  &.is-expanded :deep(.base-icon) {
    transform: rotate(180deg);
  }
}

.mobile-menu__dot {
  display: inline-block;
  width: to-rem(6);
  height: to-rem(6);
  border-radius: 50%;
  background-color: var(--color-text-accent);
  flex-shrink: 0;
}

/*
 * Inner wrapper sits between the grid container (.accordion) and the
 * actual list. It must collapse to zero — so it has no padding, only
 * min-height: 0 and overflow: hidden. Padding lives on the <ul> below,
 * which keeps spacing identical to before.
 */
.mobile-menu__accordion-inner {
  min-height: 0;
  overflow: hidden;
}

.mobile-menu__sublist {
  display: flex;
  flex-direction: column;
  gap: to-rem(16);
  padding: to-rem(24) to-rem(16) 0;
}

.mobile-menu__sublink {
  @include font-body-s-regular;
  display: flex;
  align-items: center;
  gap: to-rem(8);
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-base);

  > span:first-child {
    flex: 1 0 0;
    min-width: 0;
  }

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }

  &.is-active {
    color: var(--color-text-accent);
  }
}

.mobile-menu__footer {
  display: flex;
  margin-top: to-rem(40);
  justify-content: center;

  .base-button {
    width: 100%;

    @include mq($from: mobile) {
      width: auto;
    }
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/*
 * Grid-rows height animation — the only technique that collapses
 * height smoothly without JS measuring. The wrapper <div> is the
 * grid container; the inner <ul> needs min-height:0 to allow
 * collapse below its natural content height.
 */
.accordion-enter-active,
.accordion-leave-active {
  display: grid;
  grid-template-rows: 1fr;
  overflow: hidden;
  transition:
    grid-template-rows 0.2s ease,
    opacity 0.2s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}
</style>
