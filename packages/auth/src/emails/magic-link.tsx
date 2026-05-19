import * as React from "react"

export interface MagicLinkEmailProps {
	signInUrl: string
}

export function MagicLinkEmail({ signInUrl }: MagicLinkEmailProps) {
	return (
		<div>
			<h1>Sign in to Cornwall Ponds</h1>
			<p>Click the button below to sign in. This link expires shortly.</p>
			<p>
				<a href={signInUrl}>Sign in</a>
			</p>
		</div>
	)
}
