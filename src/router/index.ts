import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Заголовок документа для router.afterEach. */
    title?: string
    /** Скрыть футер на странице (например, на 404). */
    hideFooter?: boolean
    /** Отменить дефолтный padding-top: var(--header-offset) у <main>.
     *  Используется для hero-страниц, где контент должен идти flush
     *  до самого верха viewport (header floating поверх). */
    flushTop?: boolean
  }
}

import HomeView from '@/views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import ArticleView from '@/views/ArticleView.vue'
import AffiliatesView from '@/views/AffiliatesView.vue'
import AdvertisersView from '@/views/AdvertisersView.vue'
import CasinoView from '@/views/CasinoView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { getCasinoBySlug } from '@/composables/useContent'

/* Все views импортируем синхронно — лендинг небольшой, и
 * это устраняет «пустой кадр» (только хедер/футер) при навигации,
 * потому что router-view не ждёт догрузки chunk. */

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Makeberry Affiliates' } },
    { path: '/blog', name: 'blog', component: BlogView, meta: { title: 'Blog' } },
    {
      path: '/blog/:slug',
      name: 'article',
      component: ArticleView,
      meta: { title: 'Article' },
      props: true,
    },
    {
      path: '/affiliates',
      name: 'affiliates',
      component: AffiliatesView,
      meta: { title: 'For Affiliates' },
    },
    {
      path: '/advertisers',
      name: 'advertisers',
      component: AdvertisersView,
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
      meta: { title: 'Page not found', hideFooter: true, flushTop: true },
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
