<script setup lang="ts">
import { ref } from 'vue'
import FAQItem from '@/components/shared/FAQItem.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import type { FaqItem } from '@/types/content'

const props = defineProps<{
  title: string
  items: FaqItem[]
  illustrationSrc?: string
  illustrationAlt?: string
}>()

const openId = ref<string | null>(props.items.find((item) => item.defaultOpen)?.id ?? null)

function handleToggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <section id="faq" class="faq section">
    <div class="faq__inner">
      <aside class="faq__aside">
        <SectionTitle align="left" size="lg">{{ title }}</SectionTitle>
        <img
          v-if="illustrationSrc"
          :src="illustrationSrc"
          :alt="illustrationAlt || ''"
          loading="lazy"
          decoding="async"
        />
      </aside>
      <div class="faq__list">
        <FAQItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :open="openId === item.id"
          @toggle="handleToggle"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/media' as *;

.faq__inner {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--container-pad-desktop);
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 64px;

  @include mq($until: tablet) {
    padding-inline: var(--container-pad-tablet);
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @include mq($until: mobile) {
    padding-inline: var(--container-pad-mobile);
  }
}

.faq__aside {
  display: flex;
  flex-direction: column;
  gap: 32px;

  img {
    max-width: 200px;
    opacity: 0.6;
  }
}

.faq__list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border-default);
}
</style>
