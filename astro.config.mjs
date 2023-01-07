import path from "path";
import { fileURLToPath } from "url";

import { defineConfig } from "astro/config";

import astroI18next from "astro-i18next";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import image from "@astrojs/image";
import mdx from '@astrojs/mdx';
import partytown from "@astrojs/partytown";
import subfont from "@ernxst/subfont/astro";
import preact from '@astrojs/preact';
import vue from "@astrojs/vue";
import { SITE } from "./src/config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  // Astro uses this full URL to generate your sitemap and canonical URLs in your final build
  site: SITE.origin,
  base: SITE.basePathname,
  server: { host: "0.0.0.0", port: 28080 },
  output: "static",

  integrations: [
    preact(), // Enable Preact to support Preact JSX components.
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap(),
    image(),
    mdx(),
    astroI18next(),    
    subfont(),
    vue(),

    /* Disable this integration if you don't use Google Analytics (or other external script). */
    partytown({
      config: { forward: ["dataLayer.push"] },
    }),
  ],

  vite: {
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
