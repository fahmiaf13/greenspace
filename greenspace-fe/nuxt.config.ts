// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: { preference: "light" },
  modules: ["@nuxtjs/google-fonts", "@nuxt/ui", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],
  css: ["~/assets/css/main.css"],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      title: "Greenspace",
    },
  },
  runtimeConfig: {
    public: {
      NuxtPublicEndpoint: process.env.NUXT_PUBLIC_ENDPOINT,
    },
  },
  googleFonts: {
    families: {
      "Red+Hat+Text": {
        wght: [300, 400, 500, 600, 700],
      },
      Blinker: {
        wght: [300, 400, 500, 600, 700],
      },
    },
  },
  devServer: {
    port: 3000,
  },
});
