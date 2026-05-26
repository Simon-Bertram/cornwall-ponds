import { createDb } from "@cornwall-ponds/db"
import { portalDocument } from "@cornwall-ponds/db/schema/portal"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { canUserAccessDocument } from "@cornwall-ponds/api/lib/document-access"
import { newId } from "@cornwall-ponds/api/lib/ids"
import { writeAuditLog } from "@cornwall-ponds/api/lib/audit"
import { sessionUserToPortalUser } from "@cornwall-ponds/api/lib/user"
import {
	claimPendingEmailForUser,
	ensureAdminRole,
} from "@cornwall-ponds/api/lib/portal-access"
import type { ServerHonoVariables } from "@cornwall-ponds/api/context"
import type { Context } from "hono"

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

type PortalContext = Context<{
	Bindings: ServerEnv
	Variables: ServerHonoVariables
}>

async function resolveSessionUser(c: PortalContext) {
	const auth = c.get("auth")
	const session = await auth.api.getSession({ headers: c.req.raw.headers })
	if (!session?.user) {
		return null
	}
	const portalUser = sessionUserToPortalUser(session.user)
	await ensureAdminRole(c.env, portalUser)
	await claimPendingEmailForUser(c.env, portalUser)
	return portalUser
}

export async function handlePortalDocumentUpload(c: PortalContext) {
	const portalUser = await resolveSessionUser(c)
	if (!portalUser || portalUser.role !== "admin") {
		return c.json({ error: "Forbidden" }, 403)
	}

	if (!c.env.PORTAL_FILES) {
		return c.json({ error: "File storage not configured" }, 503)
	}

	const formData = await c.req.formData()
	const file = formData.get("file")
	const customerId = formData.get("customerId")
	const type = formData.get("type")
	const title = formData.get("title")
	const description = formData.get("description")
	const publish = formData.get("publish") === "true"

	if (!(file instanceof File)) {
		return c.json({ error: "file is required" }, 400)
	}
	if (typeof customerId !== "string" || !customerId) {
		return c.json({ error: "customerId is required" }, 400)
	}
	if (
		type !== "contract" &&
		type !== "quote" &&
		type !== "maintenance_guide"
	) {
		return c.json({ error: "Invalid document type" }, 400)
	}
	if (typeof title !== "string" || !title.trim()) {
		return c.json({ error: "title is required" }, 400)
	}
	if (file.size > MAX_UPLOAD_BYTES) {
		return c.json({ error: "File too large (max 25MB)" }, 400)
	}

	const documentId = newId()
	const r2Key = `customers/${customerId}/${documentId}/${file.name}`

	await c.env.PORTAL_FILES.put(r2Key, file.stream(), {
		httpMetadata: {
			contentType: file.type || "application/octet-stream",
		},
	})

	const db = createDb(c.env)
	const now = new Date()
	await db.insert(portalDocument).values({
		id: documentId,
		customerId,
		type,
		title: title.trim(),
		description:
			typeof description === "string" && description
				? description.trim()
				: null,
		r2Key,
		mimeType: file.type || "application/octet-stream",
		sizeBytes: file.size,
		uploadedByUserId: portalUser.id,
		publishedAt: publish ? now : null,
	})

	await writeAuditLog(c.env, {
		actorUserId: portalUser.id,
		action: "document.uploaded",
		entityType: "portal_document",
		entityId: documentId,
		metadata: { customerId, type },
	})

	if (publish) {
		const { notifyCustomerOfPublishedDocument } = await import(
			"@cornwall-ponds/api/lib/portal-notify"
		)
		await notifyCustomerOfPublishedDocument(c.env, {
			documentId,
			customerId,
			title: title.trim(),
			type,
		})
	}

	return c.json({ id: documentId, published: publish })
}

export async function handlePortalDocumentDownload(c: PortalContext) {
	const portalUser = await resolveSessionUser(c)
	if (!portalUser) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	if (!c.env.PORTAL_FILES) {
		return c.json({ error: "File storage not configured" }, 503)
	}

	const documentId = c.req.param("documentId")
	const viewAsCustomerId = c.req.query("customerId")

	const access = await canUserAccessDocument(c.env, {
		userId: portalUser.id,
		userRole: portalUser.role,
		documentId,
		viewAsCustomerId,
	})

	if (!access.allowed || !access.r2Key) {
		return c.json({ error: "Forbidden" }, 403)
	}

	const object = await c.env.PORTAL_FILES.get(access.r2Key)
	if (!object) {
		return c.json({ error: "Not found" }, 404)
	}

	const headers = new Headers()
	if (access.mimeType) {
		headers.set("Content-Type", access.mimeType)
	}
	headers.set("Cache-Control", "private, no-store")

	return new Response(object.body, { headers })
}
