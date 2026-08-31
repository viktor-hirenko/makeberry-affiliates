/**
 * useAnalytics — GA4 web analytics для Makeberry Affiliates.
 *
 * Подход отличается от iframe-виджета (lootbox):
 *   - Стандартный gtag.js, а не Cloudflare Worker Measurement Protocol.
 *   - send_page_view: false → ручной page_view в router.afterEach (SPA).
 *   - Нет зависимости от FullStory.
 *
 * Прод-ID зашит дефолтом ниже. VITE_GA_MEASUREMENT_ID переопределяет его,
 * пустое значение переменной — отключает аналитику совсем. VITE_GA_DEBUG=1
 * включает трекинг вне прода и добавляет debug_mode для GA4 DebugView.
 * Когда аналитика выключена, все функции работают как no-op — ошибок нет.
 */

/*
 * Measurement ID не секрет: он уходит в клиентский бандл и в каждый запрос к
 * googletagmanager.com. Держать его в .env (который в .gitignore) при ручном
 * деплое значит поставить прод-аналитику в зависимость от того, не забыл ли
 * человек создать локальный файл — а «забыл» выглядит как молчаливое отсутствие
 * данных в GA4. Поэтому реальный ID — дефолт в коде, а env остаётся способом
 * переопределить его.
 *
 * Именно `??`, а не `||`: пустой VITE_GA_MEASUREMENT_ID= — это явный опт-аут
 * (форк, локальный preview), и он должен пережить fallback.
 */
const GA_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? 'G-HR253V0PJX').trim()

/*
 * VITE_GA_DEBUG=1 включает аналитику вне прода и добавляет debug_mode — так
 * события видно в GA4 DebugView. Нужен только для ручной проверки.
 */
const GA_DEBUG = import.meta.env.VITE_GA_DEBUG === '1'

/* Локальный dev не должен засорять прод-свойство сессиями с localhost. */
const GA_ENABLED = !!GA_ID && (import.meta.env.PROD || GA_DEBUG)

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

let _initialized = false

/**
 * Инициализирует gtag.js и настраивает GA4.
 * Должна вызываться один раз в main.ts до mount.
 */
export function initGA(): void {
  if (_initialized || !GA_ENABLED || typeof window === 'undefined') return
  _initialized = true

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', GA_ID, {
    send_page_view: false,
    ...(GA_DEBUG ? { debug_mode: true } : {}),
  })
}

/** Классификация ссылок для параметра link_type. */
export type CtaLinkType =
  | 'login'
  | 'sign_up_affiliate'
  | 'sign_up_brand'
  | 'casino'
  | 'external'
  | 'internal'
  | 'mailto'
  | 'telegram'

/**
 * Автоматически определяет тип ссылки по href.
 * Используется в BaseButton и других компонентах с внешними ссылками.
 */
export function classifyLinkType(href: string | undefined): CtaLinkType {
  if (!href) return 'internal'
  if (/^mailto:/i.test(href)) return 'mailto'
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(href)) return 'telegram'
  if (/dashboard\.makeberry\.com\/login|mbaffiliates\.makeberry\.com\/login/i.test(href))
    return 'login'
  if (
    /dashboard\.makeberry\.com\/signup\/affiliate|mbaffiliates\.makeberry\.com\/signup\/affiliate/i.test(
      href,
    )
  )
    return 'sign_up_affiliate'
  if (/dashboard\.makeberry\.com\/signup\/brand/i.test(href)) return 'sign_up_brand'
  if (/rocketplaypartners\.com|winspirit\.com|luckyhills\.com/i.test(href)) return 'casino'
  if (/^https?:\/\//i.test(href)) return 'external'
  return 'internal'
}

export interface CtaClickParams {
  /** Секция страницы, откуда пришёл клик (e.g. 'header', 'home_hero'). */
  cta_location: string
  /** Видимый текст кнопки или ссылки. */
  cta_label: string
  /** Конечный URL или route-path. */
  link_url?: string
  link_type?: CtaLinkType
  page_path?: string
  page_title?: string
  /** Хост внешнего домена (e.g. 'dashboard.makeberry.com'). */
  target_domain?: string
}

export function useAnalytics() {
  function isReady(): boolean {
    return _initialized && GA_ENABLED
  }

  /** Универсальная отправка GA4-события. */
  function trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (!isReady()) return
    window.gtag('event', eventName, { send_to: GA_ID, ...params })
  }

  /**
   * Ручной page_view для SPA — вызывается в router.afterEach.
   * Автоматический page_view отключён (send_page_view: false в config).
   */
  function trackPageView(path: string, title: string): void {
    if (!isReady()) return
    window.gtag('event', 'page_view', {
      send_to: GA_ID,
      page_path: path,
      page_title: title,
      page_location: window.location.href,
    })
  }

  /**
   * Трекинг клика по CTA.
   * Для ключевых конверсий дополнительно отправляет специализированное событие:
   * sign_up_affiliate_click, sign_up_brand_click или login_click.
   */
  function trackCtaClick(params: CtaClickParams): void {
    if (!isReady()) return

    const enriched: Record<string, unknown> = {
      send_to: GA_ID,
      transport_type: 'beacon',
      ...params,
      page_path: params.page_path ?? window.location.pathname,
      page_title: params.page_title ?? document.title,
    }

    window.gtag('event', 'cta_click', enriched)

    if (params.link_type === 'sign_up_affiliate') {
      window.gtag('event', 'sign_up_affiliate_click', enriched)
    } else if (params.link_type === 'sign_up_brand') {
      window.gtag('event', 'sign_up_brand_click', enriched)
    } else if (params.link_type === 'login') {
      window.gtag('event', 'login_click', enriched)
    }
  }

  return { trackEvent, trackPageView, trackCtaClick }
}
