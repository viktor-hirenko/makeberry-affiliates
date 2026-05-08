<script setup lang="ts">
interface BaseIconProps {
  name: string
  size?: number
}

const props = withDefaults(defineProps<BaseIconProps>(), {
  size: 24,
})
</script>

<template>
  <svg
    class="base-icon"
    :width="props.size"
    :height="props.size"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="`/icons/sprite.svg#icon-${props.name}`" />
  </svg>
</template>

<style scoped lang="scss">
.base-icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
  color: currentcolor;
}
</style>
