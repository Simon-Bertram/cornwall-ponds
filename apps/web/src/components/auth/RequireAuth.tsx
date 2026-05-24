"use client"

import { useEffect, useState } from "react"

import { getAuthClient } from "@/lib/auth-client"

type AuthStatus = "loading" | "authed" | "guest"

type RequireAuthProps = {
	children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
	const [status, setStatus] = useState<AuthStatus>("loading")

	useEffect(() => {
		let cancelled = false

		async function checkSession() {
			try {
				const { data } = await getAuthClient().getSession()
				if (cancelled) return
				if (data?.user) {
					setStatus("authed")
					return
				}
			} catch {
				// treat as unauthenticated
			}
			if (!cancelled) {
				setStatus("guest")
				window.location.replace("/login")
			}
		}

		void checkSession()

		return () => {
			cancelled = true
		}
	}, [])

	if (status === "loading") {
		return (
			<p className="text-sm text-neutral-400" aria-live="polite">
				Loading…
			</p>
		)
	}

	if (status === "guest") {
		return null
	}

	return <>{children}</>
}
