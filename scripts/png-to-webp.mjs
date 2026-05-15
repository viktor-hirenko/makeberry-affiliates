/**
 * PNG → WebP batch converter for makeberry_affiliates.
 *
 * Quality presets:
 *   decorations (glow)  : 75  — soft blurs, artifacts invisible
 *   hero images          : 82  — LCP-critical, higher quality
 *   decorative-icons     : 85  — small icons with transparency
 *   logos / awards       : 85  — brand assets, quality matters
 *   404 images           : 82  — full-page illustration
 *
 * Usage: node scripts/png-to-webp.mjs
 */

import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = resolve(__dirname, '../public')

/** quality by folder segment */
function qualityFor(filePath) {
  if (filePath.includes('/decorations/')) return 75
  if (filePath.includes('/hero/')) return 82
  if (filePath.includes('/404/')) return 82
  if (filePath.includes('/decorative-icons/')) return 85
  if (filePath.includes('/logos/')) return 85
  return 85
}

/** Recursively find all .png files */
function findPngs(dir) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...findPngs(full))
    } else if (entry.toLowerCase().endsWith('.png')) {
      results.push(full)
    }
  }
  return results
}

async function main() {
  const pngs = findPngs(PUBLIC_DIR)
  const report = []

  for (const pngPath of pngs) {
    const webpPath = pngPath.replace(/\.png$/i, '.webp')
    const quality = qualityFor(pngPath)
    const beforeBytes = statSync(pngPath).size

    try {
      await sharp(pngPath)
        .webp({ quality, lossless: false, smartSubsample: true })
        .toFile(webpPath)

      const afterBytes = statSync(webpPath).size
      const saved = beforeBytes - afterBytes
      const pct = ((saved / beforeBytes) * 100).toFixed(1)
      const relative = pngPath.replace(PUBLIC_DIR, '')

      report.push({
        file: relative,
        before: (beforeBytes / 1024).toFixed(1) + ' KB',
        after: (afterBytes / 1024).toFixed(1) + ' KB',
        saved: (saved / 1024).toFixed(1) + ' KB',
        pct: pct + '%',
        quality,
      })

      console.log(`✓ ${relative.padEnd(70)} ${(beforeBytes/1024).toFixed(0).padStart(7)} KB → ${(afterBytes/1024).toFixed(0).padStart(6)} KB  (−${pct})`)
    } catch (err) {
      console.error(`✗ ${pngPath}: ${err.message}`)
    }
  }

  const totalBefore = report.reduce((s, r) => s + parseFloat(r.before), 0)
  const totalAfter = report.reduce((s, r) => s + parseFloat(r.after), 0)
  const totalSaved = totalBefore - totalAfter

  console.log('\n──────────────────────────────────────────')
  console.log(`Files processed : ${report.length}`)
  console.log(`Total before    : ${(totalBefore / 1024).toFixed(1)} MB`)
  console.log(`Total after     : ${(totalAfter / 1024).toFixed(1)} MB`)
  console.log(`Total saved     : ${(totalSaved / 1024).toFixed(1)} MB (${((totalSaved/totalBefore)*100).toFixed(1)}%)`)
  console.log('──────────────────────────────────────────')
  console.log('\nAll WebP files created. Run the reference-update step next.')
}

main().catch(err => { console.error(err); process.exit(1) })
