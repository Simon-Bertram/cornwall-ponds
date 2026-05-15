import type { web } from "@cornwall-ponds/infra/alchemy.run";

/** Cloudflare bindings for the Astro `web` worker (see packages/infra/alchemy.run.ts). */
export type WebWorkerEnv = typeof web.Env;
