<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

/* HomeHero — синхронный, это LCP-элемент; должен рендериться сразу. */
import HomeHero from '@/components/home/HomeHero.vue'

/* Все below-the-fold секции — async: выносятся в отдельные чанки,
 * чтобы Swiper и другие тяжёлые зависимости не попадали в initial bundle. */
const HomeAbout = defineAsyncComponent(() => import('@/components/home/HomeAbout.vue'))
const HomeAffiliatesAdvertisers = defineAsyncComponent(
  () => import('@/components/home/HomeAffiliatesAdvertisers.vue'),
)
const HomeDirectAdvertiser = defineAsyncComponent(
  () => import('@/components/home/HomeDirectAdvertiser.vue'),
)
const HomeMap = defineAsyncComponent(() => import('@/components/home/HomeMap.vue'))
const HomeBenefits = defineAsyncComponent(() => import('@/components/home/HomeBenefits.vue'))
const HomeTestimonials = defineAsyncComponent(
  () => import('@/components/home/HomeTestimonials.vue'),
)
const HomeMeetUs = defineAsyncComponent(() => import('@/components/home/HomeMeetUs.vue'))
const HomeContacts = defineAsyncComponent(() => import('@/components/home/HomeContacts.vue'))
const HomeFaq = defineAsyncComponent(() => import('@/components/home/HomeFaq.vue'))
const HomeVacancies = defineAsyncComponent(() => import('@/components/home/HomeVacancies.vue'))
const HomeBlog = defineAsyncComponent(() => import('@/components/home/HomeBlog.vue'))
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeAbout />
    <HomeAffiliatesAdvertisers />
    <HomeDirectAdvertiser />
    <HomeMap />
    <HomeBenefits />
    <HomeTestimonials />
    <HomeMeetUs />
    <HomeContacts />
    <HomeFaq />
    <HomeVacancies />
    <HomeBlog />
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
}
</style>
