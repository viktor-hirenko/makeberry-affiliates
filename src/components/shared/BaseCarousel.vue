<script setup lang="ts" generic="T">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import type { Swiper as SwiperClass, SwiperOptions } from 'swiper/types'
import IconButton from '@/components/ui/IconButton.vue'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface BaseCarouselProps {
  items: T[]
  options?: SwiperOptions
  showArrows?: boolean
  showPagination?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<BaseCarouselProps>(), {
  options: () => ({}),
  showArrows: true,
  showPagination: false,
  ariaLabel: 'Carousel',
})

const swiperInstance = ref<SwiperClass | null>(null)
const isBeginning = ref(true)
const isEnd = ref(false)

function onSwiper(swiper: SwiperClass) {
  swiperInstance.value = swiper
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
}

function onSlideChange(swiper: SwiperClass) {
  isBeginning.value = swiper.isBeginning
  isEnd.value = swiper.isEnd
}

function prev() {
  swiperInstance.value?.slidePrev()
}

function next() {
  swiperInstance.value?.slideNext()
}
</script>

<template>
  <div class="base-carousel" role="region" :aria-label="ariaLabel">
    <Swiper
      :modules="[Navigation, Pagination, A11y]"
      :slides-per-view="props.options?.slidesPerView ?? 'auto'"
      :space-between="props.options?.spaceBetween ?? 24"
      :loop="props.options?.loop ?? false"
      :speed="props.options?.speed ?? 500"
      :breakpoints="props.options?.breakpoints"
      :pagination="props.showPagination ? { clickable: true } : false"
      :a11y="{ enabled: true }"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide v-for="(item, index) in items" :key="(item as { id?: string })?.id ?? index">
        <slot :item="item" :index="index" />
      </SwiperSlide>
    </Swiper>

    <div v-if="showArrows" class="base-carousel__nav">
      <IconButton
        icon="arrow-down-left"
        label="Previous slide"
        :size="56"
        variant="outline"
        :disabled="isBeginning"
        @click="prev"
      />
      <IconButton
        icon="arrow-up-right"
        label="Next slide"
        :size="56"
        variant="outline"
        :disabled="isEnd"
        @click="next"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-carousel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.base-carousel__nav {
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: flex-end;
}

:deep(.swiper) {
  width: 100%;
  overflow: visible;
}

:deep(.swiper-pagination) {
  position: relative;
  margin-top: 24px;
}

:deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.25);
  opacity: 1;
  width: 8px;
  height: 8px;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--color-brand);
  width: 24px;
  border-radius: var(--radius-pill);
}
</style>
