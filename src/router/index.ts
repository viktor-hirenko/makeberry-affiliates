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

/* HomeView импортируем синхронно — это стартовый маршрут, критичен для LCP.
 * Остальные views — lazy: они не нужны на initial load и выносятся в отдельные
 * чанки, что сокращает initial JS-бандл и ускоряет первый рендер. */
const BlogView = () => import('@/views/BlogView.vue')
const ArticleView = () => import('@/views/ArticleView.vue')
const AudienceView = () => import('@/views/AudienceView.vue')
const CasinoView = () => import('@/views/CasinoView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page not found', hideFooter: true },
    },
  ],
  scrollBehavior(to, from, saved) {
    /* Back/forward — восстанавливаем сохранённую позицию. */
    if (saved) return saved

    /* Якорь (#section) — секции на главной рендерятся через defineAsyncComponent,
     * поэтому элемент с нужным id появляется в DOM с задержкой после перехода.
     * Возвращаем Promise и поллим DOM до ~1.5 с.
     *
     * Переход с другой страницы (напр. /affiliates → /#contacts):
     * — держим viewport сверху, пока якорь не готов;
     * — скролл `auto` (мгновенно), иначе `smooth` прокатывает через Map и др. */
    if (to.hash) {
      const isCrossRoute = to.path !== from.path
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const behavior: 'auto' | 'smooth' =
        isCrossRoute || prefersReducedMotion ? 'auto' : 'smooth'

      return new Promise((resolve) => {
        const MAX_ATTEMPTS = 20
        const INTERVAL_MS = 50

        if (isCrossRoute) {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }

        function tryScroll(attempt: number) {
          const el = document.querySelector<HTMLElement>(to.hash)
          if (el) {
            resolve({ el: to.hash, behavior })
          } else if (attempt < MAX_ATTEMPTS) {
            setTimeout(() => tryScroll(attempt + 1), INTERVAL_MS)
          } else {
            resolve({ top: 0, left: 0 })
          }
        }

        /* На главной между якорями — небольшая пауза под page-fade (250 ms).
         * С другой страницы — сразу, чтобы не показывать промежуточные секции. */
        const startDelayMs = isCrossRoute ? 0 : 280
        if (startDelayMs === 0) {
          tryScroll(0)
        } else {
          setTimeout(() => tryScroll(0), startDelayMs)
        }
      })
    }

    /* Переход на другой маршрут — мгновенно сверху,
     * чтобы пользователь сразу видел начало новой страницы,
     * а не «прокатку» от прежней позиции. */
    return { top: 0, left: 0 }
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
