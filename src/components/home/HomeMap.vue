<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useHomeMap } from '@/composables/useContent'
import type { HomeMapCountry, HomeMapTab } from '@/types/content'

const content = useHomeMap()

/**
 * Cache-buster: bump при каждом запуске scripts/inject-country-ids.mjs,
 * чтобы браузер не отдавал старый SVG без id-атрибутов на странах.
 */
const MAP_SVG_URL = '/images/home/map/world-map.svg?v=ids-2'

const activeTab = ref<HomeMapTab['id']>('all')
const hoveredCode = ref<string | null>(null)

const mapHost = ref<HTMLDivElement | null>(null)
const mapSvg = ref<string>('')
const isMapLoading = ref<boolean>(true)
const hasMapError = ref<boolean>(false)

const tooltip = ref<{ x: number; y: number; country: HomeMapCountry } | null>(null)

const countriesByCode = computed<Map<string, HomeMapCountry>>(() => {
  const map = new Map<string, HomeMapCountry>()
  for (const country of content.countries) {
    map.set(country.code.toUpperCase(), country)
  }
  return map
})

/**
 * Активные ISO-коды для текущего таба.
 * `all` → все страны из конфига; `tier-X` → только подмножество.
 */
const activeCountryCodes = computed<string[]>(() => {
  if (activeTab.value === 'all') {
    return content.countries.map(country => country.code)
  }
  const tierNumber = Number(activeTab.value.split('-')[1]) as 1 | 2 | 3
  return content.countries
    .filter(country => country.tier === tierNumber)
    .map(country => country.code)
})

const activeCountries = computed(() => {
  const codeSet = new Set(activeCountryCodes.value)
  return content.countries.filter(country => codeSet.has(country.code))
})

function selectTab(tabId: HomeMapTab['id']): void {
  activeTab.value = tabId
}

function setHovered(code: string | null): void {
  hoveredCode.value = code
}

/**
 * Загружаем SVG карты как текст и вставляем inline,
 * чтобы можно было управлять fill каждой страны через CSS-классы.
 * Если у path-ов нет id-атрибута — подсветка не сработает,
 * но карта всё равно отрисуется (decorative).
 */
async function loadMap(): Promise<void> {
  isMapLoading.value = true
  hasMapError.value = false

  try {
    const response = await fetch(MAP_SVG_URL)
    if (!response.ok) {
      throw new Error(`SVG fetch failed: ${response.status}`)
    }
    let raw = await response.text()

    raw = raw.replace(
      /<svg([^>]*)>/,
      '<svg$1 class="home-map__svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="World map highlighting countries where we operate">'
    )

    mapSvg.value = raw
    await nextTick()
    applyHighlights()
  } catch (error) {
    console.error('[HomeMap] Failed to load world map SVG:', error)
    hasMapError.value = true
  } finally {
    isMapLoading.value = false
  }
}

function getSvgEl(): SVGSVGElement | null {
  return mapHost.value?.querySelector<SVGSVGElement>('svg') ?? null
}

/**
 * Помечает каждый <path> в карте классами по принадлежности к тиру
 * и текущему фильтру. Работает только если у path-ов есть `id="<ISO-2>"`.
 */
function applyHighlights(): void {
  const svgEl = getSvgEl()
  if (!svgEl) return

  const activeSet = new Set(activeCountryCodes.value.map(c => c.toUpperCase()))

  const paths = svgEl.querySelectorAll<SVGElement>('[id]')
  paths.forEach(path => {
    const id = path.getAttribute('id')?.toUpperCase()
    if (!id) return

    const country = countriesByCode.value.get(id)
    if (!country) {
      path.classList.remove('is-active', 'is-tier-1', 'is-tier-2', 'is-tier-3')
      return
    }

    path.classList.toggle('is-active', activeSet.has(id))
    path.classList.toggle('is-tier-1', country.tier === 1)
    path.classList.toggle('is-tier-2', country.tier === 2)
    path.classList.toggle('is-tier-3', country.tier === 3)
  })
}

/**
 * Подсвечивает одну страну при hover на бейдж и располагает tooltip
 * над её bbox. Снимает spotlight, если код не передан.
 */
function applySpotlight(code: string | null): void {
  const svgEl = getSvgEl()
  if (!svgEl) {
    tooltip.value = null
    return
  }

  svgEl.querySelectorAll<SVGElement>('.is-spotlight').forEach(el => {
    el.classList.remove('is-spotlight')
  })

  if (!code) {
    tooltip.value = null
    return
  }

  const upper = code.toUpperCase()
  const country = countriesByCode.value.get(upper)
  if (!country) {
    tooltip.value = null
    return
  }

  // У страны может быть несколько path'ов (острова) — подсвечиваем все,
  // позиционируем tooltip по объединённому bbox.
  const targets = svgEl.querySelectorAll<SVGGraphicsElement>(`[id="${CSS.escape(upper)}"]`)
  if (targets.length === 0) {
    tooltip.value = null
    return
  }

  const hostRect = mapHost.value?.getBoundingClientRect()
  if (!hostRect) {
    tooltip.value = null
    return
  }

  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity

  targets.forEach(target => {
    target.classList.add('is-spotlight')
    const rect = target.getBoundingClientRect()
    left = Math.min(left, rect.left)
    top = Math.min(top, rect.top)
    right = Math.max(right, rect.right)
    bottom = Math.max(bottom, rect.bottom)
  })

  tooltip.value = {
    x: (left + right) / 2 - hostRect.left,
    y: top - hostRect.top,
    country,
  }
}

watch(activeTab, () => {
  applyHighlights()
  applySpotlight(hoveredCode.value)
})

watch(hoveredCode, next => {
  applySpotlight(next)
})

onMounted(() => {
  loadMap()
})

onBeforeUnmount(() => {
  applySpotlight(null)
})
</script>

<template>
  <section id="map" class="home-map" data-section="map">
    <div class="home-map__inner">
      <header class="home-map__header">
        <h2 class="home-map__title">{{ content.title }}</h2>

        <div class="home-map__tabs" role="tablist" aria-label="Filter countries by tier">
          <button
            v-for="tab in content.tabs"
            :key="tab.id"
            type="button"
            role="tab"
            class="home-map__tab"
            :class="{ 'is-active': activeTab === tab.id }"
            :aria-selected="activeTab === tab.id"
            @click="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </header>

      <div
        ref="mapHost"
        class="home-map__map"
        :data-state="hasMapError ? 'error' : isMapLoading ? 'loading' : 'ready'"
      >
        <div class="home-map__map-svg" v-html="mapSvg"></div>

        <div
          v-if="tooltip"
          class="home-map__tooltip"
          :style="{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }"
          role="status"
          aria-live="polite"
        >
          <div class="home-map__tooltip-card">
            <p class="home-map__tooltip-name">{{ tooltip.country.name }}</p>
            <p class="home-map__tooltip-offers">{{ tooltip.country.offers ?? 0 }} offers</p>
            <span class="home-map__tooltip-badge"> Top in Tier {{ tooltip.country.tier }} </span>
          </div>
        </div>
      </div>

      <p v-if="hasMapError" class="home-map__fallback">
        Could not load the world map. Please try refreshing the page.
      </p>
    </div>

    <ul class="home-map__badges" :aria-label="`Countries (${activeTab})`">
      <li v-for="country in activeCountries" :key="country.code" class="home-map__badge-item">
        <button
          type="button"
          class="home-map__badge"
          :class="{ 'is-hovered': hoveredCode === country.code }"
          :data-code="country.code"
          :title="country.name"
          :aria-label="country.name"
          @mouseenter="setHovered(country.code)"
          @mouseleave="setHovered(null)"
          @focusin="setHovered(country.code)"
          @focusout="setHovered(null)"
        >
          {{ country.code }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

/* ============================================================
 * Section
 * Mobile (Figma 360 — py 70 / px 16)
 * Desktop (Figma 1440 — py 100 / px 120)
 * ============================================================ */
.home-map {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(48);
  padding-block: to-rem(70);
  overflow-x: clip;

  @include mq($from: wide) {
    gap: to-rem(70);
    padding-block: to-rem(100);
  }
}

.home-map__inner {
  --container-pad-x-local: var(--container-pad-mobile);

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-x-local);

  @include mq($from: mobile) {
    --container-pad-x-local: var(--container-pad-x);
  }

  @include mq($from: wide) {
    --container-pad-x-local: #{to-rem(120)};
  }
}

/* ============================================================
 * Header (title + tabs)
 * ============================================================ */
.home-map__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: to-rem(24);
  width: 100%;
  margin-bottom: to-rem(48);

  @include mq($from: tablet) {
    margin-bottom: to-rem(70);
  }
}

.home-map__title {
  @include font-section-title;
}

/* ============================================================
 * Tab group — pill on bg-surface, 4px padding, 4px gap
 * ============================================================ */
.home-map__tabs {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: to-rem(4);
  padding: to-rem(4);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-pill);
}

.home-map__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) var(--container-pad-mobile);
  background-color: transparent;
  border: 0;
  border-radius: var(--radius-pill);
  color: var(--color-text-tertiary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
  @include font-body-s-medium;

  &:hover,
  &:focus-visible {
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &.is-active {
    background-color: var(--color-bg-subtle);
    color: var(--color-text-primary);
  }
}

/* ============================================================
 * Map host — inline SVG со всеми странами + tooltip overlay
 * ============================================================ */
.home-map__map {
  position: relative;
  width: 100%;
  max-width: to-rem(1200);
  margin-inline: auto;

  &[data-state='loading']::before,
  &[data-state='error']::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--color-bg-disabled);
    border-radius: var(--radius-md);
    opacity: 0.4;
  }
}

.home-map__map-svg {
  width: 100%;
  aspect-ratio: 1200 / 695;
}

:deep(.home-map__svg) {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;

  /*
   * Только path'ы с известным ISO-id перекрашиваем.
   * Decorative markers (heart над Украиной) с data-marker сохраняют
   * fill из источника (white) — их CSS не трогает.
   */
  path[id] {
    fill: var(--color-bg-disabled);
    fill-opacity: 1;
    stroke: var(--color-bg-page);
    stroke-opacity: 1;
    stroke-width: 0.4;
    transition:
      fill var(--transition-fast),
      filter var(--transition-fast);
  }

  /* Активные страны (есть в JSON и подходят под текущий tab). */
  path[id].is-active {
    fill: var(--color-bg-brand);
  }

  /* Украина — наша home base: чуть ярче с лёгким pink glow вокруг. */
  path[id='UA'].is-active {
    filter: drop-shadow(0 0 4px rgba(255, 1, 128, 0.65));
  }

  /* Spotlight при hover на бейдже — белый, как в Figma. */
  path[id].is-spotlight {
    fill: var(--color-text-primary);
  }
}

/* ============================================================
 * Tooltip — карточка над выбранной страной (hover на бейдже)
 * Figma node 2825:6528 (Country Info):
 *  • Card: bg-overlay (rgba(20,20,20,0.7)), backdrop-blur 12.5px,
 *    border 1px subtle, radius 24, padding 48 vert / 24 horiz
 *  • Body: name (Caption Regular, secondary) + offers (24/32 primary)
 *  • Badge "Top in Tier X" (absolute поверх card, rotate -8deg):
 *    bg-surface, border 1px brand-pink, radius pill,
 *    padding 8/12, text 14/16 medium WHITE
 * ============================================================ */
.home-map__tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 2;
  /* Якорь центра низа карточки над странной с зазором 8px. */
  transform: translate(-50%, calc(-100% - #{to-rem(8)}));
  animation: home-map-tooltip-in var(--transition-fast) ease-out;
}

.home-map__tooltip-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  gap: to-rem(4);
  min-width: to-rem(140);
  padding: to-rem(48) to-rem(24);
  background-color: var(--color-bg-overlay);
  backdrop-filter: blur(12.5px);
  -webkit-backdrop-filter: blur(12.5px);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.home-map__tooltip-name {
  margin: 0;
  color: var(--color-text-secondary);
  white-space: nowrap;
  @include font-caption-regular;
}

.home-map__tooltip-offers {
  margin: 0;
  color: var(--color-text-primary);
  white-space: nowrap;
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: to-rem(24);
  line-height: to-rem(32);
  letter-spacing: -0.01em;
}

.home-map__tooltip-badge {
  position: absolute;
  top: to-rem(-20);
  left: to-rem(-16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: to-rem(8) to-rem(12);
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-brand);
  border-radius: var(--radius-pill);
  color: var(--color-text-primary);
  white-space: nowrap;
  transform: rotate(-8deg);
  transform-origin: center;
  @include font-caption-medium;
}

@keyframes home-map-tooltip-in {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% - #{to-rem(2)}));
  }
  to {
    opacity: 1;
    transform: translate(-50%, calc(-100% - #{to-rem(8)}));
  }
}

.home-map__fallback {
  margin: 0;
  text-align: center;
  color: var(--color-text-tertiary);
  @include font-body-s-regular;
}

/* ============================================================
 * Badges row — горизонтальный скролл на всю ширину секции (вне .inner),
 * инсеты как у контентной колонки — см. .home-map__inner.
 * Скроллится только содержимое ряда: контейнер width:100%, без absolute
 * (absolute без width/right даёт ширину по контенту → скролла нет).
 * Figma: gap 8
 * Mobile (3861:20520): badge 48×48, pad 12, Body 2 Medium 16/24
 * Desktop: badge 72×72, pad 24, H5 20/24
 * ============================================================ */
.home-map__badges {
  display: flex;
  align-items: center;
  gap: to-rem(8);
  align-self: stretch;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: to-rem(4) var(--container-pad-mobile);
  padding-inline: 0;
  list-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.home-map__badge-item {
  flex: 0 0 auto;
}

.home-map__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: to-rem(48);
  height: to-rem(48);
  padding: to-rem(12);
  background-color: var(--color-bg-subtle);
  border: 0;
  border-radius: var(--radius-pill);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);
  @include font-body-s-medium;

  @include mq($from: tablet) {
    width: to-rem(72);
    height: to-rem(72);
    padding: to-rem(24);
    @include font-h5;
  }

  &:hover,
  &:focus-visible,
  &.is-hovered {
    background-color: var(--color-bg-hovered);
    color: var(--color-text-primary);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }
}
</style>
