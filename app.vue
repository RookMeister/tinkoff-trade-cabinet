<template>
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
  --van-nav-bar-background: var(--van-background) !important;
  --van-tabbar-background: var(--van-background) !important;
}
.van-doc-theme-light {
  --van-nav-bar-background: var(--van-background) !important;
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
