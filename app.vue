<script setup lang="ts">
// import { appName } from '~/constants'

// const color = useColorMode()

// useHead({
//   title: appName,
// })

// watch(color, (val) => {
//   if (val === 'van-doc-theme-dark') {
//     // color.value = 'van-doc-theme-dark'
//     if (process.browser)
//       // document.querySelector('html').setAttribute('data-theme', 'dark')
//   }
//   else {
//     // color.value = 'van-doc-theme-light'
//     if (process.browser)
//       // document.querySelector('html').setAttribute('data-theme', 'light')
//   }
// }, { immediate: true })
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@import 'vant/lib/index.css';

html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: var(--van-background);
  color: var(--van-text-color);
  --van-nav-bar-height: 56px;
}

.van-theme-dark {
  /* background-color: var(--van-black); */
  /* --van-nav-bar-background: var(--van-background) !important; */
}
.van-doc-theme-light {
  /* background-color: var(--van-gray-1); */
}

@supports (padding-top: env(safe-area-inset-top)) {
  main {
    --safe-area-inset-top: env(safe-area-inset-top);
    padding-top: calc(env(safe-area-inset-top) + 70px);
  }
}
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  main {
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    padding-bottom: calc(env(safe-area-inset-bottom) + 64px);
  }
}
</style>
