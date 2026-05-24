import type { APIContext } from "astro";
import { env } from "cloudflare:workers";

/** Worker binding at runtime (Alchemy); build-time import.meta.env in dev only. */
export function getPublicServerUrl(context: APIContext): string {
  // 1. Read directly from the new Cloudflare native env object
  const bound = env?.PUBLIC_SERVER_URL;

  if (typeof bound === "string" && bound.length > 0) {
    return bound;
  }

  // 2. Fallback to Vite's import.meta.env for local dev and build steps
  return import.meta.env.PUBLIC_SERVER_URL ?? "";
}
