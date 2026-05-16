<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

import CasinoAbout from '@/components/casino/CasinoAbout.vue'
import CasinoBottomCta from '@/components/casino/CasinoBottomCta.vue'
import CasinoCooperation from '@/components/casino/CasinoCooperation.vue'
import CasinoHero from '@/components/casino/CasinoHero.vue'
import CasinoKeyHighlights from '@/components/casino/CasinoKeyHighlights.vue'
import CasinoPayments from '@/components/casino/CasinoPayments.vue'
import { getCasinoBySlug } from '@/composables/useContent'

/**
 * Casino direct-advertiser landing.
 *
 * Маршрут: `/casino/:slug` (slug ∈ winspirit | rocketplay | luckyhills).
 * Контент берётся из `en/pages/casinos/<slug>.json` через `getCasinoBySlug`. Если slug
 * неизвестен — редиректим на `/not-found` (используем replace,
 * чтобы пользователь не вернулся "Назад" обратно на пустую страницу).
 *
 * Все секции реализованы как пер-секционные компоненты в
 * `src/components/casino/*` и принимают на вход уже типизированные
 * структуры. CasinoView отвечает только за композицию и роутинг.
 */
const props = defineProps<{ slug: string }>()
const router = useRouter()

const casino = computed(() => getCasinoBySlug(props.slug))

watch(
  casino,
  next => {
    if (!next) router.replace({ name: 'not-found' })
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="casino" :class="['casino-page', `casino-page--${slug}`]">
    <CasinoHero :hero="casino.hero" />
    <CasinoAbout :about="casino.about" />
    <CasinoKeyHighlights :content="casino.keyHighlights" />
    <CasinoPayments :content="casino.payments" />
    <CasinoCooperation :content="casino.cooperation" />
    <CasinoBottomCta :content="casino.bottomCta" />
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/scss/mixins' as *;

.casino-page {
  display: flex;
  flex-direction: column;
}

// .casino-page--rocketplay :deep(.casino-hero__logo-wrap) {
//   @include mq($from: tablet) {
//     width: calc(438 / 1040 * 100%);
//     max-width: to-rem(438);
//     transform: translateY(-10px);
//   }
// }

.casino-page--rocketplay {
  :deep(.casino-hero__logo-wrap) {
    @include mq($from: tablet) {
      right: 0;
      width: calc(428 / 1040 * 100%);
      max-width: to-rem(438);
      transform: translateY(-10px);
    }
  }

  :deep(.casino-about__text) {
    @include mq($from: tablet) {
      max-width: to-rem(592);
    }
  }

  :deep(.casino-about__badge--outlined-brand) {
    top: to-rem(-169);
    left: unset;
    right: to-rem(25);
    z-index: 1;

    @include mq($from: tablet) {
      top: to-rem(-63);
      right: to-rem(60px);
    }
  }

  :deep(.casino-about__badge--brand-fill) {
    right: to-rem(47);
    left: unset;

    @include mq($from: tablet) {
      top: to-rem(-9);
      right: to-rem(40);
    }
  }

  :deep(.casino-about__badge--outlined-bold) {
    top: unset;
    left: unset;
    right: 0;
    bottom: to-rem(-110px);

    @include mq($from: tablet) {
      right: to-rem(65);
      bottom: to-rem(-55);
    }
  }
}

.casino-page--winspirit {
  :deep(.casino-about__badge--outlined-brand) {
    top: to-rem(-156);
    left: unset;
    right: to-rem(59);
    z-index: 1;

    @include mq($from: tablet) {
      top: to-rem(-30);
      right: to-rem(60px);
    }
  }

  :deep(.casino-about__badge--brand-fill) {
    top: to-rem(-104);
    right: to-rem(-11);
    left: unset;

    @include mq($from: tablet) {
      top: to-rem(30);
      right: to-rem(4);
    }
  }

  :deep(.casino-about__badge--outlined-bold) {
    top: unset;
    left: unset;
    right: 0;
    bottom: to-rem(-110px);

    @include mq($from: tablet) {
      right: to-rem(50);
      bottom: to-rem(-30);
    }
  }
}

.casino-page--luckyhills {
  :deep(.casino-about__text) {
    @include mq($from: tablet) {
      max-width: to-rem(733);
    }
  }

  :deep(.casino-about__badge--outlined-brand) {
    top: to-rem(-161);
    left: unset;
    right: to-rem(16);
    z-index: 1;

    @include mq($from: tablet) {
      top: to-rem(-40);
      right: to-rem(-10);
    }
  }

  :deep(.casino-about__badge--brand-fill) {
    top: to-rem(-99);
    right: 0;
    left: unset;

    @include mq($from: tablet) {
      top: to-rem(22);
      right: to-rem(-20);
    }
  }

  :deep(.casino-about__badge--outlined-bold) {
    top: unset;
    left: unset;
    right: to-rem(-17);
    bottom: to-rem(-120);

    @include mq($from: tablet) {
      right: to-rem(-66);
      bottom: to-rem(10);
    }
  }
}

// .casino-page :deep(.casino-about__badge--outlined-brand) {
//   left: unset;
//   right: to-rem(75.13px);
//   z-index: 1;

//   @include mq($from: tablet) {
//     right: to-rem(90px);
//   }
// }

// .casino-page :deep(.casino-about__badge--brand-fill) {
//   right: 0;
//   left: unset;

//   @include mq($from: tablet) {
//     right: to-rem(50px);
//   }
// }

// .casino-page :deep(.casino-about__badge--outlined-bold) {
//   top: unset;
//   left: unset;
//   right: 0;
//   bottom: to-rem(-90px);

//   @include mq($from: tablet) {
//     right: to-rem(90px);
//     bottom: to-rem(-56px);
//   }
// }
</style>
