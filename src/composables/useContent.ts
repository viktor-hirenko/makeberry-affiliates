import rawArticles from '@/data/articles.json'
import rawAdvertisers from '@/data/advertisers.json'
import rawAffiliates from '@/data/affiliates.json'
import rawBlog from '@/data/blog.json'
import rawCasinos from '@/data/casinos.json'
import rawFooter from '@/data/footer.json'
import rawHome from '@/data/home.json'
import rawHomeAbout from '@/data/home-about.json'
import rawHomeAffAdv from '@/data/home-affiliates-advertisers.json'
import rawHomeBenefits from '@/data/home-benefits.json'
import rawHomeDirect from '@/data/home-direct-advertiser.json'
import rawHomeHero from '@/data/home-hero.json'
import rawHomeContacts from '@/data/home-contacts.json'
import rawHomeBlog from '@/data/home-blog.json'
import rawHomeFaq from '@/data/home-faq.json'
import rawHomeMap from '@/data/home-map.json'
import rawHomeMeetUs from '@/data/home-meet-us.json'
import rawHomeTestimonials from '@/data/home-testimonials.json'
import rawHomeVacancies from '@/data/home-vacancies.json'
import rawNav from '@/data/nav.json'
import type {
  AdvertisersPageContent,
  AffiliatesPageContent,
  ArticleDetail,
  BlogContent,
  CasinoPageContent,
  FooterConfig,
  HomeAboutContent,
  HomeAffiliatesAdvertisersContent,
  HomeBenefitsContent,
  HomeBlogContent,
  HomeContent,
  HomeDirectAdvertiserContent,
  HomeHeroContent,
  HomeContactsContent,
  HomeFaqContent,
  HomeMapContent,
  HomeMeetUsContent,
  HomeTestimonialsContent,
  HomeVacanciesContent,
  NavConfig,
} from '@/types/content'

export function useNav(): NavConfig {
  return rawNav as NavConfig
}

export function useFooter(): FooterConfig {
  return rawFooter as FooterConfig
}

export function useHome(): HomeContent {
  return rawHome as HomeContent
}

export function useHomeHero(): HomeHeroContent {
  return rawHomeHero as HomeHeroContent
}

export function useHomeAbout(): HomeAboutContent {
  return rawHomeAbout as HomeAboutContent
}

export function useHomeAffiliatesAdvertisers(): HomeAffiliatesAdvertisersContent {
  return rawHomeAffAdv as HomeAffiliatesAdvertisersContent
}

export function useHomeDirectAdvertiser(): HomeDirectAdvertiserContent {
  return rawHomeDirect as HomeDirectAdvertiserContent
}

export function useHomeMap(): HomeMapContent {
  return rawHomeMap as HomeMapContent
}

export function useHomeBenefits(): HomeBenefitsContent {
  return rawHomeBenefits as HomeBenefitsContent
}

export function useHomeTestimonials(): HomeTestimonialsContent {
  return rawHomeTestimonials as HomeTestimonialsContent
}

export function useHomeMeetUs(): HomeMeetUsContent {
  return rawHomeMeetUs as HomeMeetUsContent
}

export function useHomeContacts(): HomeContactsContent {
  return rawHomeContacts as HomeContactsContent
}

export function useHomeFaq(): HomeFaqContent {
  return rawHomeFaq as HomeFaqContent
}

export function useHomeVacancies(): HomeVacanciesContent {
  return rawHomeVacancies as HomeVacanciesContent
}

export function useHomeBlog(): HomeBlogContent {
  return rawHomeBlog as HomeBlogContent
}

export function useBlogMeta(): BlogContent {
  return rawBlog as BlogContent
}

export function useArticles(): ArticleDetail[] {
  const raw = rawArticles as { articles: ArticleDetail[] }
  return raw.articles
}

export function getArticleBySlug(slug: string): ArticleDetail | undefined {
  return useArticles().find((article) => article.slug === slug)
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

export function useAffiliatesPage(): AffiliatesPageContent {
  return rawAffiliates as AffiliatesPageContent
}

export function useAdvertisersPage(): AdvertisersPageContent {
  return rawAdvertisers as AdvertisersPageContent
}

export function useCasinos(): CasinoPageContent[] {
  const raw = rawCasinos as { casinos: CasinoPageContent[] }
  return raw.casinos
}

export function getCasinoBySlug(slug: string): CasinoPageContent | undefined {
  return useCasinos().find((casino) => casino.slug === slug)
}

/** Slugs всех casino-страниц — для router beforeEnter/валидации,
 *  чтобы не редиректить на 404 после mount-а уже отрисованного компонента. */
export function getCasinoSlugs(): string[] {
  return useCasinos().map((casino) => casino.slug)
}
