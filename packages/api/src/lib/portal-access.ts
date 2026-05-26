import { createDb } from "@cornwall-ponds/db"
import {
	customer,
	customerEmail,
	customerMember,
} from "@cornwall-ponds/db/schema/portal"
import { user } from "@cornwall-ponds/db/schema/auth"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { and, eq } from "drizzle-orm"

import { newId } from "./ids"
import { writeAuditLog } from "./audit"

export function normalizeEmail(email: string): string {
	return email.trim().toLowerCase()
}

export type PortalUser = {
	id: string
	email: string
	name: string
	role: string
}

/** Promote ADMIN_EMAIL user to admin role on bootstrap. */
export async function ensureAdminRole(env: ServerEnv, portalUser: PortalUser) {
	if (!env.ADMIN_EMAIL) return
	const adminEmail = normalizeEmail(env.ADMIN_EMAIL)
	if (normalizeEmail(portalUser.email) !== adminEmail) return
	if (portalUser.role === "admin") return

	const db = createDb(env)
	await db
		.update(user)
		.set({ role: "admin", updatedAt: new Date() })
		.where(eq(user.id, portalUser.id))
}

export async function claimPendingEmailForUser(
	env: ServerEnv,
	portalUser: PortalUser,
): Promise<{ customerId: string | null; claimed: boolean }> {
	const db = createDb(env)
	const email = normalizeEmail(portalUser.email)

	const [pending] = await db
		.select()
		.from(customerEmail)
		.where(
			and(eq(customerEmail.email, email), eq(customerEmail.status, "pending")),
		)
		.limit(1)

	if (!pending) {
		const [member] = await db
			.select({ customerId: customerMember.customerId })
			.from(customerMember)
			.where(eq(customerMember.userId, portalUser.id))
			.limit(1)
		return { customerId: member?.customerId ?? null, claimed: false }
	}

	const now = new Date()
	await db
		.update(customerEmail)
		.set({
			status: "claimed",
			claimedByUserId: portalUser.id,
			claimedAt: now,
		})
		.where(eq(customerEmail.id, pending.id))

	const [existingMember] = await db
		.select()
		.from(customerMember)
		.where(
			and(
				eq(customerMember.customerId, pending.customerId),
				eq(customerMember.userId, portalUser.id),
			),
		)
		.limit(1)

	if (!existingMember) {
		await db.insert(customerMember).values({
			id: newId(),
			customerId: pending.customerId,
			userId: portalUser.id,
			role: "primary",
		})
	}

	await writeAuditLog(env, {
		actorUserId: portalUser.id,
		action: "customer_email.claimed",
		entityType: "customer_email",
		entityId: pending.id,
		metadata: { customerId: pending.customerId },
	})

	return { customerId: pending.customerId, claimed: true }
}

export async function getCustomerIdForUser(
	env: ServerEnv,
	userId: string,
): Promise<string | null> {
	const db = createDb(env)
	const [member] = await db
		.select({ customerId: customerMember.customerId })
		.from(customerMember)
		.where(eq(customerMember.userId, userId))
		.limit(1)
	return member?.customerId ?? null
}

export async function getPortalStatus(
	env: ServerEnv,
	portalUser: PortalUser,
	viewAsCustomerId?: string,
) {
	const db = createDb(env)
	const isAdmin = portalUser.role === "admin"
	let customerId: string | null = null

	if (isAdmin && viewAsCustomerId) {
		const [row] = await db
			.select()
			.from(customer)
			.where(eq(customer.id, viewAsCustomerId))
			.limit(1)
		if (!row) {
			return { linked: false as const, isAdmin, viewAs: true }
		}
		customerId = row.id
	} else {
		customerId = await getCustomerIdForUser(env, portalUser.id)
	}

	if (!customerId) {
		return {
			linked: false as const,
			isAdmin,
			pendingMessage:
				"Your portal will populate once Cornwall Ponds links your project to this email.",
		}
	}

	const [customerRow] = await db
		.select()
		.from(customer)
		.where(eq(customer.id, customerId))
		.limit(1)

	return {
		linked: true as const,
		isAdmin,
		viewAs: Boolean(isAdmin && viewAsCustomerId),
		customer: customerRow
			? {
					id: customerRow.id,
					displayName: customerRow.displayName,
				}
			: null,
	}
}
