<script setup lang="ts">
import { computed, useId } from 'vue'

export interface BaseInputProps {
  modelValue: string
  type?: 'text' | 'email' | 'tel' | 'search'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  ariaLabel: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = useId()
const value = computed({
  get: () => props.modelValue,
  set: (next: string) => emit('update:modelValue', next),
})
</script>

<template>
  <div class="base-input">
    <input
      :id="inputId"
      v-model="value"
      class="base-input__field"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :aria-label="ariaLabel || placeholder || undefined"
    />
    <div class="base-input__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--color-bg-inverted);
  color: var(--color-text-inverted);
  border-radius: var(--radius-pill);
  padding: 4px 4px 4px 24px;
  min-height: 56px;
  transition: box-shadow var(--transition-base);

  &:focus-within {
    box-shadow: 0 0 0 2px var(--color-focus-ring);
  }
}

.base-input__field {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  font: inherit;
  color: inherit;
  font-size: 1rem;
  padding-block: 12px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.base-input__action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: 12px;
}
</style>
