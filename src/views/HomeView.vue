<script setup lang="ts">
/*
 * Все секции главной импортируются синхронно. Это обеспечивает:
 *   — фиксированную page height с первого кадра (CLS = 0),
 *   — стабильную работу scroll-restoration и hash-навигации,
 *   — отсутствие layout-сдвигов при reload в любой точке страницы.
 *
 * Тяжёлые vendor-зависимости секций (Swiper) вынесены в отдельный
 * chunk через `manualChunks` в vite.config.ts и загружаются параллельно
 * с main bundle — initial JS остаётся компактным.
 */
import HomeHero from '@/components/home/HomeHero.vue'
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeAffiliatesAdvertisers from '@/components/home/HomeAffiliatesAdvertisers.vue'
import HomeDirectAdvertiser from '@/components/home/HomeDirectAdvertiser.vue'
import HomeMap from '@/components/home/HomeMap.vue'
import HomeBenefits from '@/components/home/HomeBenefits.vue'
import HomeTestimonials from '@/components/home/HomeTestimonials.vue'
import HomeMeetUs from '@/components/home/HomeMeetUs.vue'
import HomeContacts from '@/components/home/HomeContacts.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeVacancies from '@/components/home/HomeVacancies.vue'
import HomeBlog from '@/components/home/HomeBlog.vue'
import HomePartners from '@/components/home/HomePartners.vue'
import HomeAwards from '@/components/home/HomeAwards.vue'
import {
  useHomeAwards,
  useHomeBlog,
  useHomeContacts,
  useHomeDirectAdvertiser,
  useHomeFaq,
  useHomeMap,
  useHomePartners,
  useHomeTestimonials,
  useHomeVacancies,
} from '@/composables/useContent'

/* Флаги видимости секций — читаем `enabled` из JSON-контента.
 * Отсутствие поля трактуется как true (enabled !== false). */
const directAdvertiserContent = useHomeDirectAdvertiser()
const mapContent = useHomeMap()
const testimonialsContent = useHomeTestimonials()
const contactsContent = useHomeContacts()
const faqContent = useHomeFaq()
const vacanciesContent = useHomeVacancies()
const blogContent = useHomeBlog()
const partnersContent = useHomePartners()
const awardsContent = useHomeAwards()
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeAbout />
    <HomeAffiliatesAdvertisers />
    <HomeDirectAdvertiser v-if="directAdvertiserContent.enabled !== false" />
    <HomeMap v-if="mapContent.enabled !== false" />
    <HomeBenefits />
    <HomeTestimonials v-if="testimonialsContent.enabled !== false" />
    <HomeMeetUs />
    <HomeContacts v-if="contactsContent.enabled !== false" />
    <HomeFaq v-if="faqContent.enabled !== false" />
    <HomeVacancies v-if="vacanciesContent.enabled !== false" />
    <HomeBlog v-if="blogContent.enabled !== false" />
    <HomePartners v-if="partnersContent.enabled !== false" />
    <HomeAwards v-if="awardsContent.enabled !== false" />
  </div>
</template>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
}
</style>
