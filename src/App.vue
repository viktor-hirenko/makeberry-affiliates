<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <div class="app-root">
    <AppHeader />
    <main class="app-main" :class="{ 'app-main--flush': route.meta.flushTop }">
      <!-- Никаких <Transition> — иначе при out-in между unmount старой
           и mount новой страницы <main> пустеет, footer прыгает под header,
           и пользователь успевает увидеть «промежуточный кадр» (header + footer
           без контента). Для лендинга мгновенная навигация выглядит лучше. -->
      <RouterView />
    </main>
    <AppFooter v-if="!route.meta.hideFooter" />
  </div>
</template>
