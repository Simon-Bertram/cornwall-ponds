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
}
