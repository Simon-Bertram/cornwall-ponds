import { env as defaultEnv } from "@cornwall-ponds/env/server"
import { betterAuth } from "better-auth"

import { createAuthOptions } from "./options"
import type { AuthEnv, CreateAuthOptions } from "./types"

export type { AuthEnv, CreateAuthOptions } from "./types"
export { createAuthOptions } from "./options"

function resolveAuthEnv(overrides?: AuthEnv): AuthEnv {
	if (overrides) {
		return overrides
	}
	return defaultEnv as AuthEnv
}

/**
 * Creates a Better Auth instance for the current request.
 * Pass `env` and `executionCtx` from the Hono context on Cloudflare Workers.
 */
export function createAuth(options?: CreateAuthOptions) {
	const authEnv = resolveAuthEnv(options?.env)
	return betterAuth(
		createAuthOptions(authEnv, options?.executionCtx, options?.requestUrl),
	)
}

export type Auth = ReturnType<typeof createAuth>
export type Session = Auth["$Infer"]["Session"]
export type User = Session["user"]
