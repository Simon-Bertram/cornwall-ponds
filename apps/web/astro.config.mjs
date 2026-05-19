import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// @ts-check
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import node from "@astrojs/node";
import react from "@astrojs/react";
import {
  defineConfig,
  envField,
  fontProviders,
  sessionDrivers,
} from "astro/config";

const alchemyConfigPath = fileURLToPath(
  new URL("./.alchemy/local/wrangler.jsonc", import.meta.url),
);
const shouldUseAlchemy = existsSync(alchemyConfigPath);

const cloudflareWorkersShimPath = fileURLToPath(
  new URL("../../packages/env/src/cloudflare-local.ts", import.meta.url),
);
const cloudflareWorkersAlias = shouldUseAlchemy
  ? {}
  : {
      "cloudflare:workers": cloudflareWorkersShimPath,
    };

// https://astro.build/config
export default defineConfig({
  output: "server",

  // Better Auth owns sessions; avoid Astro auto-enabling SESSION KV + workerd CJS drivers.
  session: shouldUseAlchemy
    ? { driver: sessionDrivers.lruCache() }
    : undefined,

  adapter: shouldUseAlchemy
    ? alchemy({
        platformProxy: { configPath: alchemyConfigPath },
        // Default cloudflare-binding pulls IMAGES into workerd at dev startup.
        imageService: "cloudflare",
      })
    : node({ mode: "standalone" }),

  env: {
    schema: {
      PUBLIC_SERVER_URL: envField.string({
        access: "public",
        context: "client",
        default: "http://localhost:3000",
      }),
      PUBLIC_WEB_URL: envField.string({
        access: "public",
        context: "client",
        default: "http://localhost:4321",
      }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      weights: ["200 800"],
    },
    {
      provider: fontProviders.google(),
      name: "Work Sans",
      cssVariable: "--font-work-sans",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: cloudflareWorkersAlias,
      // noExternal here duplicates @astrojs/react optimizeDeps and breaks hooks in workerd.
      dedupe: ["react", "react-dom"],
    },
  },

  integrations: [react()],
});
