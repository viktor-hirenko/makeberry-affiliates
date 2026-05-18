<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useHomeHero } from '@/composables/useContent'

const hero = useHomeHero()
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

function scrollToHero(): void {
  const target = document.getElementById('hero')
  if (!target) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
}

onMounted(() => {
  const heroSection = document.getElementById('hero')
  if (!heroSection) return

  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = !entry.isIntersecting
    },
    { threshold: 0 },
  )
  observer.observe(heroSection)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="home-scroll-to-top-fade">
      <button
        v-if="isVisible"
        type="button"
        class="home-scroll-to-top"
        :aria-label="hero.scrollToTop.label"
        @click="scrollToHero"
      >
        <BaseIcon
          :name="hero.scrollToTop.icon"
          :size="48"
          class="home-scroll-to-top__icon"
          aria-hidden="true"
        />
      </button>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* Размеры и стили — как у .home-hero__scroll-button в HomeHero.vue */
.home-scroll-to-top {
  position: fixed;
  right: var(--container-pad-x);
  bottom: to-rem(24);
  z-index: var(--z-header);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: to-rem(16);
  width: to-rem(56);
  height: to-rem(56);
  background: transparent;
  border: 2px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  color: var(--color-icon-primary);
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    opacity var(--transition-base),
    transform var(--transition-base);

  &:hover,
  &:active {
    background-color: var(--color-bg-brand-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  @include mq($from: mobile) {
    bottom: to-rem(32);
    padding: to-rem(16);
    width: to-rem(80);
    height: to-rem(80);
    border-width: 3px;
  }
}

.home-scroll-to-top__icon {
  width: to-rem(24);
  height: to-rem(24);
  /* arrow-down-left (↙) → rotate 135° → straight up (↑) */
  transform: rotate(135deg);

  @include mq($from: mobile) {
    width: to-rem(48);
    height: to-rem(48);
  }
}

.home-scroll-to-top-fade-enter-active,
.home-scroll-to-top-fade-leave-active {
  transition:
    opacity var(--transition-base),
    transform var(--transition-base);
}

.home-scroll-to-top-fade-enter-from,
.home-scroll-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(to-rem(8));
}
</style>
