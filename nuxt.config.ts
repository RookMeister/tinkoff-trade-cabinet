// import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vant/nuxt',
    '@vite-pwa/nuxt',
  ],

  colorMode: {
    // preference: 'dark',
    classPrefix: 'van-theme-',
  },

  // routeRules: {
  //   // Generated at build time for SEO purpose
  //   '/': { prerender: true },
  //   // Cached for 1 hour
  //   '/api/*': { cache: { maxAge: 60 * 60 } },
  //   // Redirection to avoid 404
  //   // '/old-page': {
  //   //   redirect: { to: { '/new-page', statusCode: 302 }
  //   // }
  //   // ...
  // },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: 'https://fastly.jsdelivr.net/npm/vant@4/lib/index.css' },
        // { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%221em%22 font-size=%2280%22>⚽️</text></svg>' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', sizes: '32x32', type: 'image/png', href: '/favicon-32x32.png' },
        { rel: 'icon', sizes: '16x16', type: 'image/png', href: '/favicon-16x16.png' },
        { rel: 'mask-icon', color: '#616161', href: '/safari-pinned-tab.svg' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
      meta: [
        // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        // { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },

        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#da532c' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'viewport', content: 'width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
      ],
    },
  },

  // pwa,

  // devtools: {
  //   enabled: true,
  // },
})
