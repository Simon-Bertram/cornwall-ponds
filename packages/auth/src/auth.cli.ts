/**
 * Better Auth CLI entrypoint (Node). Exports a static `auth` instance for
 * `better-auth generate` — not used at runtime on Workers.
 */
import { createInMemoryDb } from "@cornwall-ponds/db/in-memory"
import { config } from "dotenv"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { betterAuth } from "better-auth"

import { createAuthOptions } from "./options"
import type { AuthEnv } from "./types"

const root = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(root, "../../../apps/server/.env") })

const db = createInMemoryDb()

const cliEnv: AuthEnv = {
	// Unused when an in-memory Drizzle db is passed into createAuthOptions.
	DB: undefined as unknown as D1Database,
	BETTER_AUTH_SECRET:
		process.env.BETTER_AUTH_SECRET ??
		"development-secret-min-32-characters-long!!",
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
	CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:4321",
	WEB_URL: process.env.WEB_URL ?? "http://localhost:4321",
	GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "cli-placeholder",
	GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "cli-placeholder",
}

export const auth = betterAuth(
	createAuthOptions(cliEnv, undefined, undefined, db),
)
