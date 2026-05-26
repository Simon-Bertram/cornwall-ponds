import type { AuthEnv } from "@cornwall-ponds/auth"

type PortalWelcomeParams = {
	email: string
	loginUrl: string
}

/** Sends a simple welcome pointing users to the unified login page. */
export async function sendPortalWelcomeEmail(
	env: AuthEnv,
	{ email, loginUrl }: PortalWelcomeParams,
) {
	if (!env.RESEND_API_KEY) {
		console.warn("RESEND_API_KEY not set; skipping portal welcome email")
		return
	}

	const apiKey = env.RESEND_API_KEY
	const from = env.RESEND_FROM_EMAIL ?? "Auth <onboarding@resend.dev>"

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from,
			to: [email],
			subject: "Your Cornwall Ponds customer portal is ready",
			html: `
				<p>Your Cornwall Ponds customer portal is ready.</p>
				<p><a href="${loginUrl}">Continue with email</a> to access your contracts and care guides.</p>
			`,
		}),
	})

	if (!response.ok) {
		const text = await response.text()
		console.error("Failed to send portal welcome email", text)
	}
}
