import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-20",
  ssr: false,
  devtools: { enabled: true },
  css: ["@/assets/main.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "nitro-cloudflare-dev",
  ],
  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    "/api/auth/**": { proxy: `${process.env.API_AUTH}/api/auth/**` },
    "/api/users/**": { proxy: `${process.env.API_AUTH}/api/users/**` },
    "/api/dashboard/**": {
      proxy: `${process.env.API_INVENTORY}/api/dashboard/**`,
    },
    "/api/issue-slips/**": {
      proxy: `${process.env.API_INVENTORY}/api/issue-slips/**`,
    },
    "/api/personnel/**": {
      proxy: `${process.env.API_INVENTORY}/api/personnel/**`,
    },

    "/api/assets/**": {
      proxy: `${process.env.API_INVENTORY}/api/assets/**`,
    },
    "/api/stocks/**": {
      proxy: `${process.env.API_INVENTORY}/api/stocks/**`,
    },
    "/api/offices/**": {
      proxy: `${process.env.API_INVENTORY}/api/offices/**`,
    },
    "/api/schools/**": {
      proxy: `${process.env.API_INVENTORY}/api/schools/**`,
    },
    "/api/school-divisions/**": {
      proxy: `${process.env.API_INVENTORY}/api/school-divisions/**`,
    },
    "/api/divisions/**": {
      proxy: `${process.env.API_INVENTORY}/api/divisions/**`,
    },
    "/api/configs/**": {
      proxy: `${process.env.API_INVENTORY}/api/configs/**`,
    },

    "/api/asset-codes/**": {
      proxy: `${process.env.API_INVENTORY}/api/asset-codes/**`,
    },

    "/api/ris/**": {
      proxy: `${process.env.API_INVENTORY}/api/ris/**`,
    },

    "/api/transfers/**": {
      proxy: `${process.env.API_INVENTORY}/api/transfers/**`,
    },
    "/api/losses/**": {
      proxy: `${process.env.API_INVENTORY}/api/losses/**`,
    },

    "/api/maintenances/**": {
      proxy: `${process.env.API_INVENTORY}/api/maintenances/**`,
    },

    "/api/files/**": {
      proxy: `${process.env.API_STORAGE}/api/files/**`,
    },
    "/api/wastes/**": {
      proxy: `${process.env.API_INVENTORY}/api/wastes/**`,
    },
    "/api/returns/**": {
      proxy: `${process.env.API_INVENTORY}/api/returns/**`,
    },
    "/api/configurations/**": {
      proxy: `${process.env.API_INVENTORY}/api/configurations/**`,
    },
    "/api/public/**": {
      proxy: `${process.env.API_DO_STORAGE_ENDPOINT}/**`,
    },
  },
  runtimeConfig: {
    public: {
      cookieConfig: {
        domain: (process.env.DOMAIN as string) || "localhost",
        secure: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
      API_AUTH: (process.env.API_AUTH as string) ?? "",
      API_INVENTORY: (process.env.API_INVENTORY as string) ?? "",
      API_STORAGE: (process.env.API_STORAGE as string) ?? "",
      API_DO_STORAGE_ENDPOINT:
        (process.env.API_DO_STORAGE_ENDPOINT as string) ?? "",
    },
  },
});
