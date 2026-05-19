import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

// @ts-check
import tailwindcss from "@tailwindcss/vite";
import alchemy from "alchemy/cloudflare/astro";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField, fontProviders } from "astro/config";

// #region agent log
const DEBUG_ENDPOINT =
  "http://localhost:7491/ingest/e8332152-a9b9-4809-aab8-43213961e9a7";
const DEBUG_SESSION = "3bc844";
function debugLog(location, message, data, hypothesisId) {
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": DEBUG_SESSION,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION,
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
      runId: "post-fix",
    }),
  }).catch(() => {});
}
// #endregion

const alchemyConfigPath = fileURLToPath(
  new URL("./.alchemy/local/wrangler.jsonc", import.meta.url),
);
const shouldUseAlchemy = existsSync(alchemyConfigPath);

// #region agent log
const distServerEntry = fileURLToPath(
  new URL("./dist/server/entry.mjs", import.meta.url),
);
const distWranglerJson = fileURLToPath(
  new URL("./dist/server/wrangler.json", import.meta.url),
);
let builtWranglerBindings = null;
if (existsSync(distWranglerJson)) {
  try {
    const built = JSON.parse(readFileSync(distWranglerJson, "utf8"));
    builtWranglerBindings = {
      hasSessionKv: built.kv_namespaces?.some((kv) => kv.binding === "SESSION"),
      hasImages: Boolean(built.images?.binding),
      serviceCount: built.services?.length ?? 0,
    };
  } catch {
    builtWranglerBindings = { parseError: true };
  }
}
debugLog("astro.config.mjs:boot", "astro config evaluating", {
  shouldUseAlchemy,
  alchemyConfigExists: shouldUseAlchemy,
  distServerEntryExists: existsSync(distServerEntry),
  distServerEntryMtime: existsSync(distServerEntry)
    ? statSync(distServerEntry).mtimeMs
    : null,
  builtWranglerBindings,
  platform: process.platform,
  arch: process.arch,
  hasCloudflareAccountId: Boolean(process.env.CLOUDFLARE_ACCOUNT_ID),
  hasCloudflareApiToken: Boolean(process.env.CLOUDFLARE_API_TOKEN),
}, "A");
if (shouldUseAlchemy) {
  try {
    const wranglerText = readFileSync(alchemyConfigPath, "utf8");
    debugLog("astro.config.mjs:wrangler", "alchemy wrangler.jsonc snapshot", {
      hasApiService: wranglerText.includes('"binding": "API"'),
      hasSessionKv: wranglerText.includes('"SESSION"'),
      hasImages: wranglerText.includes('"IMAGES"'),
      mainLine: wranglerText.match(/"main"\s*:\s*"[^"]+"/)?.[0] ?? null,
    }, "B");
  } catch (err) {
    debugLog(
      "astro.config.mjs:wrangler",
      "failed reading alchemy wrangler.jsonc",
      { error: String(err) },
      "B",
    );
  }
}
for (const signal of ["uncaughtException", "unhandledRejection"]) {
  process.on(signal, (err) => {
    debugLog(
      `astro.config.mjs:${signal}`,
      signal,
      { error: String(err) },
      "E",
    );
  });
}
// #endregion

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

  adapter: shouldUseAlchemy
    ? alchemy({ platformProxy: { configPath: alchemyConfigPath } })
    : node({ mode: "standalone" }),

  env: {
    schema: {
      PUBLIC_SERVER_URL: envField.string({
        access: "public",
        context: "client",
        default: "http://localhost:3000",
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
    plugins: [
      // #region agent log
      {
        name: "agent-debug-cf-dev",
        configureServer() {
          debugLog(
            "vite:configureServer",
            "vite dev server configured",
            { shouldUseAlchemy },
            "E",
          );
        },
        buildStart() {
          debugLog("vite:buildStart", "vite buildStart", {}, "C");
        },
        closeBundle() {
          debugLog("vite:closeBundle", "vite closeBundle", {}, "C");
        },
      },
      // #endregion
      tailwindcss(),
    ],
    resolve: { alias: cloudflareWorkersAlias },
    // @astrojs/react + @astrojs/cloudflare configure ssr optimizeDeps via
    // configEnvironment. A legacy vite.ssr.optimizeDeps block here (incl.
    // bare "picomatch") broke prebundling and loaded CJS react in workerd.
    ...(!shouldUseAlchemy
      ? {
          environments: {
            ssr: {
              resolve: {
                noExternal: ["react", "react-dom"],
              },
            },
          },
        }
      : {}),
  },

  integrations: [react()],
});
