import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'

const DIST = resolve('dist')

const STATIC_ROUTES = [
  'affiliates',
  'advertisers',
  'blog',
  'referral',
  'terms-and-conditions',
  'privacy-policy',
]

/* Роуты, которых не должно быть в поиске: ссылка на них раздаётся адресно.
 * robots.txt на домене отдаёт Cloudflare, поэтому единственная надёжная
 * точка управления — мета-тег в самом shell'е роута. */
const NOINDEX_ROUTES = new Set(['referral'])

const CASINO_SLUGS = ['winspirit', 'rocketplay', 'luckyhills']

function getBlogSlugs() {
  const orderPath = resolve('src/data/en/pages/blog/articles/order.json')
  const { slugs } = JSON.parse(readFileSync(orderPath, 'utf-8'))
  return slugs
}

function buildRoutes() {
  const routes = [...STATIC_ROUTES]
  for (const slug of getBlogSlugs()) {
    routes.push(`blog/${slug}`)
  }
  for (const slug of CASINO_SLUGS) {
    routes.push(`casino/${slug}`)
  }
  return routes
}

const indexPath = join(DIST, 'index.html')

if (!existsSync(indexPath)) {
  console.error('\n✗ dist/index.html не найден. Сначала выполни vite build.\n')
  process.exit(1)
}

const indexHtml = readFileSync(indexPath, 'utf-8')
const routes = buildRoutes()

console.log(`\n📄 Генерируем SPA-shell для ${routes.length} роутов...`)

for (const route of routes) {
  const dir = join(DIST, route)
  mkdirSync(dir, { recursive: true })

  const html = NOINDEX_ROUTES.has(route)
    ? indexHtml.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />')
    : indexHtml

  writeFileSync(join(dir, 'index.html'), html)
  console.log(`  ✓ ${route}/index.html${NOINDEX_ROUTES.has(route) ? ' (noindex)' : ''}`)
}

console.log(`\n✓ SPA-shell готов.\n`)
