import { createDb } from "@cornwall-ponds/db"
import {
	auditLog,
	customer,
	customerEmail,
	customerMember,
	portalDocument,
} from "@cornwall-ponds/db/schema/portal"
import { user } from "@cornwall-ponds/db/schema/auth"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

import { ORPCError } from "@orpc/server"

import { adminProcedure } from "../index"
import { newId } from "../lib/ids"
import { normalizeEmail, getPortalStatus } from "../lib/portal-access"
import { writeAuditLog } from "../lib/audit"
import { sendPortalWelcomeEmail } from "../lib/portal-email"

const customerIdInput = z.object({ customerId: z.string().uuid() })

export const adminRouter = {
	customers: {
		list: adminProcedure.handler(async ({ context }) => {
			const db = createDb(context.env)
			const rows = await db
				.select({
					id: customer.id,
					displayName: customer.displayName,
					notes: customer.notes,
					createdAt: customer.createdAt,
				})
				.from(customer)
				.orderBy(desc(customer.createdAt))
			return { customers: rows }
		}),

		create: adminProcedure
			.input(
				z.object({
					displayName: z.string().min(1).max(200),
					notes: z.string().max(5000).optional(),
				}),
			)
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				const id = newId()
				await db.insert(customer).values({
					id,
					displayName: input.displayName,
					notes: input.notes ?? null,
				})
				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "customer.created",
					entityType: "customer",
					entityId: id,
				})
				return { id }
			}),

		get: adminProcedure
			.input(customerIdInput)
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				const [row] = await db
					.select()
					.from(customer)
					.where(eq(customer.id, input.customerId))
					.limit(1)
				if (!row) {
					throw new ORPCError("NOT_FOUND", { message: "Customer not found" })
				}

				const emails = await db
					.select()
					.from(customerEmail)
					.where(eq(customerEmail.customerId, input.customerId))

				const members = await db
					.select({
						id: customerMember.id,
						userId: customerMember.userId,
						role: customerMember.role,
						email: user.email,
						name: user.name,
					})
					.from(customerMember)
					.innerJoin(user, eq(customerMember.userId, user.id))
					.where(eq(customerMember.customerId, input.customerId))

				const documents = await db
					.select({
						id: portalDocument.id,
						type: portalDocument.type,
						title: portalDocument.title,
						publishedAt: portalDocument.publishedAt,
						createdAt: portalDocument.createdAt,
					})
					.from(portalDocument)
					.where(eq(portalDocument.customerId, input.customerId))
					.orderBy(desc(portalDocument.createdAt))

				return {
					customer: row,
					emails,
					members,
					documents,
				}
			}),

		addEmail: adminProcedure
			.input(
				z.object({
					customerId: z.string().uuid(),
					email: z.string().email(),
					sendWelcomeEmail: z.boolean().optional(),
				}),
			)
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				const email = normalizeEmail(input.email)
				const id = newId()
				await db.insert(customerEmail).values({
					id,
					customerId: input.customerId,
					email,
					status: "pending",
					invitedAt: new Date(),
				})
				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "customer_email.added",
					entityType: "customer_email",
					entityId: id,
					metadata: { email },
				})

				if (input.sendWelcomeEmail) {
					const webUrl =
						context.env.WEB_URL ?? context.env.CORS_ORIGIN
					await sendPortalWelcomeEmail(context.env, {
						email,
						loginUrl: `${webUrl}/login`,
					})
				}

				return { id, email }
			}),
	},

	documents: {
		publish: adminProcedure
			.input(z.object({ documentId: z.string().uuid() }))
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				const [doc] = await db
					.select()
					.from(portalDocument)
					.where(eq(portalDocument.id, input.documentId))
					.limit(1)
				if (!doc) {
					throw new ORPCError("NOT_FOUND", { message: "Document not found" })
				}

				const now = new Date()
				const wasPublished = doc.publishedAt != null
				await db
					.update(portalDocument)
					.set({ publishedAt: now, updatedAt: now })
					.where(eq(portalDocument.id, input.documentId))

				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "document.published",
					entityType: "portal_document",
					entityId: input.documentId,
				})

				if (!wasPublished) {
					const { notifyCustomerOfPublishedDocument } = await import(
						"../lib/portal-notify"
					)
					await notifyCustomerOfPublishedDocument(context.env, {
						documentId: input.documentId,
						customerId: doc.customerId,
						title: doc.title,
						type: doc.type,
					})
				}

				return { publishedAt: now }
			}),

		unpublish: adminProcedure
			.input(z.object({ documentId: z.string().uuid() }))
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				await db
					.update(portalDocument)
					.set({ publishedAt: null, updatedAt: new Date() })
					.where(eq(portalDocument.id, input.documentId))
				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "document.unpublished",
					entityType: "portal_document",
					entityId: input.documentId,
				})
				return { ok: true }
			}),

		delete: adminProcedure
			.input(z.object({ documentId: z.string().uuid() }))
			.handler(async ({ context, input }) => {
				const db = createDb(context.env)
				const [doc] = await db
					.select()
					.from(portalDocument)
					.where(eq(portalDocument.id, input.documentId))
					.limit(1)
				if (!doc) {
					throw new ORPCError("NOT_FOUND", { message: "Document not found" })
				}
				if (context.env.PORTAL_FILES) {
					await context.env.PORTAL_FILES.delete(doc.r2Key)
				}
				await db
					.delete(portalDocument)
					.where(eq(portalDocument.id, input.documentId))
				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "document.deleted",
					entityType: "portal_document",
					entityId: input.documentId,
				})
				return { ok: true }
			}),
	},

	portal: {
		preview: adminProcedure
			.input(customerIdInput)
			.handler(async ({ context, input }) => {
				await writeAuditLog(context.env, {
					actorUserId: context.user.id,
					action: "portal.view_as_customer",
					entityType: "customer",
					entityId: input.customerId,
				})
				return getPortalStatus(
					context.env,
					context.user,
					input.customerId,
				)
			}),
	},
}
