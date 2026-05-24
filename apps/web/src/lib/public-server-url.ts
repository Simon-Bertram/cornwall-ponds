import type { APIContext } from "astro";
import { env } from "cloudflare:workers";

/** Worker binding (Astro v6); falls back to `import.meta.env` in dev/build. */
export function resolvePublicServerUrl(): string {
	const bound = env.PUBLIC_SERVER_URL;
	if (typeof bound === "string" && bound.length > 0) {
		return bound;
	}
	return import.meta.env.PUBLIC_SERVER_URL ?? "";
}

export function getPublicServerUrl(_context: APIContext): string {
	return resolvePublicServerUrl();
}
