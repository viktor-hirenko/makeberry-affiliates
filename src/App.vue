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
      <!-- Обёртка flex:1 — при mode=out-in между leave и enter слот кратко пустой; без flex:1 main мог бы схлопнуться -->
      <div class="app-main__view">
        <RouterView v-slot="{ Component, route }">
          <!-- out-in: нет одновременно двух full-page в DOM → не «просвечивает» список блога под статьёй -->
          <!-- leave: 0 — старый view не «полупрозрачно висит»; enter — мягко появляется новый -->
          <Transition name="page-fade" mode="out-in" :duration="{ enter: 250, leave: 0 }">
            <!-- Ключ только по path (без hash): переход / → /#contacts не перемонтирует
                 HomeView — иначе хэш-навигация внутри главной вызывала бы полный remount. -->
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </main>
    <AppFooter v-if="!route.meta.hideFooter" />
  </div>
</template>

<style scoped>
.app-main__view {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style>
/*
 * Enter совпадает с :duration enter (250). Leave мгновенный — без полупрозрачного наложения двух маршрутов.
 */
.page-fade-enter-active {
  transition: opacity 250ms ease;
}

.page-fade-enter-from {
  opacity: 0;
}

.page-fade-leave-active {
  transition: none;
}

.page-fade-leave-to {
  opacity: 0;
}
</style>
