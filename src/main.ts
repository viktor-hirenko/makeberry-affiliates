import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupRoutePrefetch } from '@/composables/useRoutePrefetch'
import '@/assets/styles/main.scss'

/*
 * Управление scroll-позицией — целиком на стороне Vue Router (см.
 * scrollBehavior в src/router/index.ts). Отключаем браузерное
 * автоматическое восстановление, чтобы reload всегда открывал страницу
 * сверху и не было конфликта с навигационным scrollBehavior'ом.
 *
 * Back/forward навигация продолжает работать корректно: scrollBehavior
 * сам обрабатывает savedPosition.
 */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const app = createApp(App)
app.use(router)

/* Prefetch lazy route chunks по hover/touch — снимает задержку загрузки
 * chunk-а при клике на RouterLink (см. useRoutePrefetch). */
setupRoutePrefetch(router)

app.mount('#app')

/* Страховка для браузеров, которые не уважают scrollRestoration = 'manual'
 * до первого user gesture. */
window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
