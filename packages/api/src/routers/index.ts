import type { RouterClient } from "@orpc/server"

import { protectedProcedure } from "../index"
import { adminRouter } from "./admin"
import { portalRouter } from "./portal"

export const appRouter = {
	me: protectedProcedure.handler(({ context }) => context.user),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.user,
		}
	}),
	portal: portalRouter,
	admin: adminRouter,
}

export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
