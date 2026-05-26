import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

import { user } from "./auth"

export const customer = sqliteTable("customer", {
	id: text("id").primaryKey(),
	displayName: text("display_name").notNull(),
	notes: text("notes"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull(),
})

export const customerEmail = sqliteTable(
	"customer_email",
	{
		id: text("id").primaryKey(),
		customerId: text("customer_id")
			.notNull()
			.references(() => customer.id, { onDelete: "cascade" }),
		email: text("email").notNull(),
		status: text("status", { enum: ["pending", "claimed"] })
			.notNull()
			.default("pending"),
		claimedByUserId: text("claimed_by_user_id").references(() => user.id, {
			onDelete: "set null",
		}),
		invitedAt: integer("invited_at", { mode: "timestamp_ms" }),
		claimedAt: integer("claimed_at", { mode: "timestamp_ms" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		uniqueIndex("customer_email_email_unique").on(table.email),
		index("customer_email_customerId_idx").on(table.customerId),
	],
)

export const customerMember = sqliteTable(
	"customer_member",
	{
		id: text("id").primaryKey(),
		customerId: text("customer_id")
			.notNull()
			.references(() => customer.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role", { enum: ["primary", "member"] })
			.notNull()
			.default("primary"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		uniqueIndex("customer_member_customer_user_unique").on(
			table.customerId,
			table.userId,
		),
		index("customer_member_userId_idx").on(table.userId),
	],
)

export const portalDocument = sqliteTable(
	"portal_document",
	{
		id: text("id").primaryKey(),
		customerId: text("customer_id")
			.notNull()
			.references(() => customer.id, { onDelete: "cascade" }),
		type: text("type", {
			enum: ["contract", "quote", "maintenance_guide"],
		}).notNull(),
		title: text("title").notNull(),
		description: text("description"),
		r2Key: text("r2_key").notNull(),
		mimeType: text("mime_type").notNull(),
		sizeBytes: integer("size_bytes").notNull(),
		uploadedByUserId: text("uploaded_by_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "restrict" }),
		publishedAt: integer("published_at", { mode: "timestamp_ms" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("portal_document_customerId_idx").on(table.customerId),
		index("portal_document_publishedAt_idx").on(table.publishedAt),
	],
)

export const auditLog = sqliteTable(
	"audit_log",
	{
		id: text("id").primaryKey(),
		actorUserId: text("actor_user_id").references(() => user.id, {
			onDelete: "set null",
		}),
		action: text("action").notNull(),
		entityType: text("entity_type").notNull(),
		entityId: text("entity_id"),
		metadata: text("metadata"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
	},
	(table) => [
		index("audit_log_actorUserId_idx").on(table.actorUserId),
		index("audit_log_entity_idx").on(table.entityType, table.entityId),
	],
)

export const customerRelations = relations(customer, ({ many }) => ({
	emails: many(customerEmail),
	members: many(customerMember),
	documents: many(portalDocument),
}))

export const customerEmailRelations = relations(customerEmail, ({ one }) => ({
	customer: one(customer, {
		fields: [customerEmail.customerId],
		references: [customer.id],
	}),
	claimedByUser: one(user, {
		fields: [customerEmail.claimedByUserId],
		references: [user.id],
	}),
}))

export const customerMemberRelations = relations(customerMember, ({ one }) => ({
	customer: one(customer, {
		fields: [customerMember.customerId],
		references: [customer.id],
	}),
	user: one(user, {
		fields: [customerMember.userId],
		references: [user.id],
	}),
}))

export const portalDocumentRelations = relations(portalDocument, ({ one }) => ({
	customer: one(customer, {
		fields: [portalDocument.customerId],
		references: [customer.id],
	}),
	uploadedBy: one(user, {
		fields: [portalDocument.uploadedByUserId],
		references: [user.id],
	}),
}))
