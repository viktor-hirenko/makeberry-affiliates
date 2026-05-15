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
  scrollBehavior(to, _from, saved) {
    /* Back/forward — восстанавливаем сохранённую позицию. */
    if (saved) return saved
    /* Якорь внутри страницы (#section) — плавно скроллим к нему. */
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
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
