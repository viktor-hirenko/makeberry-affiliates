import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/*
 * Vite минифицирует JS и CSS, но `index.html` отдаёт как есть — комментарии из
 * него уезжают в прод дословно и видны в view-source. Плюс `generate-spa-routes`
 * копирует `dist/index.html` в 20 роутов, так что каждый комментарий
 * тиражируется двадцать раз.
 *
 * Резать в сборке, а не удалять из исходника: пояснение к inline-фону
 * объясняет неочевидный трюк и должно остаться там, где стоит сам трюк.
 *
 * `enforce: 'post'` — чтобы пройти уже после того, как Vite впишет теги
 * бандлов. Регексп забирает и перевод строки с отбивкой перед комментарием,
 * иначе на его месте остаётся пустая строка. Оговорка: он не различает
 * контексты, поэтому последовательность `<!--` внутри inline-скрипта в
 * `index.html` он тоже съест — сейчас таких нет, но при добавлении стоит
 * помнить.
 */
function stripHtmlComments(): Plugin {
  return {
    name: 'strip-html-comments',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/\n?[ \t]*<!--[\s\S]*?-->/g, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), stripHtmlComments()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src/assets/styles/scss')],
      },
    },
  },
  build: {
    /*
     * Vite 8 default cssMinify=lightningcss drops unprefixed `backdrop-filter`
     * when `-webkit-backdrop-filter` is also present → Chrome gets no blur in prod
     * (Safari still works via webkit). esbuild keeps both. See lightningcss#695.
     */
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {
        /*
         * Тяжёлые vendor-библиотеки выносятся в отдельные chunks. На
         * HTTP/2 браузер качает их параллельно с main bundle, что даёт
         * лучшее распределение parsing/execution и долгоживущее кеширование
         * (vendor-чанк не инвалидируется при изменениях прикладного кода).
         *
         * Swiper используется в нескольких home-секциях; выделение в
         * общий chunk избегает дублирования.
         */
        manualChunks(id) {
          if (id.includes('/node_modules/swiper/')) return 'swiper'
          return undefined
        },
      },
    },
  },
})
