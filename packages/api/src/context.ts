import type { Auth } from "@cornwall-ponds/auth"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import type { Context as HonoContext } from "hono"

export type ServerHonoVariables = {
	auth: Auth
}

export type CreateContextOptions = {
	context: HonoContext<{ Bindings: ServerEnv; Variables: ServerHonoVariables }>
}

export async function createContext({ context }: CreateContextOptions) {
	const auth = context.get("auth")
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	})
	return {
		auth,
		session,
		env: context.env,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
