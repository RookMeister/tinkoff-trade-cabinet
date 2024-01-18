<script setup lang="ts" generic="T extends any, O extends any">
const route = useRoute()
const active = ref(route.name)
const color = useColorMode()
color.preference = 'system'
</script>

<template>
  <van-config-provider :theme="color.preference">
    <slot name="header" />
    <main class="px-4 mx-auto max-w-7xl">
      <slot />
    </main>
    <van-tabbar v-model="active" safe-area-inset-bottom>
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
