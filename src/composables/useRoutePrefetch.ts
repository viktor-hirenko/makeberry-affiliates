import type { Router } from 'vue-router'

/**
 * Глобальный prefetch lazy-route chunks по hover/touch на внутренних
 * ссылках. К моменту клика chunk обычно уже в браузерном кэше, и mount
 * нового view происходит без задержки на сетевой запрос.
 *
 * Как работает:
 *   1. Один document-level listener в capture-фазе обрабатывает все ссылки
 *      приложения (`pointerover` для desktop/pen, `touchstart` для mobile).
 *   2. Находит ближайший <a href="/..."> к event target.
 *   3. Резолвит href через router и для каждого matched record вызывает
 *      lazy-функцию компонента (`() => import(...)`). Запрос идёт через
 *      обычный module loader Vite/Rollup и шарит chunk-cache с навигацией.
 *   4. Set<string> исключает повторные запросы для уже prefetched путей.
 *
 * Альтернативный подход через `<link rel="modulepreload">` потребовал бы
 * знание сгенерированных Vite-ом chunk URL заранее; прямой `import()`
 * проще, типобезопасен и работает в dev/prod одинаково.
 */
export function setupRoutePrefetch(router: Router): void {
  const prefetched = new Set<string>()

  function prefetch(path: string): void {
    if (prefetched.has(path)) return
    prefetched.add(path)

    try {
      const resolved = router.resolve(path)
      for (const record of resolved.matched) {
        const components = record.components
        if (!components) continue
        for (const component of Object.values(components)) {
          if (typeof component === 'function') {
            ;(component as () => Promise<unknown>)().catch(() => {
              /* при ошибке загрузки разрешаем повторную попытку */
              prefetched.delete(path)
            })
          }
        }
      }
    } catch {
      prefetched.delete(path)
    }
  }

  function extractInternalHref(target: EventTarget | null): string | null {
    if (!(target instanceof Element)) return null
    const link = target.closest<HTMLAnchorElement>('a[href]')
    if (!link) return null

    const href = link.getAttribute('href')
    if (!href) return null

    /* Только относительные пути нашего SPA. Внешние, mailto, tel, hash-only — пропускаем. */
    if (!href.startsWith('/') || href.startsWith('//')) return null
    if (link.target === '_blank') return null
    if (link.hasAttribute('download')) return null

    return href
  }

  function onPointer(event: Event): void {
    const href = extractInternalHref(event.target)
    if (href) prefetch(href)
  }

  /*
   * capture: true — событие приходит до того, как любой child может его остановить.
   * passive: true — не блокируем scroll/touch handling.
   */
  document.addEventListener('pointerover', onPointer, { capture: true, passive: true })
  document.addEventListener('touchstart', onPointer, { capture: true, passive: true })
}
