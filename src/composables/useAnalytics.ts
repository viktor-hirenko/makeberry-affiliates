/**
 * useAnalytics — GA4 web analytics для Makeberry Affiliates.
 *
 * Подход отличается от iframe-виджета (lootbox):
 *   - Стандартный gtag.js, а не Cloudflare Worker Measurement Protocol.
 *   - send_page_view: false → ручной page_view в router.afterEach (SPA).
 *   - Нет зависимости от FullStory.
 *
 * События уходят сразу в два GA4-ресурса (см. GA_IDS_DEFAULT ниже).
 * VITE_GA_MEASUREMENT_ID переопределяет список целиком, пустое значение
 * переменной — отключает аналитику совсем. VITE_GA_DEBUG=1 включает трекинг
 * вне прода и добавляет debug_mode для GA4 DebugView.
 * Когда аналитика выключена, все функции работают как no-op — ошибок нет.
 */

/*
 * Два получателя одних и тех же событий:
 *   - G-GFQ08LC8YJ — ресурс «Makeberry Affiliates», заведён в DP-14089 вместе
 *     со всей разметкой CTA. Команда смотрит отчёты именно в нём.
 *   - G-HR253V0PJX — ресурс из DP-15355, доступа к нему у нас нет.
 *
 * gtag.js штатно поддерживает несколько получателей: один загрузчик, по
 * `config` на ресурс и `send_to` со списком в каждом событии. Каждый ресурс
 * получает свою копию события, внутри одного ресурса дублирования нет.
 * Порядок важен только для URL загрузчика — берётся первый ID.
 *
 * Measurement ID не секрет: он и так уходит в бандл и в каждый запрос к
 * googletagmanager.com. Держать его только в .env (который в .gitignore) при
 * ручном деплое значит поставить прод-аналитику в зависимость от того, не
 * забыл ли человек создать локальный файл, — а «забыл» выглядит как
 * молчаливое отсутствие данных. Поэтому список зашит в код.
 */
const GA_IDS_DEFAULT = ['G-GFQ08LC8YJ', 'G-HR253V0PJX']

/*
 * VITE_GA_MEASUREMENT_ID переопределяет список целиком — один ID или
 * несколько через запятую. Это выключатель на случай, если понадобится
 * оставить ровно один ресурс: правка одной строки в .env, без правок кода.
 *
 * Именно `??`, а не `||`: пустой VITE_GA_MEASUREMENT_ID= — явный опт-аут
 * (форк, локальный preview), и он должен пережить fallback в пустой список.
 */
const GA_IDS = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? GA_IDS_DEFAULT.join(','))
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)

/*
 * VITE_GA_DEBUG=1 включает аналитику вне прода и добавляет debug_mode — так
 * события видно в GA4 DebugView. Нужен только для ручной проверки.
 */
const GA_DEBUG = import.meta.env.VITE_GA_DEBUG === '1'

/* Локальный dev не должен засорять прод-свойство сессиями с localhost. */
const GA_ENABLED = GA_IDS.length > 0 && (import.meta.env.PROD || GA_DEBUG)

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
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_IDS[0]}`
  script.async = true
  document.head.appendChild(script)

  window.gtag('js', new Date())

  /* По одному config на ресурс — иначе второй получатель не подключится. */
  for (const id of GA_IDS) {
    window.gtag('config', id, {
      send_page_view: false,
      ...(GA_DEBUG ? { debug_mode: true } : {}),
    })
  }
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
    window.gtag('event', eventName, { send_to: GA_IDS, ...params })
  }

  /**
   * Ручной page_view для SPA — вызывается в router.afterEach.
   * Автоматический page_view отключён (send_page_view: false в config).
   */
  function trackPageView(path: string, title: string): void {
    if (!isReady()) return
    window.gtag('event', 'page_view', {
      send_to: GA_IDS,
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
      send_to: GA_IDS,
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
