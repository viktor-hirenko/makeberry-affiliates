<script setup lang="ts">
import PageHero from '@/components/page/PageHero.vue'
import { useAffiliatesPage } from '@/composables/useContent'

const page = useAffiliatesPage()
</script>

<template>
  <article class="affiliates-page">
    <PageHero :hero="page.hero" />
  </article>
</template>

<style scoped lang="scss">
.affiliates-page {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
}
</style>
