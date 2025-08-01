export default defineNuxtConfig({
  devtools: true,
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:5000'
    }
  }
})