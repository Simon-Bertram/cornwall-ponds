"use client"

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { useRef } from "react"

import { PUBLIC_TURNSTILE_SITE_KEY } from "astro:env/client"

export type TurnstileFieldProps = {
	onTokenChange: (token: string) => void
	onError?: () => void
	className?: string
}

export function TurnstileField({
	onTokenChange,
	onError,
	className,
}: TurnstileFieldProps) {
	const widgetRef = useRef<TurnstileInstance>(null)

	if (!PUBLIC_TURNSTILE_SITE_KEY) {
		return null
	}

	return (
		<div className={className}>
			<Turnstile
				ref={widgetRef}
				siteKey={PUBLIC_TURNSTILE_SITE_KEY}
				onSuccess={onTokenChange}
				onExpire={() => {
					onTokenChange("")
					widgetRef.current?.reset()
				}}
				onError={() => {
					onTokenChange("")
					onError?.()
				}}
			/>
		</div>
	)
}
