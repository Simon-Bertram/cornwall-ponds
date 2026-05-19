import { Resend } from "resend"

import { MagicLinkEmail } from "./emails/magic-link"
import type { AuthEnv } from "./types"

export type SendMagicLinkEmailParams = {
	email: string
	url: string
	token?: string
}

export async function sendMagicLinkEmail(
	env: AuthEnv,
	{ email, url, token }: SendMagicLinkEmailParams,
) {
	const apiKey = env.RESEND_API_KEY
	if (!apiKey) {
		throw new Error("RESEND_API_KEY is not configured")
	}

	const from = env.RESEND_FROM_EMAIL ?? "Auth <onboarding@resend.dev>"
	const resend = new Resend(apiKey)

	const { data, error } = await resend.emails.send({
		from,
		to: [email],
		subject: "Sign in to Cornwall Ponds",
		react: MagicLinkEmail({ signInUrl: url }),
		...(token ? { idempotencyKey: `magic-link/${token}` } : {}),
	})

	if (error) {
		throw new Error(error.message)
	}

	return data
}
