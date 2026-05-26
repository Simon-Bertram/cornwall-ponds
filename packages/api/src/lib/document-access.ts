import { createDb } from "@cornwall-ponds/db"
import { portalDocument } from "@cornwall-ponds/db/schema/portal"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { and, eq, isNotNull } from "drizzle-orm"

import { getCustomerIdForUser } from "./portal-access"

export async function canUserAccessDocument(
	env: ServerEnv,
	opts: {
		userId: string
		userRole: string
		documentId: string
		viewAsCustomerId?: string
	},
): Promise<{ allowed: boolean; r2Key?: string; mimeType?: string }> {
	const db = createDb(env)
	const [doc] = await db
		.select()
		.from(portalDocument)
		.where(eq(portalDocument.id, opts.documentId))
		.limit(1)

	if (!doc) {
		return { allowed: false }
	}

	if (opts.userRole === "admin") {
		if (opts.viewAsCustomerId && doc.customerId !== opts.viewAsCustomerId) {
			return { allowed: false }
		}
		return {
			allowed: true,
			r2Key: doc.r2Key,
			mimeType: doc.mimeType,
		}
	}

	const customerId = await getCustomerIdForUser(env, opts.userId)
	if (!customerId || doc.customerId !== customerId) {
		return { allowed: false }
	}

	if (!doc.publishedAt) {
		return { allowed: false }
	}

	return {
		allowed: true,
		r2Key: doc.r2Key,
		mimeType: doc.mimeType,
	}
}

export async function listPublishedDocumentsForCustomer(
	env: ServerEnv,
	customerId: string,
) {
	const db = createDb(env)
	return db
		.select()
		.from(portalDocument)
		.where(
			and(
				eq(portalDocument.customerId, customerId),
				isNotNull(portalDocument.publishedAt),
			),
		)
}
