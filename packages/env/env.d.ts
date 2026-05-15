import type { server, web } from "@cornwall-ponds/infra/alchemy.run";

// Server worker (Hono API) — used by apps/server, packages/api, packages/auth at runtime.
export type ServerEnv = typeof server.Env;

// Astro web worker — used by apps/web middleware via cloudflare:workers / runtime.env.
export type WebEnv = typeof web.Env;

/** @deprecated Prefer ServerEnv — kept for existing imports. */
export type CloudflareEnv = ServerEnv;

declare global {
	type Env = ServerEnv;
}

declare module "cloudflare:workers" {
	namespace Cloudflare {
		export interface Env extends ServerEnv {}
	}
}
