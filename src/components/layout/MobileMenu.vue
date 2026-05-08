<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseLogo from '@/components/ui/BaseLogo.vue'
import IconButton from '@/components/ui/IconButton.vue'
import { useScrollLock } from '@/composables/useScrollLock'
import type { NavConfig, NavLink } from '@/types/content'

interface MobileMenuProps {
  open: boolean
  nav: NavConfig
}

const props = defineProps<MobileMenuProps>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const expanded = ref<string | null>(null)

useScrollLock(toRef(props, 'open'))

function findActiveParent(): string | null {
  for (const link of props.nav.links) {
    if (link.children?.some((child) => route.path.startsWith(child.path))) {
      return link.label
    }
  }
  return null
}

watch(
  () => props.open,
  (open) => {
    if (open) expanded.value = findActiveParent()
  },
  { immediate: true },
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
      aria-label="Site navigation"
    >
      <div class="mobile-menu__top">
        <RouterLink to="/" class="mobile-menu__logo" :aria-label="nav.logoAlt" @click="handleClose">
          <BaseLogo variant="full" :aria-label="nav.logoAlt" :height="40" />
        </RouterLink>
        <IconButton icon="x" label="Close menu" :size="40" @click="handleClose" />
      </div>

      <nav class="mobile-menu__nav" aria-label="Mobile">
        <ul class="mobile-menu__list">
          <li v-for="link in nav.links" :key="link.label" class="mobile-menu__item">
            <button
              v-if="link.children?.length"
              type="button"
              class="mobile-menu__row mobile-menu__row--toggle"
              :class="{ 'is-active': isParentExpanded(link) }"
              :aria-expanded="isParentExpanded(link)"
              @click="toggleSection(link.label)"
            >
              <span>{{ link.label }}</span>
              <BaseIcon name="chevron-down" :size="24" />
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
              <ul v-if="isParentExpanded(link)" class="mobile-menu__sublist">
                <li v-for="child in link.children" :key="child.label">
                  <RouterLink
                    :to="child.path"
                    class="mobile-menu__sublink"
                    :class="{ 'is-active': isChildActive(child.path) }"
                    @click="handleClose"
                  >
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>

      <div class="mobile-menu__footer">
        <BaseButton variant="secondary" size="large" :to="ctaPath" @click="handleClose">
          {{ ctaLabel }}
        </BaseButton>
      </div>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/typography' as *;

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-overlay-menu);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  padding: 16px 16px 40px;
  overflow-y: auto;
  pointer-events: auto;
}

.mobile-menu__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 16px;
}

.mobile-menu__logo {
  display: inline-flex;
  align-items: center;
}

.mobile-menu__nav {
  flex: 1;
  padding: 16px;
}

.mobile-menu__list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.mobile-menu__item {
  display: flex;
  flex-direction: column;
}

.mobile-menu__row {
  @include font-headline-h5;
  display: flex;
  align-items: center;
  gap: 8px;
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

.mobile-menu__row--toggle .base-icon {
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.mobile-menu__row--toggle.is-active .base-icon {
  transform: rotate(180deg);
}

.mobile-menu__dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-text-accent);
  flex-shrink: 0;
}

.mobile-menu__sublist {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 16px 0;
}

.mobile-menu__sublink {
  @include font-body-s-regular;
  display: block;
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-base);

  &:hover,
  &:focus-visible,
  &.is-active {
    color: var(--color-text-primary);
  }
}

.mobile-menu__footer {
  margin-top: 40px;
  display: flex;

  .base-button {
    width: 100%;
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

.accordion-enter-active,
.accordion-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
