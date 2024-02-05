// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@sidebase/nuxt-auth'
  ],
  runtimeConfig: {
    // Will be available in both server and client
    authSecret: '',
    authOrigin: '',
    githubClientId:  '',
    githubClientSecret: '',
    googleClientId: '',
    googleClientSecret: '',
  },
})
