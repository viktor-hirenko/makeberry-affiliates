<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import AudienceCta from '@/components/audience/AudienceCta.vue'
import AudienceHero from '@/components/audience/AudienceHero.vue'
import AudienceWhatYouGet from '@/components/audience/AudienceWhatYouGet.vue'
import { getAudienceBySlug } from '@/composables/useContent'

/**
 * Страница-аудитория: `/affiliates` или `/advertisers`.
 *
 * Обе страницы построены по одному шаблону (Hero + What You Get + CTA),
 * отличаются только контентом (тексты, стикеры в карточках). Slug
 * задаётся фиксированным `props` из router'а — поэтому URL остаются
 * чистыми (`/affiliates`, `/advertisers`), а view один.
 *
 * Если slug не найден в `en/pages/affiliates/` (например, опечатка в
 * router config) — replace на `/not-found`, чтобы пользователь не
 * вернулся "Назад" на пустой экран.
 *
 * Паттерн полностью аналогичен `CasinoView` (см. там подробности про
 * single-template, multiple-datasets).
 */
const props = defineProps<{ slug: string }>()
const router = useRouter()

const audience = computed(() => getAudienceBySlug(props.slug))

watch(
  audience,
  (next) => {
    if (!next) router.replace({ name: 'not-found' })
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="audience" class="audience-page">
    <AudienceHero :hero="audience.hero" :slug="audience.slug" />
    <AudienceWhatYouGet
      :title="audience.whatYouGet.title"
      :cards="audience.whatYouGet.cards"
    />
    <AudienceCta :cta="audience.cta" :slug="audience.slug" />
  </div>
</template>

<style scoped lang="scss">
.audience-page {
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
}
</style>
