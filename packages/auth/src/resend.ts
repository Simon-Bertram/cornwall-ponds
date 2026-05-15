import type { AuthEnv } from "./types"

export type SendMagicLinkEmailParams = {
	email: string
	url: string
}

export async function sendMagicLinkEmail(
	env: AuthEnv,
	{ email, url }: SendMagicLinkEmailParams,
) {
	const apiKey = env.RESEND_API_KEY
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is not configured")
	}

	const from = env.RESEND_FROM_EMAIL ?? "Auth <onboarding@resend.dev>"

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: email,
			subject: "Sign in to Cornwall Ponds",
			html: `<p>Click <a href="${url}">here</a> to sign in. This link expires shortly.</p>`,
		}),
	})

	if (!res.ok) {
		const body = await res.text()
		throw new Error(`Resend request failed (${res.status}): ${body}`)
	}
}
