<script setup lang="ts" generic="T extends any, O extends any">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"

const route = useRoute()
const color = useColorMode()
color.preference = 'system'

const nameRoute = computed(() => route.name?.toString() || '')
</script>

<template>
  <SpeedInsights />
  <van-config-provider :theme="color.preference">
    <slot name="header" />
    <main class="px-1 mx-auto max-w-7xl">
      <slot />
    </main>
    <van-tabbar :model-value="nameRoute" safe-area-inset-bottom>
      <van-tabbar-item name="home" icon="home-o" to="/" value>
        Главная
      </van-tabbar-item>
      <van-tabbar-item name="operations" icon="list-switch" to="/operations">
        Операции
      </van-tabbar-item>
      <van-tabbar-item name="analytics" icon="balance-list-o" to="/analytics">
        Аналитика
      </van-tabbar-item>
      <van-tabbar-item name="favorites" icon="star-o" to="/favorites">
        Избранное
      </van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>
