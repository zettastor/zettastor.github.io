/** @type {import('astro-i18next').AstroI18nextConfig} */
export default {
  defaultLanguage: "zh",
  supportedLanguages: ["en", "zh"],
  i18next: {
    debug: true, // convenient during development to check for missing keys
    initImmediate: false,
    backend: {
      loadPath: "./src/locales/{{lng}}.json",
    },
  },
  i18nextPlugins: { fsBackend: "i18next-fs-backend" },
};
