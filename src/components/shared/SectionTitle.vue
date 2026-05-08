<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'

export interface SectionTitleProps {
  badge?: string
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<SectionTitleProps>(), {
  align: 'left',
  size: 'md',
})
</script>

<template>
  <div class="section-title" :class="[`section-title--${align}`, `section-title--${size}`]">
    <h2 class="section-title__heading">
      <slot />
      <Badge v-if="badge" variant="brand" size="sm" class="section-title__badge">{{ badge }}</Badge>
    </h2>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  display: flex;
}

.section-title__heading {
  margin: 0;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.125;
}

.section-title__badge {
  align-self: flex-start;
  margin-top: 4px;
}

.section-title--left {
  justify-content: flex-start;
}

.section-title--center {
  justify-content: center;

  .section-title__heading {
    justify-content: center;
    text-align: center;
  }
}

.section-title--sm .section-title__heading {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.section-title--md .section-title__heading {
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-title--lg .section-title__heading {
  font-size: clamp(2.5rem, 6vw, 4rem);
}
</style>
