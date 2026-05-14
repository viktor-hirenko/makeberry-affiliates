import rawHome from '../data/en/pages/home.json'
import rawNotFound from '../data/en/pages/not-found.json'
import rawBlog from '../data/en/pages/blog/index.json'
import articleOrder from '../data/en/pages/blog/articles/order.json'
import rawFooter from '../data/en/shared/footer.json'
import rawNav from '../data/en/shared/nav.json'
import type {
  ArticleDetail,
  AudiencePageContent,
  BlogContent,
  CasinoPageContent,
  FooterConfig,
  HomeAboutContent,
  HomeAffiliatesAdvertisersContent,
  HomeBenefitsContent,
  HomeBlogContent,
  HomeContactsContent,
  HomeDirectAdvertiserContent,
  HomeFaqContent,
  HomeHeroContent,
  HomeMapContent,
  HomeMeetUsContent,
  HomePageContent,
  HomeTestimonialsContent,
  HomeVacanciesContent,
  NavConfig,
  NotFoundPageContent,
} from '@/types/content'

const home = rawHome as HomePageContent

/** Порядок в массиве `useCasinos()` при известных slug (остальные — после них, по `localeCompare`). */
const CASINO_SLUG_PREFERRED_ORDER: readonly string[] = ['winspirit', 'rocketplay', 'luckyhills']

/** Порядок в массиве `useAudiences()` при известных slug (остальные — после них, по `localeCompare`). */
const AUDIENCE_SLUG_PREFERRED_ORDER: readonly string[] = ['affiliates', 'advertisers']

function getDefaultExport<T>(mod: unknown): T {
  if (typeof mod === 'object' && mod !== null && 'default' in mod) {
    return (mod as { default: T }).default
  }
  return mod as T
}

/**
 * Сообщает о невалидном контенте.
 *
 * - DEV: бросает ошибку, чтобы разработчик сразу заметил проблему.
 * - PROD: пишет в `console.error` и позволяет вызывающему коду пропустить
 *   битую запись, не роняя весь SPA (см. аудит A-3).
 */
function reportContentError(message: string): void {
  if (import.meta.env.DEV) {
    throw new Error(message)
  }
  console.error(message)
}

function sortBySlugPreference<T extends { slug: string }>(
  items: T[],
  preferred: readonly string[],
): T[] {
  const rank = new Map(preferred.map((slug, index) => [slug, index]))
  return [...items].sort((a, b) => {
    const ra = rank.get(a.slug)
    const rb = rank.get(b.slug)
    const fa = ra === undefined ? Number.POSITIVE_INFINITY : ra
    const fb = rb === undefined ? Number.POSITIVE_INFINITY : rb
    if (fa !== fb) return fa - fb
    return a.slug.localeCompare(b.slug)
  })
}

/**
 * import.meta.glob — первый аргумент должен быть строковым литералом
 * (ограничение Vite при статическом разборе), без переменных/констант.
 */
function buildArticlesFromGlob(): {
  bySlug: Record<string, ArticleDetail>
  ordered: ArticleDetail[]
} {
  const modules = import.meta.glob<{ default: ArticleDetail }>(
    '../data/en/pages/blog/articles/*.json',
    { eager: true },
  )

  const bySlug: Record<string, ArticleDetail> = {}
  const orderSlugs = (articleOrder as { slugs: string[] }).slugs
  const orderedSet = new Set(orderSlugs)

  for (const filePath of Object.keys(modules)) {
    if (filePath.endsWith('order.json')) {
      continue
    }
    const article = getDefaultExport<ArticleDetail>(modules[filePath])
    const { slug } = article
    if (bySlug[slug]) {
      reportContentError(`[useContent] Duplicate article slug "${slug}" in blog articles`)
      continue
    }
    bySlug[slug] = article
  }

  for (const slug of orderSlugs) {
    if (!bySlug[slug]) {
      reportContentError(
        `[useContent] order.json lists slug "${slug}" but no matching article JSON was found`,
      )
    }
  }

  for (const slug of Object.keys(bySlug)) {
    if (!orderedSet.has(slug)) {
      reportContentError(
        `[useContent] Article JSON with slug "${slug}" must be listed in order.json (or remove the file)`,
      )
    }
  }

  const ordered = orderSlugs
    .map((slug) => bySlug[slug])
    .filter((article): article is ArticleDetail => article !== undefined)
  return { bySlug, ordered }
}

const { bySlug: ARTICLES_BY_SLUG, ordered: RESOLVED_ARTICLES } = buildArticlesFromGlob()

const { list: CASINOS, bySlug: CASINOS_BY_SLUG } = (() => {
  const modules = import.meta.glob<{ default: CasinoPageContent }>(
    '../data/en/pages/casinos/*.json',
    { eager: true },
  )
  const bySlug: Record<string, CasinoPageContent> = {}
  const items: CasinoPageContent[] = []

  for (const filePath of Object.keys(modules)) {
    const casino = getDefaultExport<CasinoPageContent>(modules[filePath])
    const { slug } = casino
    if (bySlug[slug]) {
      reportContentError(`[useContent] Duplicate casino slug "${slug}"`)
      continue
    }
    bySlug[slug] = casino
    items.push(casino)
  }

  return {
    list: sortBySlugPreference(items, CASINO_SLUG_PREFERRED_ORDER),
    bySlug,
  }
})()

const { list: AUDIENCES, bySlug: AUDIENCES_BY_SLUG } = (() => {
  const modules = import.meta.glob<{ default: AudiencePageContent }>(
    '../data/en/pages/affiliates/*.json',
    { eager: true },
  )
  const bySlug: Record<string, AudiencePageContent> = {}
  const items: AudiencePageContent[] = []

  for (const filePath of Object.keys(modules)) {
    const audience = getDefaultExport<AudiencePageContent>(modules[filePath])
    const { slug } = audience
    if (bySlug[slug]) {
      reportContentError(`[useContent] Duplicate audience slug "${slug}"`)
      continue
    }
    bySlug[slug] = audience
    items.push(audience)
  }

  return {
    list: sortBySlugPreference(items, AUDIENCE_SLUG_PREFERRED_ORDER),
    bySlug,
  }
})()

export function useNav(): NavConfig {
  return rawNav as NavConfig
}

export function useFooter(): FooterConfig {
  return rawFooter as FooterConfig
}

export function useNotFound(): NotFoundPageContent {
  return rawNotFound as NotFoundPageContent
}

export function useHomeHero(): HomeHeroContent {
  return home.hero
}

export function useHomeAbout(): HomeAboutContent {
  return home.about
}

export function useHomeAffiliatesAdvertisers(): HomeAffiliatesAdvertisersContent {
  return home.affiliatesAdvertisers
}

export function useHomeDirectAdvertiser(): HomeDirectAdvertiserContent {
  return home.directAdvertiser
}

export function useHomeMap(): HomeMapContent {
  return home.map
}

export function useHomeBenefits(): HomeBenefitsContent {
  return home.benefits
}

export function useHomeTestimonials(): HomeTestimonialsContent {
  return home.testimonials
}

export function useHomeMeetUs(): HomeMeetUsContent {
  return home.meetUs
}

export function useHomeContacts(): HomeContactsContent {
  return home.contacts
}

export function useHomeFaq(): HomeFaqContent {
  return home.faq
}

export function useHomeVacancies(): HomeVacanciesContent {
  return home.vacancies
}

export function useHomeBlog(): HomeBlogContent {
  return home.blog
}

export function useBlogMeta(): BlogContent {
  return rawBlog as BlogContent
}

export function useArticles(): ArticleDetail[] {
  return RESOLVED_ARTICLES
}

export function getArticleBySlug(slug: string): ArticleDetail | undefined {
  return ARTICLES_BY_SLUG[slug]
}

export function getAdjacentArticles(slug: string): {
  prev?: ArticleDetail
  next?: ArticleDetail
} {
  const articles = useArticles()
  const index = articles.findIndex((article) => article.slug === slug)
  if (index === -1) {
    return {}
  }
  return {
    prev: index > 0 ? articles[index - 1] : undefined,
    next: index < articles.length - 1 ? articles[index + 1] : undefined,
  }
}

/**
 * Контент страниц-аудиторий (For Affiliates / For Advertisers).
 *
 * Обе страницы построены по одному шаблону (`AudienceView` + компоненты
 * в `components/audience/*`) и отличаются только данными. Здесь
 * выдаём весь массив и точечный лук по slug — точно так же,
 * как у casino direct-advertiser страниц.
 */
export function useAudiences(): AudiencePageContent[] {
  return AUDIENCES
}

export function getAudienceBySlug(slug: string): AudiencePageContent | undefined {
  return AUDIENCES_BY_SLUG[slug]
}

export function useCasinos(): CasinoPageContent[] {
  return CASINOS
}

export function getCasinoBySlug(slug: string): CasinoPageContent | undefined {
  return CASINOS_BY_SLUG[slug]
}
