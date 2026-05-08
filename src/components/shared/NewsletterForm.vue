<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import IconButton from '@/components/ui/IconButton.vue'

interface NewsletterFormProps {
  placeholder: string
  buttonLabel: string
}

const props = defineProps<NewsletterFormProps>()

const email = ref('')
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function submit() {
  if (!email.value) return
  status.value = 'sending'
  try {
    await new Promise((resolve) => setTimeout(resolve, 600))
    status.value = 'success'
    email.value = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="newsletter-form" novalidate @submit.prevent="submit">
    <BaseInput
      v-model="email"
      type="email"
      :placeholder="props.placeholder"
      required
      :aria-label="props.placeholder"
    >
      <template #action>
        <IconButton
          icon="arrow-up-right"
          :label="props.buttonLabel"
          :size="56"
          variant="outline"
          @click="submit"
        />
      </template>
    </BaseInput>
    <p v-if="status === 'success'" class="newsletter-form__status newsletter-form__status--ok">
      Thanks — we’ll be in touch shortly.
    </p>
    <p v-if="status === 'error'" class="newsletter-form__status newsletter-form__status--err">
      Something went wrong. Please try again.
    </p>
  </form>
</template>

<style scoped lang="scss">
.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 560px;
}

.newsletter-form__status {
  margin: 0;
  font-size: 0.875rem;
}

.newsletter-form__status--ok {
  color: #45e1a3;
}

.newsletter-form__status--err {
  color: #ff6464;
}

:deep(.base-input) {
  background-color: var(--color-bg-inverted);
}
</style>
