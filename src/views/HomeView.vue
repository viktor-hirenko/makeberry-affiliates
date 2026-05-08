<script setup lang="ts">
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeAffiliatesAdvertisers from '@/components/home/HomeAffiliatesAdvertisers.vue'
import HomeBenefits from '@/components/home/HomeBenefits.vue'
import HomeBlog from '@/components/home/HomeBlog.vue'
import HomeDirectAdvertiser from '@/components/home/HomeDirectAdvertiser.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeContacts from '@/components/home/HomeContacts.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeMap from '@/components/home/HomeMap.vue'
import HomeMeetUs from '@/components/home/HomeMeetUs.vue'
import HomeTestimonials from '@/components/home/HomeTestimonials.vue'
import HomeVacancies from '@/components/home/HomeVacancies.vue'
</script>

<template>
  <article class="home">
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
  </article>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
}
</style>
