import type { NuxtConfig } from '@nuxt/types'

const name = 'DDR交流会'
const description = 'DDR Score Tracker'

const configuration: NuxtConfig = {
  target: 'static',
  head: {
    titleTemplate: titleChunk =>
      titleChunk ? `${titleChunk} - DDR交流会` : 'DDR交流会',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon alternate', type: 'image/png', href: '/favicon.png' },
    ],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: ['@nuxt/typescript-build'],
  modules: ['nuxt-buefy', '@nuxtjs/pwa'],
  pwa: {
    manifest: {
      name,
      short_name: name,
      description,
      theme_color: '#ff8c00',
      lang: 'ja',
      display: 'standalone',
      start_url: '/',
    },
    meta: {
      name,
      description,
      theme_color: '#ff8c00',
      lang: 'ja',
      twitterCard: 'summary',
    },
  },
  build: {},
}
export default configuration
