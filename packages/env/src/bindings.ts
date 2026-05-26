/**
 * Cloudflare bindings for the Astro `web` worker.
 * Keep in sync with `web.bindings` in packages/infra/alchemy.run.ts.
 */
export type WebWorkerBindings = {
	PUBLIC_SERVER_URL: string
	PUBLIC_WEB_URL: string
	PUBLIC_TURNSTILE_SITE_KEY?: string
	ENABLE_SSR_PROTECTED_REDIRECT?: string
	/** Service binding to the Hono API worker. */
	API: Fetcher
}

/**
 * Cloudflare bindings for the Hono API worker.
 * Keep in sync with packages/infra/alchemy.run.ts and packages/auth/src/types.ts (AuthEnv).
 */
export type ServerEnv = {
	DB: D1Database
	SESSION_KV: KVNamespace
	BETTER_AUTH_SECRET: string
	BETTER_AUTH_URL: string
	CORS_ORIGIN: string
	WEB_URL?: string
	GOOGLE_CLIENT_ID?: string
	GOOGLE_CLIENT_SECRET?: string
	RESEND_API_KEY?: string
	RESEND_FROM_EMAIL?: string
	/** Inbox for contact/quote form submissions. */
	CONTACT_TO_EMAIL?: string
	/** Cloudflare Turnstile secret key (server-side verification). */
	TURNSTILE_SECRET_KEY?: string
	/** When `true`/`1`, missing Turnstile secret skips verification even in production (avoid for public traffic). */
	TURNSTILE_FAIL_OPEN?: string
	/** `production` on `alchemy deploy`; `development` on `alchemy dev`. */
	ENVIRONMENT?: string
	/** When not `true`, OpenAPI reference at `/api-reference` is disabled in production. */
	OPENAPI_REFERENCE_ENABLED?: string
	/** Set to `false` in apps/server/.env.development to skip Cloudflare Access locally. */
	CF_ACCESS_ENABLED?: string
	POLICY_AUD?: string
	CF_ACCESS_DOMAIN?: string
	/** R2 bucket for portal contracts and maintenance guides. */
	PORTAL_FILES?: R2Bucket
	/** Promote this email to admin on first login (optional). */
	ADMIN_EMAIL?: string
}
