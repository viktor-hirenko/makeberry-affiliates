<script setup lang="ts">
export interface TabItem {
  id: string
  label: string
}

interface TabGroupProps {
  tabs: TabItem[]
  modelValue: string
  ariaLabel?: string
}

const props = defineProps<TabGroupProps>()

const emit = defineEmits<{
  'update:modelValue': [id: string]
}>()

function selectTab(id: string) {
  if (props.modelValue !== id) emit('update:modelValue', id)
}
</script>

<template>
  <div class="tab-group" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="tab-group__tab"
      :class="{ 'is-active': modelValue === tab.id }"
      :aria-selected="modelValue === tab.id"
      :tabindex="modelValue === tab.id ? 0 : -1"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.tab-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-pill);
}

.tab-group__tab {
  padding: 10px 20px;
  border-radius: var(--radius-pill);
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  &:hover {
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  &.is-active {
    background-color: var(--color-bg-inverted);
    color: var(--color-text-inverted);
  }
}
</style>
