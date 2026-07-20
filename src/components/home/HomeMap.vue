<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { formatUiString, useHomeMap, useSharedUi } from '@/composables/useContent'
import type { HomeMapCountry, HomeMapTab } from '@/types/content'

const content = useHomeMap()
const ui = useSharedUi()

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

/**
 * Автопрокрутка бейджей при overflow: дублируем список для seamless loop + rAF.
 */
const badgesEl = ref<HTMLUListElement | null>(null)
const hasBadgeOverflow = ref(false)
const isMarqueePaused = ref(false)
const prefersReducedMotion = ref(false)
const MARQUEE_SPEED_PX_PER_SEC = 28

/** `isClone` — дубликаты для loop; скрыты от AT (aria-hidden / tabindex=-1). */
const marqueeItems = computed<{ country: HomeMapCountry; isClone: boolean }[]>(() => {
  const base = activeCountries.value.map(country => ({ country, isClone: false }))
  if (!hasBadgeOverflow.value) return base
  return [...base, ...activeCountries.value.map(country => ({ country, isClone: true }))]
})

let marqueeFrame = 0
let marqueeLastTs = 0
/** Дробный остаток: scrollLeft принимает только целые px. */
let marqueeCarry = 0
let reducedMotionMql: MediaQueryList | null = null
let touchResumeTimeout: number | undefined

function onReducedMotionChange(event: MediaQueryListEvent | MediaQueryList): void {
  prefersReducedMotion.value = event.matches
}

function checkBadgeOverflow(): void {
  const el = badgesEl.value
  if (!el) return

  // После клонирования scrollWidth ≈ 2× контента — сравниваем половину.
  const contentWidth = hasBadgeOverflow.value ? el.scrollWidth / 2 : el.scrollWidth
  const next = contentWidth > el.clientWidth + 1

  if (next !== hasBadgeOverflow.value) {
    hasBadgeOverflow.value = next
    el.scrollLeft = 0
    marqueeCarry = 0
    nextTick(checkBadgeOverflow)
  }
}

/** Держит scrollLeft в первой половине ленты (до клона). */
function normalizeMarqueeScroll(): void {
  const el = badgesEl.value
  if (!el || !hasBadgeOverflow.value) return

  const half = el.scrollWidth / 2
  if (half <= 0) return

  while (el.scrollLeft >= half) {
    el.scrollLeft -= half
  }
  while (el.scrollLeft < 0) {
    el.scrollLeft += half
  }
}

function stepMarquee(timestamp: number): void {
  const el = badgesEl.value
  if (el && hasBadgeOverflow.value && !isMarqueePaused.value && !prefersReducedMotion.value) {
    const last = marqueeLastTs || timestamp
    const dtSec = Math.min((timestamp - last) / 1000, 0.05)
    marqueeCarry += MARQUEE_SPEED_PX_PER_SEC * dtSec
    const step = Math.floor(marqueeCarry)
    if (step > 0) {
      el.scrollLeft += step
      marqueeCarry -= step
      normalizeMarqueeScroll()
    }
  }
  marqueeLastTs = timestamp
  marqueeFrame = requestAnimationFrame(stepMarquee)
}

function pauseMarquee(): void {
  isMarqueePaused.value = true
  marqueeLastTs = 0
}

function resumeMarquee(): void {
  normalizeMarqueeScroll()
  marqueeLastTs = 0
  isMarqueePaused.value = false
}

/** Задержка после touchend, чтобы не стартовать scroll под пальцем. */
function scheduleResumeAfterTouch(): void {
  if (touchResumeTimeout) window.clearTimeout(touchResumeTimeout)
  touchResumeTimeout = window.setTimeout(resumeMarquee, 800)
}

function onWindowResize(): void {
  checkBadgeOverflow()
}

function selectTab(tabId: HomeMapTab['id']): void {
  activeTab.value = tabId
}

function setHovered(code: string | null): void {
  hoveredCode.value = code
}

/**
 * Desktop hover по path.is-active → тот же spotlight/tooltip, что у бейджей.
 */
function onMapPointerOver(event: MouseEvent): void {
  const path = (event.target as Element | null)?.closest?.('path[id].is-active')
  const id = path?.getAttribute('id')
  if (id) setHovered(id)
}

function onMapPointerOut(event: MouseEvent): void {
  const path = (event.target as Element | null)?.closest?.('path[id].is-active')
  if (path) setHovered(null)
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

    const svgAriaLabel = ui.aria.mapSvg.replace(/"/g, '&quot;')
    raw = raw.replace(
      /<svg([^>]*)>/,
      `<svg$1 class="home-map__svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${svgAriaLabel}">`
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
  nextTick(checkBadgeOverflow)
})

watch(hoveredCode, next => {
  applySpotlight(next)
})

onMounted(() => {
  loadMap()
  nextTick(checkBadgeOverflow)

  window.addEventListener('resize', onWindowResize)

  reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
  onReducedMotionChange(reducedMotionMql)
  reducedMotionMql.addEventListener('change', onReducedMotionChange)

  marqueeFrame = requestAnimationFrame(stepMarquee)
})

onBeforeUnmount(() => {
  applySpotlight(null)
  window.removeEventListener('resize', onWindowResize)
  reducedMotionMql?.removeEventListener('change', onReducedMotionChange)
  cancelAnimationFrame(marqueeFrame)
  if (touchResumeTimeout) window.clearTimeout(touchResumeTimeout)
})
</script>

<template>
  <section id="map" class="home-map" data-section="map">
    <div class="home-map__inner">
      <header class="home-map__header">
        <h2 class="home-map__title">{{ content.title }}</h2>

        <div class="home-map__tabs" :aria-label="ui.aria.mapTabs">
          <button
            v-for="tab in content.tabs"
            :key="tab.id"
            type="button"
            class="home-map__tab"
            :class="{ 'is-active': activeTab === tab.id }"
            :aria-pressed="activeTab === tab.id"
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
        @mouseover="onMapPointerOver"
        @mouseout="onMapPointerOut"
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
            <p class="home-map__tooltip-offers">
              {{ formatUiString(ui.map.offers, { count: tooltip.country.offers ?? 0 }) }}
            </p>
            <span class="home-map__tooltip-badge">
              {{ formatUiString(ui.map.tierBadge, { tier: tooltip.country.tier }) }}
            </span>
          </div>
        </div>
      </div>

      <p v-if="hasMapError" class="home-map__fallback">
        {{ ui.map.loadError }}
      </p>
    </div>

    <ul
      ref="badgesEl"
      class="home-map__badges"
      :class="{ 'is-marquee': hasBadgeOverflow }"
      :aria-label="`Countries (${activeTab})`"
      @mouseenter="pauseMarquee"
      @mouseleave="resumeMarquee"
      @focusin="pauseMarquee"
      @focusout="resumeMarquee"
      @touchstart.passive="pauseMarquee"
      @touchend.passive="scheduleResumeAfterTouch"
    >
      <li
        v-for="(entry, idx) in marqueeItems"
        :key="`${entry.country.code}-${idx}`"
        class="home-map__badge-item"
        :aria-hidden="entry.isClone || undefined"
      >
        <button
          type="button"
          class="home-map__badge"
          :class="{ 'is-hovered': hoveredCode === entry.country.code }"
          :data-code="entry.country.code"
          :title="entry.country.name"
          :aria-label="entry.country.name"
          :tabindex="entry.isClone ? -1 : undefined"
          @mouseenter="setHovered(entry.country.code)"
          @mouseleave="setHovered(null)"
          @focusin="setHovered(entry.country.code)"
          @focusout="setHovered(null)"
        >
          {{ entry.country.code }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.home-map {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: to-rem(48);
  padding-block: to-rem(70);
  overflow-x: clip;

  @include mq($from: laptop) {
    gap: to-rem(70);
    padding-block: to-rem(100);
  }
}

.home-map__inner {
  /* На ≥ laptop HomeMap хочет более широкий внутренний отступ (120 вместо
   * глобальных 60), поэтому локально переопределяем --container-pad-x. */
  --container-pad-x-local: var(--container-pad-x);

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-x-local);

  @include mq($from: laptop) {
    --container-pad-x-local: #{to-rem(120)};
  }
}

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
  padding: to-rem(8) to-rem(16);
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

  /* Активные страны под текущий tab. */
  path[id].is-active {
    fill: var(--color-bg-brand);
  }

  @media (pointer: fine) {
    path[id].is-active {
      pointer-events: auto;
      cursor: pointer;
    }
  }

  /* Украина — home base: по умолчанию полупрозрачный белый; в активном табе
     fill как у остальных (path[id].is-active), плюс pink glow только для UA. */
  path[id='UA'] {
    fill: rgba(255, 255, 255, 0.2);
  }

  path[id='UA'].is-active {
    filter: drop-shadow(0 0 4px rgba(255, 1, 128, 0.65));
  }

  /* Spotlight при hover на бейдже — белый, как в Figma. */
  path[id].is-spotlight {
    fill: var(--color-text-primary);
  }
}

/* Tooltip Country Info — Figma 2825:6528. */
.home-map__tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 2;
  /* Якорь центра низа карточки над странной с зазором 8px. */
  transform: translate(-50%, calc(-100% - #{to-rem(8)}));

  @media (prefers-reduced-motion: no-preference) {
    animation: home-map-tooltip-in var(--transition-fast) ease-out;
  }
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

@media (prefers-reduced-motion: no-preference) {
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
}

.home-map__fallback {
  margin: 0;
  text-align: center;
  color: var(--color-text-tertiary);
  @include font-body-s-regular;
}

/* Horizontal scroll ряда: width:100% обязательно (absolute без width/right
 * сжимал бы ряд по контенту, скролл не появлялся). */
.home-map__badges {
  display: flex;
  align-items: center;
  /* Центрируем, когда бейджи помещаются; при переполнении `safe`
   * автоматически переключает на start, чтобы левые бейджи не
   * уезжали за край и оставались доступны при горизонтальном скролле. */
  justify-content: safe center;
  gap: to-rem(8);
  align-self: stretch;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: to-rem(4) to-rem(16);
  padding-inline: 0;
  list-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  scroll-behavior: auto;
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
