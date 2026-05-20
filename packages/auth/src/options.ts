import { createDb } from "@cornwall-ponds/db"
import type { InMemoryDatabase } from "@cornwall-ponds/db/in-memory"
import * as schema from "@cornwall-ponds/db/schema/auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { magicLink } from "better-auth/plugins"
import type { betterAuth } from "better-auth"

import { createKvSecondaryStorage } from "./kv-storage"
import { sendMagicLinkEmail } from "./resend"
import type { AuthEnv } from "./types"

type BetterAuthConfig = NonNullable<Parameters<typeof betterAuth>[0]>
type AuthDatabase = ReturnType<typeof createDb> | InMemoryDatabase

function resolveBaseURL(env: AuthEnv, requestUrl?: string) {
	if (requestUrl) {
		return new URL(requestUrl).origin
	}
	return env.BETTER_AUTH_URL
}

function resolveTrustedOrigins(env: AuthEnv) {
	return [env.CORS_ORIGIN, env.WEB_URL].filter(
		(origin): origin is string => Boolean(origin),
	)
}

function resolveGoogleProviders(env: AuthEnv) {
	if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
		return undefined
	}
	return {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	}
}

export function createAuthOptions(
	env: AuthEnv,
	executionCtx?: ExecutionContext,
	requestUrl?: string,
	database?: AuthDatabase,
): BetterAuthConfig {
	const db = database ?? createDb(env)
	const kv = env.SESSION_KV
	const secondaryStorage = kv ? createKvSecondaryStorage(kv) : undefined
	const googleProviders = resolveGoogleProviders(env)

	return {
		database: drizzleAdapter(db, {
			provider: "sqlite",
			schema,
		}),
		secret: env.BETTER_AUTH_SECRET,
		baseURL: resolveBaseURL(env, requestUrl),
		trustedOrigins: resolveTrustedOrigins(env),
		emailAndPassword: {
			enabled: false,
		},
		...(secondaryStorage
			? {
					secondaryStorage,
					session: {
						storeSessionInDatabase: true,
					},
					rateLimit: {
						enabled: true,
						window: 60,
						max: 10,
						storage: "secondary-storage" as const,
					},
				}
			: {}),
		...(googleProviders ? { socialProviders: googleProviders } : {}),
		plugins: [
			magicLink({
				sendMagicLink: async ({ email, url, token }) => {
					const deliver = () =>
						sendMagicLinkEmail(env, { email, url, token })
					if (executionCtx) {
						executionCtx.waitUntil(deliver())
						return
					}
					await deliver()
				},
			}),
		],
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
			// Enable for production on a shared parent domain, e.g. ".yourdomain.com"
			// crossSubDomainCookies: { enabled: true, domain: ".yourdomain.com" },
		},
	}
}
