import { createDb } from "@cornwall-ponds/db"
import { portalDocument } from "@cornwall-ponds/db/schema/portal"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { z } from "zod"

import {
	portalProcedure,
	protectedProcedure,
	resolvePortalCustomerId,
} from "../index"
import {
	claimPendingEmailForUser,
	ensureAdminRole,
	getPortalStatus,
} from "../lib/portal-access"

const viewAsInput = z
	.object({
		customerId: z.string().uuid().optional(),
	})
	.optional()

export const portalRouter = {
	bootstrap: protectedProcedure
		.input(viewAsInput)
		.handler(async ({ context, input }) => {
			const portalUser = context.user
			await ensureAdminRole(context.env, portalUser)
			await claimPendingEmailForUser(context.env, portalUser)
			return getPortalStatus(context.env, portalUser, input?.customerId)
		}),

	status: protectedProcedure
		.input(viewAsInput)
		.handler(async ({ context, input }) => {
			return getPortalStatus(
				context.env,
				context.user,
				input?.customerId,
			)
		}),

	documents: {
		list: portalProcedure
			.input(viewAsInput)
			.handler(async ({ context, input }) => {
				const customerId = await resolvePortalCustomerId(
					context,
					input?.customerId,
				)
				const db = createDb(context.env)
				const isAdminView =
					context.user.role === "admin" && Boolean(input?.customerId)

				const conditions = [
					eq(portalDocument.customerId, customerId),
					...(isAdminView ? [] : [isNotNull(portalDocument.publishedAt)]),
				]

				const rows = await db
					.select({
						id: portalDocument.id,
						type: portalDocument.type,
						title: portalDocument.title,
						description: portalDocument.description,
						mimeType: portalDocument.mimeType,
						sizeBytes: portalDocument.sizeBytes,
						publishedAt: portalDocument.publishedAt,
						createdAt: portalDocument.createdAt,
					})
					.from(portalDocument)
					.where(and(...conditions))
					.orderBy(desc(portalDocument.createdAt))

				return { documents: rows }
			}),
	},
}
