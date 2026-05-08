<script setup lang="ts">
export interface BackgroundBlobsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  intensity?: 'soft' | 'medium' | 'strong'
}

withDefaults(defineProps<BackgroundBlobsProps>(), {
  position: 'top-left',
  intensity: 'medium',
})
</script>

<template>
  <div
    class="background-blobs"
    :class="[`background-blobs--${position}`, `background-blobs--${intensity}`]"
    aria-hidden="true"
  >
    <span class="background-blobs__halo" />
    <span class="background-blobs__core" />
  </div>
</template>

<style scoped lang="scss">
.background-blobs {
  position: absolute;
  pointer-events: none;
  z-index: 0;
  width: 1000px;
  aspect-ratio: 4 / 3;
  filter: blur(20px);
}

.background-blobs__halo,
.background-blobs__core {
  position: absolute;
  border-radius: 50%;
}

.background-blobs__halo {
  inset: 0;
  background: radial-gradient(closest-side, rgba(255, 1, 128, 0.35) 0%, transparent 70%);
}

.background-blobs__core {
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  background: radial-gradient(closest-side, rgba(255, 1, 128, 0.6) 0%, transparent 65%);
}

.background-blobs--soft {
  opacity: 0.5;
}

.background-blobs--strong {
  opacity: 1;
}

.background-blobs--top-left {
  top: -200px;
  left: -300px;
}

.background-blobs--top-right {
  top: -200px;
  right: -300px;
}

.background-blobs--bottom-left {
  bottom: -200px;
  left: -300px;
}

.background-blobs--bottom-right {
  bottom: -200px;
  right: -300px;
}
</style>
