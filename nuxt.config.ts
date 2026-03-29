export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },

  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: [
    '~/assets/scss/main.scss',
    'leaflet/dist/leaflet.css',
  ],

  typescript: {
    strict: true,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Nieruchomości Testowe',
      short_name: 'Nieruchomości',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      screenshots: [
        { src: '/screenshots/desktop.png', sizes: '1920x1080', type: 'image/png', form_factor: 'wide', label: 'Nieruchomości Testowe - Desktop' },
        { src: '/screenshots/mobile.png', sizes: '1080x1920', type: 'image/png', label: 'Nieruchomości Testowe - Mobile' },
      ],
    },
    workbox: {
      navigateFallback: undefined,
      runtimeCaching: [
        {
          urlPattern: /^https?:\/\/localhost(:\d+)?\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
          },
        },
      ],
    },
  },

  app: {
    head: {
      title: 'Nieruchomości Testowe - ogłoszenia nieruchomości',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portal ogłoszeń nieruchomości - mieszkania, domy, działki, lokale użytkowe' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
    },
  },
})
