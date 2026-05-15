/** Bindings and secrets required to construct a Better Auth instance on Workers. */
export type AuthEnv = {
	DB: D1Database
	BETTER_AUTH_SECRET: string
	BETTER_AUTH_URL: string
	CORS_ORIGIN: string
	WEB_URL?: string
	GOOGLE_CLIENT_ID?: string
	GOOGLE_CLIENT_SECRET?: string
	RESEND_API_KEY?: string
	/** Defaults to Resend onboarding sender when unset. */
	RESEND_FROM_EMAIL?: string
	SESSION_KV?: KVNamespace
}

export type CreateAuthOptions = {
	env: AuthEnv
	executionCtx?: ExecutionContext
	requestUrl?: string
}
