import { ORPCError, os } from "@orpc/server"

import type { Context } from "./context"
import { sessionUserToPortalUser } from "./lib/user"
import {
	claimPendingEmailForUser,
	ensureAdminRole,
	getCustomerIdForUser,
} from "./lib/portal-access"

export const o = os.$context<Context>()

export const publicProcedure = o

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED")
	}
	const portalUser = sessionUserToPortalUser(context.session.user)
	await ensureAdminRole(context.env, portalUser)
	const { customerId } = await claimPendingEmailForUser(
		context.env,
		portalUser,
	)
	return next({
		context: {
			session: context.session,
			user: portalUser,
			customerId,
			env: context.env,
		},
	})
})

export const protectedProcedure = publicProcedure.use(requireAuth)

const requireAdmin = o.middleware(async ({ context, next }) => {
	if (context.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN", { message: "Admin access required" })
	}
	return next({ context })
})

export const adminProcedure = protectedProcedure.use(requireAdmin)

const requirePortal = o.middleware(async ({ context, next }) => {
	if (context.user.role === "admin") {
		return next({ context })
	}
	if (!context.customerId) {
		throw new ORPCError("FORBIDDEN", {
			message: "No customer portal linked to this account",
		})
	}
	return next({ context })
})

export const portalProcedure = protectedProcedure.use(requirePortal)

/** Resolve customer ID for portal reads (membership or admin view-as). */
export async function resolvePortalCustomerId(
	context: Context & {
		user: ReturnType<typeof sessionUserToPortalUser>
		customerId: string | null
	},
	viewAsCustomerId?: string,
): Promise<string> {
	if (context.user.role === "admin" && viewAsCustomerId) {
		return viewAsCustomerId
	}
	const customerId =
		context.customerId ??
		(await getCustomerIdForUser(context.env, context.user.id))
	if (!customerId) {
		throw new ORPCError("FORBIDDEN", {
			message: "No customer portal linked to this account",
		})
	}
	return customerId
}
