import { createDb } from "@cornwall-ponds/db"
import { customerEmail, customerMember } from "@cornwall-ponds/db/schema/portal"
import { user } from "@cornwall-ponds/db/schema/auth"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import { eq } from "drizzle-orm"

type NotifyParams = {
	documentId: string
	customerId: string
	title: string
	type: string
}

/** Email linked members when a document is first published. */
export async function notifyCustomerOfPublishedDocument(
	env: ServerEnv,
	{ customerId, title, type }: NotifyParams,
) {
	if (!env.RESEND_API_KEY) return

	const db = createDb(env)
	const members = await db
		.select({ email: user.email })
		.from(customerMember)
		.innerJoin(user, eq(customerMember.userId, user.id))
		.where(eq(customerMember.customerId, customerId))

	const pendingEmails = await db
		.select({ email: customerEmail.email })
		.from(customerEmail)
		.where(eq(customerEmail.customerId, customerId))

	const recipients = new Set<string>()
	for (const m of members) {
		recipients.add(m.email)
	}
	for (const p of pendingEmails) {
		recipients.add(p.email)
	}

	if (recipients.size === 0) return

	const webUrl = env.WEB_URL ?? env.CORS_ORIGIN
	const portalUrl = `${webUrl}/dashboard`
	const apiKey = env.RESEND_API_KEY
	const from = env.RESEND_FROM_EMAIL ?? "Auth <onboarding@resend.dev>"

	const typeLabel =
		type === "maintenance_guide"
			? "care guide"
			: type === "quote"
				? "quote"
				: "contract"

	await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [...recipients],
			subject: `New ${typeLabel} available in your Cornwall Ponds portal`,
			html: `
				<p>A new ${typeLabel} has been added to your customer portal: <strong>${title}</strong>.</p>
				<p><a href="${portalUrl}">View your portal</a></p>
			`,
		}),
	})
}
