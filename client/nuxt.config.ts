/* eslint-disable no-process-env */
import type { NuxtConfig } from '@nuxt/types'
import { config } from 'dotenv'

const name = 'DDR交流会'
const description = 'DDR Score Tracker'

const projectId = 'ddradar-meetup'
config()

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
  buildModules: ['@nuxt/typescript-build', 'nuxt-typed-vuex'],
  modules: ['nuxt-buefy', '@nuxtjs/firebase', '@nuxtjs/pwa'],
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.FIREBASE_APP_ID!,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID!,
    },
    services: {
      auth: true,
      firestore: true,
    },
    onFirebaseHosting: true,
  },
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
  build: {
    transpile: ['/typed-vuex/'],
  },
}
export default configuration
