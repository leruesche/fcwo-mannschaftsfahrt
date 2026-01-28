// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@nuxt/image'],

  devtools: {
    enabled: true,
  },

  ssr: true,

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      standalone: false,
    },
  },

  runtimeConfig: {
    // Private keys (only available on server-side)
    databaseUrl: process.env.DATABASE_URL || 'postgresql://fcwo_user:fcwo_password@localhost:5432/fcwo_mannschaftsfahrt',
  },

  nitro: {
    experimental: {
      wasm: true,
    },
  },
})
