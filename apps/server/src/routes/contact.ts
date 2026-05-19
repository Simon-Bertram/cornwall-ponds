import {
	getTurnstileTokenFromFormBody,
	getTurnstileTokenFromHeaders,
	requireTurnstile,
} from "@cornwall-ponds/turnstile"
import type { ServerEnv } from "@cornwall-ponds/env/bindings"
import type { Context } from "hono"
import { z } from "zod"

const contactSchema = z.object({
	firstName: z.string().trim().min(1).max(100),
	lastName: z.string().trim().min(1).max(100),
	email: z.string().trim().email().max(320),
	phone: z.string().trim().min(1).max(50),
	service: z.string().trim().min(1).max(200),
	budget: z.string().trim().min(1).max(100),
	postcode: z.string().trim().min(1).max(20),
	message: z.string().trim().min(1).max(5000),
})

type ContactContext = Context<{ Bindings: ServerEnv }>

function getClientIp(request: Request): string | undefined {
	return (
		request.headers.get("cf-connecting-ip") ??
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
	)
}

async function parseContactPayload(c: ContactContext) {
	const contentType = c.req.header("content-type") ?? ""

	if (contentType.includes("application/json")) {
		const json = await c.req.json()
		return contactSchema.parse(json)
	}

	const formData = await c.req.formData()
	return contactSchema.parse({
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
		email: formData.get("email"),
		phone: formData.get("phone"),
		service: formData.get("service"),
		budget: formData.get("budget"),
		postcode: formData.get("postcode"),
		message: formData.get("message"),
	})
}

async function sendContactEmail(
	env: ServerEnv,
	payload: z.infer<typeof contactSchema>,
) {
	const apiKey = env.RESEND_API_KEY
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is not configured")
	}

	const to = env.CONTACT_TO_EMAIL
	if (!to) {
		throw new Error("CONTACT_TO_EMAIL is not configured")
	}

	const from = env.RESEND_FROM_EMAIL ?? "Cornwall Ponds <onboarding@resend.dev>"
	const subject = `Quote enquiry: ${payload.service} (${payload.postcode})`
	const text = [
		`Name: ${payload.firstName} ${payload.lastName}`,
		`Email: ${payload.email}`,
		`Phone: ${payload.phone}`,
		`Service: ${payload.service}`,
		`Budget: ${payload.budget}`,
		`Postcode: ${payload.postcode}`,
		"",
		"Message:",
		payload.message,
	].join("\n")

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: payload.email,
			subject,
			text,
		}),
	})

	if (!response.ok) {
		const body = await response.text()
		throw new Error(`Resend error (${response.status}): ${body}`)
	}
}

export async function handleContactPost(c: ContactContext) {
	const token =
		getTurnstileTokenFromHeaders(c.req.raw.headers) ??
		(await getTurnstileTokenFromFormBody(c.req.raw))

	const turnstile = await requireTurnstile({
		secret: c.env.TURNSTILE_SECRET_KEY,
		token,
		remoteIp: getClientIp(c.req.raw),
	})

	if (!turnstile.success) {
		return c.json(
			{
				error: "Turnstile verification failed",
				code: "TURNSTILE_FAILED",
			},
			403,
		)
	}

	let payload: z.infer<typeof contactSchema>
	try {
		payload = await parseContactPayload(c)
	} catch {
		return c.json({ error: "Invalid form data", code: "VALIDATION_ERROR" }, 400)
	}

	try {
		const deliver = () => sendContactEmail(c.env, payload)
		if (c.executionCtx) {
			c.executionCtx.waitUntil(deliver())
		} else {
			await deliver()
		}
	} catch (error) {
		console.error("Contact email failed:", error)
		return c.json(
			{ error: "Could not send your enquiry", code: "EMAIL_FAILED" },
			503,
		)
	}

	return c.json({ ok: true })
}
