<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <div class="app-root">
    <AppHeader />
    <main class="app-main">
      <div class="app-main__view">
        <RouterView v-slot="{ Component, route: r }">
          <!-- :key только по path: хэш-навигация внутри страницы (например, / → /#contacts)
               не должна ремонтировать текущий view. -->
          <component :is="Component" :key="r.path" />
        </RouterView>
      </div>
    </main>
    <AppFooter v-if="!route.meta.hideFooter" />
  </div>
</template>

<style scoped lang="scss">
/*
 * min-height: 100dvh гарантирует, что слот RouterView занимает минимум
 * один экран. Это резервирует место под целевую страницу на время
 * загрузки lazy route chunk: без резерва AppFooter моментально
 * прижимался бы к AppHeader, пока chunk качается (видно на reload
 * /blog, /article, /casino, /affiliates).
 *
 * dvh (dynamic viewport height) корректно учитывает изменения адресной
 * строки на iOS Safari и Chrome Android; на старых браузерах безопасно
 * деградирует к 100vh через @supports.
 */
.app-main__view {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
