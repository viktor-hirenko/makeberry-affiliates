export interface NavChildLink {
  label: string
  path: string
  description?: string
}

export interface NavLink {
  label: string
  path?: string
  children?: NavChildLink[]
}

export interface NavConfig {
  logoAlt: string
  ctaLabel: string
  ctaPath: string
  links: NavLink[]
}

export interface FooterColumn {
  title: string
  links: Array<{ label: string; path: string }>
}

export interface FooterSocial {
  network: 'twitter' | 'telegram' | 'linkedin' | 'instagram' | 'email'
  href: string
  label: string
}

/** Логотип партнёра/награды.
 *  Дизайн содержит фиксированные размеры на desktop и mobile, потому что
 *  логотипы у разных партнёров с разными пропорциями. Меняем размеры
 *  на брейкпоинте через style-биндинг. */
export interface FooterPartner {
  id: string
  name: string
  src: string
  alt: string
  width: number
  height: number
  mobileWidth: number
  mobileHeight: number
  href?: string
  /** опциональный radius (в Figma у нескольких партнёров есть rounded бэкграунд). */
  rounded?: boolean
}

export interface FooterAward {
  id: string
  src: string
  alt: string
  width: number
  height: number
  mobileWidth: number
  mobileHeight: number
}

export interface FooterBottomLink {
  label: string
  path: string
}

export interface FooterConfig {
  /** legacy (используется в старом layout-фолбэке, может быть пустым) */
  tagline?: string
  columns: FooterColumn[]
  social: FooterSocial[]
  partners: { label: string; items: FooterPartner[] }
  awards: { label: string; items: FooterAward[] }
  bottomLinks: FooterBottomLink[]
  copyright: string
  /** legacy */
  legal?: string
}

export interface HomeHeroContent {
  titleLineLeft: string
  titleLineBottom: string
  scroll: {
    icon: string
    label: string
    targetId: string
  }
  primaryCta: { label: string; path: string }
  secondaryCta: { label: string; path: string }
  background: {
    desktop: string
    mobile: string
    alt: string
  }
}

/**
 * Home → About Us
 * 8 numbered info-blocks + 1 image-block (показывается только на десктопе).
 * Каждый блок описания собирается из `parts` с inline bold-фрагментами.
 */
export interface HomeAboutTextPart {
  text: string
  bold?: boolean
}

export interface HomeAboutInfoBlock {
  id: string
  parts: HomeAboutTextPart[]
}

export interface HomeAboutImageBlock {
  src: string
  alt: string
}

export interface HomeAboutContent {
  title: string
  blocks: HomeAboutInfoBlock[]
  image: HomeAboutImageBlock
}

/**
 * Home → Affiliates and Advertisers
 * Две карточки с заголовком, описанием, парой CTA и декоративной 3D-иконкой,
 * выходящей за границы карточки (sparkle / cursor).
 */
export interface HomeAffAdvDecoration {
  src: string
  alt: string
}

export interface HomeAffAdvCard {
  id: 'affiliates' | 'advertisers'
  title: string
  description: string
  primaryCta: { label: string; path: string }
  secondaryCta: { label: string; path: string }
  decoration: HomeAffAdvDecoration
}

export interface HomeAffiliatesAdvertisersContent {
  cards: HomeAffAdvCard[]
}

export interface PartnerSlide {
  id: string
  name: string
  logoSrc: string
  logoAlt: string
  href?: string
}

export interface CooperationModelItem {
  id: string
  title: string
  description: string
}

export interface DirectAdvertiserSection {
  title: string
  slides: PartnerSlide[]
  cooperation: CooperationModelItem[]
  cta: { label: string; path: string }
}

/**
 * Home → Direct Advertiser
 * Карточки-партнёры в слайдере (4 видимых на десктопе, 1 на мобайле),
 * 4 модели сотрудничества и CTA "Become a partner".
 *
 * - Регулярная карточка: серый фон, на ховере проявляется розовый градиент.
 * - Карточка `isPlaceholder: true` ("Your brand could be here") — без фона,
 *   с plus-иконкой; ховер-градиента у неё нет.
 */
export interface HomeDirectPartnerCard {
  id: string
  name: string
  logoSrc?: string
  logoAlt?: string
  href?: string
  isPlaceholder?: boolean
  placeholderLabel?: string
}

export interface HomeDirectCooperationItem {
  id: string
  title: string
  description: string
}

export interface HomeDirectAdvertiserContent {
  title: string
  partners: HomeDirectPartnerCard[]
  cooperation: HomeDirectCooperationItem[]
  cta: {
    title: string
    button: { label: string; path: string }
  }
  glow: {
    src: string
    alt: string
  }
}

/**
 * Home → Map ("Our Map")
 * Интерактивная карта мира + табы фильтра по тиру + горизонтальный ряд бейджей
 * с ISO-кодами стран. Бейджи могут переполнять viewport — у ряда horizontal-scroll.
 *
 * Источник правды — `countries[]`: каждая страна имеет ISO-2 код и `tier`.
 * - Tab `all` показывает все страны и подсвечивает их на карте.
 * - Tab `tier-1|2|3` фильтрует и бейджи, и карту.
 *
 * Для интерактива в SVG карты path'ы должны иметь `id="<ISO-2>"`
 * (включить в Figma Preferences → Export → "Include 'id' attribute" перед экспортом).
 * Если id отсутствуют — секция отрисуется без подсветки активных стран.
 */
export type HomeMapTierId = 'tier-1' | 'tier-2' | 'tier-3'

export interface HomeMapTab {
  id: 'all' | HomeMapTierId
  label: string
}

export interface HomeMapCountry {
  /** ISO-3166-1 alpha-2 код страны (uppercase). Должен совпадать с id в SVG. */
  code: string
  /** Полное название (для tooltip / a11y). */
  name: string
  tier: 1 | 2 | 3
  /** Кол-во активных офферов (для tooltip "{N} offers"). */
  offers?: number
}

export interface HomeMapContent {
  title: string
  tabs: HomeMapTab[]
  countries: HomeMapCountry[]
}

/**
 * "Our Benefits" — 8 карточек преимуществ в 3-колоночной сетке.
 * Каждая карточка: pink dot top-right, крупный двузначный номер,
 * заголовок (H5) и описание (Body 2 Regular).
 */
export interface HomeBenefitCard {
  /** Двузначный номер слот в сетке: "01" — "08". */
  number: string
  title: string
  description: string
}

export interface HomeBenefitsContent {
  title: string
  cards: HomeBenefitCard[]
}

/**
 * "Testimonials" — отзывы партнёров. На десктопе центральная карточка
 * активная (полный текст + CTA), боковые — opacity 0.7 + текст до 3 строк.
 * При переключении в центр всегда становится новая карточка.
 */
export interface HomeTestimonialItem {
  /** Имя/название компании автора (Body 1 SemiBold). */
  author: string
  /** Полный текст отзыва (на mobile и для активной карточки). */
  text: string
  /** Optional: путь к аватарке. Если нет — placeholder pill. */
  avatarSrc?: string
  /** Optional: ссылка для CTA arrow-up-right. */
  ctaHref?: string
}

export interface HomeTestimonialsContent {
  title: string
  items: HomeTestimonialItem[]
}

export interface HomeMeetUsTag {
  label: string
  outlined?: boolean
}

export interface HomeMeetUsItem {
  id: string
  name: string
  logoSrc: string
  logoAlt?: string
  logoWidth: number
  logoHeight: number
  bgColor: string
  tags: HomeMeetUsTag[]
}

export interface HomeMeetUsContent {
  title: string
  items: HomeMeetUsItem[]
}

export type HomeContactSocialType = 'telegram' | 'email'

export interface HomeContactSocial {
  type: HomeContactSocialType
  href: string
  label?: string
}

export interface HomeContactItem {
  id: string
  name: string
  position: string
  photoSrc: string
  photoAlt?: string
  photoObjectPosition?: string
  socials: HomeContactSocial[]
  /** Lowercase tokens used by the verify form. Examples: '@valentyn', 'val@makeberry.com'. */
  verifyTokens: string[]
}

export interface HomeContactsForm {
  title: string
  subtitle: string
  placeholder: string
  buttonLabel: string
  verifiedLabel: string
  errorLabel: string
}

export interface HomeContactsContent {
  title: string
  glow: { src: string; alt: string }
  items: HomeContactItem[]
  form: HomeContactsForm
}

export interface HomeFaqItem {
  id: string
  question: string
  answer: string
}

export interface HomeFaqContent {
  title: string
  glow: { src: string; alt: string }
  questionMark: { src: string; alt: string }
  items: HomeFaqItem[]
  /** id первого вопроса, открытого по умолчанию */
  defaultOpenId?: string
}

/* ----------------------------------------------------------------
 * Home — Open Vacancies
 * ---------------------------------------------------------------- */

export interface HomeVacancyCard {
  id: string
  /** Бейдж типа занятости/локации, например "Remote" */
  type: string
  title: string
  description: string
  learnMoreLabel: string
  learnMoreHref: string
}

export interface HomeVacanciesContent {
  title: string
  glow: { src: string; alt: string }
  target: { src: string; alt: string }
  cards: HomeVacancyCard[]
  viewAll: { label: string; href: string }
}

/* ----------------------------------------------------------------
 * Home — Blog
 *
 * Карточки берём напрямую из общего articles.json (первые 3),
 * чтобы slug/excerpt/image совпадали со страницей блога.
 * Тут только заголовок секции и кнопка "View All".
 * ---------------------------------------------------------------- */

export interface HomeBlogContent {
  title: string
  viewAll: { label: string; href: string }
}

export interface VacancyCard {
  id: string
  type: string
  title: string
  description: string
  learnMoreHref: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role?: string
  avatarSrc?: string
  avatarAlt?: string
  featured?: boolean
}

export interface ConferenceEvent {
  id: string
  name: string
  logoSrc: string
  logoAlt: string
  dateLabel: string
  locationLabels: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  photoSrc: string
  photoAlt: string
  linkedin?: string
  telegram?: string
}

/**
 * Декоративный бейдж в шапке Blog page (Figma 2433:1793).
 * Бейджи разбросаны вокруг заголовка "Blog" со случайными rotate.
 * Это НЕ интерактивные фильтры — просто визуальное украшение.
 */
export interface BlogHeaderBadge {
  id: string
  label: string
  /** brand-fill = розовый bg, white текст; outlined-white = чёрный bg, белый бордер; outlined-brand = чёрный bg, розовый бордер */
  variant: 'brand-fill' | 'outlined-white' | 'outlined-brand'
  /** угол наклона в градусах */
  rotate: number
  /** оффсет от центра по горизонтали (px), для абсолютного позиционирования вокруг заголовка */
  offsetX: number
  /** оффсет от верха хедера (px) */
  offsetY: number
}

export interface BlogContent {
  title: string
  badges: BlogHeaderBadge[]
  loadMoreLabel: string
  glow: {
    leftSrc: string
    rightSrc: string
    alt: string
  }
}

export interface ArticleSummary {
  slug: string
  /** legacy single category — оставлено для обратной совместимости */
  category?: string
  title: string
  excerpt: string
  imageSrc: string
  imageAlt: string
  date?: string
}

export interface ArticleSection {
  id: string
  /** title H4 32/40 medium */
  title?: string
  /** rich html: paragraphs (`<p>`), inline links (`<a>`), inline bold (`<strong>`) */
  bodyHtml?: string
  /** legacy: single image (deprecated, use images) */
  imageSrc?: string
  imageAlt?: string
  /** image-row: 1+ изображения в ряд (на mobile складываются вертикально) */
  images?: Array<{ src: string; alt: string }>
  /** vложенные блоки: subsection title 16/24 medium + bullet list */
  subsections?: ArticleSubsection[]
}

export interface ArticleSubsection {
  id: string
  title?: string
  /** rich html: list items (`<ul><li>`) или paragraphs */
  bodyHtml?: string
}

export interface ArticleDetail extends ArticleSummary {
  tags: string[]
  heroImageSrc: string
  heroImageAlt: string
  introHtml: string
  sections: ArticleSection[]
}

export interface PageHeroBlock {
  badge?: string
  titleHtml: string
  subtitleHtml: string
  cta?: { label: string; path: string }
}

export interface WhatYouGetCard {
  id: string
  title: string
  descriptionHtml: string
  illustrationSrc?: string
  illustrationAlt?: string
}

export interface AffiliatesPageContent {
  hero: PageHeroBlock
  whatYouGet: { title: string; badge?: string; cards: WhatYouGetCard[] }
  cta: { titleHtml: string; button: { label: string; path: string } }
}

/* ----------------------------------------------------------------
 * Casino direct-advertiser pages (WinSpirit / RocketPlay / LuckyHills)
 *
 * Single template, three datasets. Все три страницы построены по одному
 * макету — отличаются только контент и логотип (Figma:
 *   - WinSpirit  3819:3932 / mobile 3821:7616
 *   - RocketPlay 3861:21093 / mobile 3861:21784
 *   - LuckyHills 3861:23209 / mobile 3861:23315
 * ).
 * ---------------------------------------------------------------- */

/** Один из трёх блоков статистики в hero (01 / 02 / 03). */
export interface CasinoHeroStat {
  /** Двузначный номер ("01" — "03"), отображается крупно. */
  number: string
  /** SemiBold-фрагмент (первая часть подписи). */
  titleStrong: string
  /** Regular-фрагмент (продолжение, может быть пустой строкой). */
  titleRest?: string
}

export interface CasinoHero {
  /** Бренд-название казино — Headline H2 на десктопе, H4 на мобайле. */
  title: string
  /** Лидирующее описание Body 1 Regular. */
  intro: string
  /** Логотип бренда — растровый или векторный, рендерится в квадрате 280/130. */
  logo: { src: string; alt: string }
  stats: CasinoHeroStat[]
  cta: { label: string; href: string }
}

/**
 * Вариант стилизации плавающего бейджа в about-секции.
 * - `brand-fill`: розовый фон + белый текст (1 на секцию, ключевая фишка).
 * - `outlined-brand`: чёрный фон + розовая обводка (вспомогательный).
 * - `outlined-bold`: чёрный фон + белая обводка (третий по приоритету).
 */
export type CasinoAboutBadgeVariant = 'brand-fill' | 'outlined-brand' | 'outlined-bold'

/**
 * Плавающий бейдж в about-секции.
 * Desktop: `top` / `right` в rem, позиционируются относительно `__inner` (1440 frame).
 * Mobile:  `mobileTop` / `mobileLeft` в rem, позиционируются относительно `__inner`
 *           (Figma 360 frame — узел 3821:7879, координаты badges относительно Text-div
 *           + смещение на `py-190` секции).
 * `rotate` — угол наклона в градусах (одинаков для обоих брейкпоинтов).
 */
export interface CasinoAboutBadge {
  id: string
  label: string
  variant: CasinoAboutBadgeVariant
  rotate: number
  /** Desktop: rem от верхнего края __inner */
  top: number
  /** Desktop: rem от правого края __inner */
  right: number
  /** Mobile: rem от верхнего края __inner */
  mobileTop: number
  /** Mobile: rem от левого края __inner */
  mobileLeft: number
}

/** Часть параграфа: Regular по умолчанию, `strong: true` — белый/полужирный акцент. */
export interface CasinoAboutTextPart {
  text: string
  strong?: boolean
}

export interface CasinoAboutParagraph {
  id: string
  parts: CasinoAboutTextPart[]
}

export interface CasinoAboutContent {
  paragraphs: CasinoAboutParagraph[]
  badges: CasinoAboutBadge[]
}

/**
 * Карточка в "Key Highlights" — pink-bordered pill заголовок поверх
 * surface-карточки c body-описанием. На десктопе 3 колонки, на мобайле колонка.
 */
export interface CasinoKeyHighlightCard {
  id: string
  title: string
  description: string
}

export interface CasinoKeyHighlightsContent {
  title: string
  /** Декоративная sparkle-иконка справа от заголовка (только desktop). */
  decoration: { src: string; alt: string }
  cards: CasinoKeyHighlightCard[]
}

/**
 * Карточка в "Payments & Withdrawals" — заголовок + 1px divider + bullet list.
 * Каждый item — строка с описанием платёжной группы.
 */
export interface CasinoPaymentList {
  id: string
  title: string
  items: string[]
}

export interface CasinoPaymentsContent {
  title: string
  /** Розовый glow слева вверху секции. */
  glow: { src: string; alt: string }
  lists: CasinoPaymentList[]
}

/**
 * Карточка в "Cooperation Models" — pink-bordered pill заголовок +
 * многострочное описание. На десктопе 4 колонки, на мобайле колонка.
 * `lines` — каждый параграф рендерится отдельным `<p>`.
 */
export interface CasinoCooperationModel {
  id: string
  title: string
  lines: string[]
}

export interface CasinoCooperationContent {
  title: string
  models: CasinoCooperationModel[]
}

/**
 * Финальная CTA-секция: "As a direct advertiser..." + 2 кнопки.
 * Большой rotated glow в правой части.
 */
export interface CasinoBottomCtaButton {
  label: string
  href: string
  variant: 'primary' | 'tetriary'
  /** Внешняя ссылка → откроется в новой вкладке (через `<a target="_blank">`). */
  external?: boolean
}

export interface CasinoBottomCtaContent {
  /** Первая часть текста (белый акцент). */
  textPrimary: string
  /** Вторая часть текста (text-tertiary, основное продолжение фразы). */
  textSecondary: string
  glow: { src: string; alt: string }
  buttons: CasinoBottomCtaButton[]
}

export interface CasinoPageContent {
  slug: string
  name: string
  hero: CasinoHero
  about: CasinoAboutContent
  keyHighlights: CasinoKeyHighlightsContent
  payments: CasinoPaymentsContent
  cooperation: CasinoCooperationContent
  bottomCta: CasinoBottomCtaContent
}
