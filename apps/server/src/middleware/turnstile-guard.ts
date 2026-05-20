import {
	getTurnstileTokenFromFormBody,
	getTurnstileTokenFromHeaders,
	isTurnstileEnabled,
	requireTurnstile,
	turnstileEnforceSecret,
} from "@cornwall-ponds/turnstile"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { createMiddleware } from "hono/factory"

const PROTECTED_AUTH_POST_PATHS = new Set([
	"/api/auth/sign-in/magic-link",
	"/api/auth/sign-in/social",
])

function getClientIp(request: Request): string | undefined {
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
	)
}

export const turnstileGuard = createMiddleware<{ Bindings: ServerEnv }>(
	async (c, next) => {
		if (c.req.method !== "POST") {
			await next()
			return
		}

		const pathname = new URL(c.req.url).pathname
		if (!PROTECTED_AUTH_POST_PATHS.has(pathname)) {
			await next()
			return
		}

		const enforceSecret = turnstileEnforceSecret(c.env)
		if (!isTurnstileEnabled(c.env.TURNSTILE_SECRET_KEY)) {
			if (enforceSecret) {
				return c.json(
					{
						error: "Turnstile is not configured",
						code: "TURNSTILE_NOT_CONFIGURED",
					},
					503,
				)
			}
			await next()
			return
		}

		const token =
			getTurnstileTokenFromHeaders(c.req.raw.headers) ??
			(await getTurnstileTokenFromFormBody(c.req.raw))

		const result = await requireTurnstile({
			secret: c.env.TURNSTILE_SECRET_KEY,
			token,
			remoteIp: getClientIp(c.req.raw),
			enforceSecret,
		})

		if (!result.success) {
			return c.json(
				{
					error: "Turnstile verification failed",
					code: "TURNSTILE_FAILED",
				},
				403,
			)
		}

		await next()
	},
)
