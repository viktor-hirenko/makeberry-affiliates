import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
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
