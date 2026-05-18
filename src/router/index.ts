import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Заголовок документа для router.afterEach. */
    title?: string
    /** Скрыть футер на странице (например, на 404). */
    hideFooter?: boolean
  }
}

import HomeView from '@/views/HomeView.vue'
import { getCasinoBySlug } from '@/composables/useContent'

/* HomeView импортируется синхронно — это стартовый маршрут, критичен для LCP.
 * Остальные views — lazy, чтобы initial JS bundle оставался компактным;
 * chunks дополнительно prefetch'атся по hover/touch на RouterLink
 * (см. useRoutePrefetch), поэтому к моменту клика обычно уже в кэше. */
const BlogView = () => import('@/views/BlogView.vue')
const TermsView = () => import('@/views/TermsView.vue')
const PrivacyView = () => import('@/views/PrivacyView.vue')
const ArticleView = () => import('@/views/ArticleView.vue')
const AudienceView = () => import('@/views/AudienceView.vue')
const CasinoView = () => import('@/views/CasinoView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* R2 r2.dev отдаёт index.html только по /index.html; без редиректа Vue видит
     * чужой path и не находит home (чёрный экран / 404). */
    { path: '/index.html', redirect: '/' },
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Makeberry Affiliates' } },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: { title: 'Blog' },
    },
    {
      path: '/blog/:slug',
      name: 'article',
      component: ArticleView,
      meta: { title: 'Article' },
      props: true,
    },
    /* Audience pages: `/affiliates` и `/advertisers` шарят один шаблон
     * (AudienceView) и разные датасеты в `en/pages/affiliates/*.json`. Slug
     * фиксированный (приходит через `props`), а не из URL — оставляем
     * чистые маршруты для SEO и совместимости со ссылками из навигации. */
    {
      path: '/affiliates',
      name: 'affiliates',
      component: AudienceView,
      props: { slug: 'affiliates' },
      meta: { title: 'For Affiliates' },
    },
    {
      path: '/advertisers',
      name: 'advertisers',
      component: AudienceView,
      props: { slug: 'advertisers' },
      meta: { title: 'For Advertisers' },
    },
    {
      path: '/casino/:slug',
      name: 'casino',
      component: CasinoView,
      /* beforeEnter — валидируем slug сразу, чтобы при невалидном URL
       * пользователь сразу попадал на 404 без монтирования Casino-компонента
       * и без мгновенной перерисовки. Также подменяем title на имя казино. */
      meta: { title: 'Casino' },
      props: true,
      beforeEnter: (to, _from, next) => {
        const slug = String(to.params.slug ?? '')
        const casino = getCasinoBySlug(slug)
        if (!casino) return next({ name: 'not-found' })
        to.meta.title = casino.name
        return next()
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: { title: 'Terms and Conditions' },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
      meta: { title: 'Privacy Policy' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page not found', hideFooter: true },
    },
  ],
  scrollBehavior(to, from, saved) {
    /* Back / forward — возвращаем браузерную сохранённую позицию. */
    if (saved) return saved

    /* Hash-навигация (#section).
     *
     * Внутри одной страницы (/ → /#contacts) — мгновенный smooth scroll.
     * При переходе с другого маршрута (/affiliates → /#contacts) сначала
     * прижимаем viewport к верху, затем скроллим к якорю с поведением
     * `auto`, чтобы не было видимой «прокатки» через промежуточные секции. */
    if (to.hash) {
      const isCrossRoute = to.path !== from.path
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const behavior: 'auto' | 'smooth' =
        isCrossRoute || prefersReducedMotion ? 'auto' : 'smooth'

      if (isCrossRoute) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }

      return { el: to.hash, behavior }
    }

    /* Cross-route без хэша: сразу сбрасываем scroll (иначе с длинной главной
     * короткая /blog/:slug на один кадр рисуется «снизу» — футер у hero).
     * Двойной rAF — дублируем top:0 после mount нового view. */
    const isCrossRoute = to.path !== from.path

    if (isCrossRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve({ top: 0, left: 0 }))
      })
    })
  },
})

router.afterEach((to) => {
  const raw = to.meta.title
  const title =
    typeof raw === 'string'
      ? raw === 'Makeberry Affiliates'
        ? raw
        : `${raw} — Makeberry Affiliates`
      : 'Makeberry Affiliates'
  document.title = title
})

export default router
