#!/usr/bin/env node
/**
 * inject-country-ids.mjs
 *
 * Однократная утилита. Берёт `world-map.svg` (экспорт из Figma БЕЗ id-атрибутов)
 * + Figma metadata из `scripts/figma-map-metadata.txt`, матчит каждый <path> с
 * соответствующим vector'ом по bounding box и переписывает SVG, добавив
 * `id="<ISO-2>"` на каждый path. Это даёт интерактив (подсветка стран по hover'у)
 * без необходимости переэкспортировать SVG из Figma с настройкой
 * `Include "id" attribute`.
 *
 *   $ node scripts/inject-country-ids.mjs
 *
 * Перезаписывает `public/images/home/map/world-map.svg` in-place.
 * Прежняя копия сохраняется как `scripts/_backup/world-map.original.svg` (если ещё не было).
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const SVG_PATH = resolve(ROOT, 'public/images/home/map/world-map.svg')
const BACKUP_DIR = resolve(__dirname, '_backup')
const SVG_BACKUP = resolve(BACKUP_DIR, 'world-map.original.svg')
const META_PATH = resolve(__dirname, 'figma-map-metadata.txt')

/* ============================================================
 * 1) Парсинг Figma metadata → массив vector'ов
 * ============================================================ */
function parseFigmaMetadata(text) {
  const re =
    /<vector\s+id="[^"]+"\s+name="([^"]+)"\s+x="([\-\d.]+)"\s+y="([\-\d.]+)"\s+width="([\-\d.]+)"\s+height="([\-\d.]+)"/g
  const vectors = []
  let m
  while ((m = re.exec(text)) !== null) {
    const [, name, x, y, w, h] = m
    vectors.push({
      name,
      x: parseFloat(x),
      y: parseFloat(y),
      w: parseFloat(w),
      h: parseFloat(h),
    })
  }
  return vectors
}

/* ============================================================
 * 2) Парсинг path d-атрибута → bbox
 *    Поддерживаются M, L, H, V, C, S, Q, T, A, Z в abs/rel формах.
 * ============================================================ */
function pathBbox(d) {
  const tokens = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:[eE][+\-]?\d+)?/g) || []

  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let cmd = null
  let i = 0

  const update = () => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  while (i < tokens.length) {
    const t = tokens[i]
    if (/^[A-Za-z]$/.test(t)) {
      cmd = t
      i++
      continue
    }

    const upper = cmd.toUpperCase()
    const isRel = cmd === cmd.toLowerCase() && upper !== 'Z'

    const num = () => parseFloat(tokens[i++])

    switch (upper) {
      case 'M': {
        const dx = num()
        const dy = num()
        x = isRel ? x + dx : dx
        y = isRel ? y + dy : dy
        startX = x
        startY = y
        update()
        cmd = isRel ? 'l' : 'L'
        break
      }
      case 'L':
      case 'T': {
        const dx = num()
        const dy = num()
        x = isRel ? x + dx : dx
        y = isRel ? y + dy : dy
        update()
        break
      }
      case 'H': {
        const dx = num()
        x = isRel ? x + dx : dx
        update()
        break
      }
      case 'V': {
        const dy = num()
        y = isRel ? y + dy : dy
        update()
        break
      }
      case 'C': {
        i += 4
        const dx = num()
        const dy = num()
        x = isRel ? x + dx : dx
        y = isRel ? y + dy : dy
        update()
        break
      }
      case 'S':
      case 'Q': {
        i += 2
        const dx = num()
        const dy = num()
        x = isRel ? x + dx : dx
        y = isRel ? y + dy : dy
        update()
        break
      }
      case 'A': {
        i += 5
        const dx = num()
        const dy = num()
        x = isRel ? x + dx : dx
        y = isRel ? y + dy : dy
        update()
        break
      }
      case 'Z': {
        x = startX
        y = startY
        update()
        break
      }
      default:
        i++
    }
  }

  if (!isFinite(minX)) return null
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

/* ============================================================
 * 3) Матчинг: для каждого path находим vector,
 *    в чьём bbox (с допуском) лежит centroid path'а.
 *    Если path'ов внутри одного vector'а несколько (страна с островами) —
 *    все получают тот же id.
 * ============================================================ */
function matchPathToVector(pathBox, vectors, tolerance = 0.6) {
  const cx = pathBox.x + pathBox.w / 2
  const cy = pathBox.y + pathBox.h / 2

  // Кандидаты: vector'ы у которых bbox содержит центроид path'а.
  const candidates = vectors.filter(
    (v) =>
      cx >= v.x - tolerance &&
      cx <= v.x + v.w + tolerance &&
      cy >= v.y - tolerance &&
      cy <= v.y + v.h + tolerance,
  )

  if (candidates.length === 0) return null
  if (candidates.length === 1) return candidates[0]

  // Несколько кандидатов — выбираем тот, чей собственный bbox ближе всего
  // по размерам к bbox path'а (для одиночных стран это совпадение почти точное).
  let best = candidates[0]
  let bestScore = Infinity
  for (const v of candidates) {
    const dw = Math.abs(v.w - pathBox.w)
    const dh = Math.abs(v.h - pathBox.h)
    const score = dw + dh
    if (score < bestScore) {
      bestScore = score
      best = v
    }
  }
  return best
}

/* ============================================================
 * 4) Run
 * ============================================================ */
/**
 * Decorative markers: solid-white shapes без fill-opacity (heart над Украиной,
 * heart-2, точки и т.п.). Они НЕ должны получать id страны, иначе подсветка
 * перекрашивает их под цвет страны и ломает дизайн.
 */
function isDecorativeMarker(attrsText) {
  const fillMatch = attrsText.match(/\sfill="([^"]+)"/i)
  if (!fillMatch) return false
  const fill = fillMatch[1].trim().toLowerCase()
  if (fill !== 'white' && fill !== '#fff' && fill !== '#ffffff') return false
  const opacityMatch = attrsText.match(/\sfill-opacity="([^"]+)"/i)
  if (!opacityMatch) return true
  return parseFloat(opacityMatch[1]) >= 0.99
}

function main() {
  if (!existsSync(META_PATH)) {
    throw new Error(`Metadata not found at ${META_PATH}`)
  }

  const meta = readFileSync(META_PATH, 'utf8')
  const vectors = parseFigmaMetadata(meta)
  console.log(`[inject] vectors from Figma metadata: ${vectors.length}`)

  const isoVectors = vectors.filter((v) => /^[A-Z][A-Z0-9-]{1,}$/.test(v.name))
  console.log(`[inject] ISO-coded vectors: ${isoVectors.length}`)

  // Idempotent: всегда читаем из исходного бэкапа, если он есть.
  const sourcePath = existsSync(SVG_BACKUP) ? SVG_BACKUP : SVG_PATH
  if (!existsSync(sourcePath)) {
    throw new Error(`SVG not found at ${sourcePath}`)
  }

  let svg = readFileSync(sourcePath, 'utf8')

  if (sourcePath === SVG_PATH) {
    if (svg.includes('<path id="')) {
      console.warn('[inject] SVG already has path id-attributes и нет бэкапа — пропускаю.')
      return
    }
    mkdirSync(BACKUP_DIR, { recursive: true })
    copyFileSync(SVG_PATH, SVG_BACKUP)
    console.log(`[inject] backup saved → ${SVG_BACKUP}`)
  } else {
    console.log(`[inject] using backup as source → ${SVG_BACKUP}`)
  }

  let totalPaths = 0
  let matched = 0
  let skippedMarkers = 0
  const matchCountByCode = new Map()

  const next = svg.replace(/<path\b([^>]*?)d="([^"]+)"([^>]*)\/>/g, (full, pre, d, post) => {
    totalPaths++
    if (/\sid=/.test(pre) || /\sid=/.test(post)) return full

    const allAttrs = `${pre} ${post}`
    if (isDecorativeMarker(allAttrs)) {
      skippedMarkers++
      // Помечаем data-marker, чтобы CSS не перекрашивал такие path'ы.
      return `<path data-marker="true"${pre}d="${d}"${post}/>`
    }

    const box = pathBbox(d)
    if (!box) return full

    const v = matchPathToVector(box, isoVectors)
    if (!v) return full

    matched++
    matchCountByCode.set(v.name, (matchCountByCode.get(v.name) ?? 0) + 1)
    return `<path id="${v.name}"${pre}d="${d}"${post}/>`
  })

  writeFileSync(SVG_PATH, next, 'utf8')

  const uniqueCodes = matchCountByCode.size
  const unmatched = totalPaths - matched - skippedMarkers
  console.log(
    `[inject] total <path>: ${totalPaths}, matched: ${matched} (${uniqueCodes} unique codes), skipped markers: ${skippedMarkers}, unmatched: ${unmatched}`,
  )

  const missing = isoVectors.filter((v) => !matchCountByCode.has(v.name))
  if (missing.length > 0) {
    console.warn(
      `[inject] vectors without matching path (${missing.length}):`,
      missing.map((v) => v.name).join(', '),
    )
  }

  console.log(`[inject] ✓ wrote ${SVG_PATH}`)
}

main()
