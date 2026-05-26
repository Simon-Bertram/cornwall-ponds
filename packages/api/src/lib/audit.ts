import { createDb } from "@cornwall-ponds/db"
import { auditLog } from "@cornwall-ponds/db/schema/portal"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"

import { newId } from "./ids"

export async function writeAuditLog(
	env: ServerEnv,
	entry: {
		actorUserId?: string | null
		action: string
		entityType: string
		entityId?: string | null
		metadata?: Record<string, unknown>
	},
) {
	const db = createDb(env)
	await db.insert(auditLog).values({
		id: newId(),
		actorUserId: entry.actorUserId ?? null,
		action: entry.action,
		entityType: entry.entityType,
		entityId: entry.entityId ?? null,
		metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
	})
}
