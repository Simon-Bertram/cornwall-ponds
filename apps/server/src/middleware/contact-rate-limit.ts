import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { createMiddleware } from "hono/factory"

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 10

function getClientIp(request: Request): string {
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		"unknown"
	)
}

function windowBucket(): number {
	return Math.floor(Date.now() / WINDOW_MS)
}

export const contactRateLimit = createMiddleware<{ Bindings: ServerEnv }>(
	async (c, next) => {
		if (c.req.method !== "POST") {
			await next()
			return
		}

		const pathname = new URL(c.req.url).pathname
		if (pathname !== "/api/contact") {
			await next()
			return
		}

		const ip = getClientIp(c.req.raw)
		const bucket = windowBucket()
		const key = `rl:contact:${ip}:${bucket}`

		const raw = await c.env.SESSION_KV.get(key)
		const count = raw ? Number.parseInt(raw, 10) || 0 : 0

		if (count >= MAX_PER_WINDOW) {
			return c.json(
				{ error: "Too many requests", code: "RATE_LIMITED" },
				429,
			)
		}

		await c.env.SESSION_KV.put(key, String(count + 1), {
			expirationTtl: Math.ceil(WINDOW_MS / 1000) * 2,
		})

		await next()
	},
)
