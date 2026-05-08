<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import CasinoAbout from '@/components/casino/CasinoAbout.vue'
import CasinoBottomCta from '@/components/casino/CasinoBottomCta.vue'
import CasinoCooperation from '@/components/casino/CasinoCooperation.vue'
import CasinoHero from '@/components/casino/CasinoHero.vue'
import CasinoKeyHighlights from '@/components/casino/CasinoKeyHighlights.vue'
import CasinoPayments from '@/components/casino/CasinoPayments.vue'
import { getCasinoBySlug } from '@/composables/useContent'

/**
 * Casino direct-advertiser landing.
 *
 * Маршрут: `/casino/:slug` (slug ∈ winspirit | rocketplay | luckyhills).
 * Контент берётся из `casinos.json` через `getCasinoBySlug`. Если slug
 * неизвестен — редиректим на `/not-found` (используем replace,
 * чтобы пользователь не вернулся "Назад" обратно на пустую страницу).
 *
 * Все секции реализованы как пер-секционные компоненты в
 * `src/components/casino/*` и принимают на вход уже типизированные
 * структуры. CasinoView отвечает только за композицию и роутинг.
 */
const props = defineProps<{ slug: string }>()
const router = useRouter()

const casino = computed(() => getCasinoBySlug(props.slug))

watch(
  casino,
  (next) => {
    if (!next) router.replace({ name: 'not-found' })
  },
  { immediate: true },
)
</script>

<template>
  <article v-if="casino" class="casino-page">
    <CasinoHero :hero="casino.hero" />
    <CasinoAbout :about="casino.about" />
    <CasinoKeyHighlights :content="casino.keyHighlights" />
    <CasinoPayments :content="casino.payments" />
    <CasinoCooperation :content="casino.cooperation" />
    <CasinoBottomCta :content="casino.bottomCta" />
  </article>
</template>

<style scoped lang="scss">
.casino-page {
  display: flex;
  flex-direction: column;
}
</style>
