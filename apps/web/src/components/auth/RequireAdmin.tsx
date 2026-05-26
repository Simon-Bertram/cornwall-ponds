"use client"

import { useEffect, useState, type ReactNode } from "react"

import { getAuthClient } from "@/lib/auth-client"

type RequireAdminProps = {
	children: ReactNode
}

export function RequireAdmin({ children }: RequireAdminProps) {
	const [allowed, setAllowed] = useState<boolean | null>(null)

	useEffect(() => {
		let cancelled = false

		async function check() {
			try {
				const { data } = await getAuthClient().getSession()
				if (cancelled) return
				const role =
					typeof data?.user?.role === "string" ? data.user.role : "customer"
				if (role !== "admin") {
					window.location.href = "/dashboard"
					return
				}
				setAllowed(true)
			} catch {
				if (!cancelled) {
					window.location.href = "/login"
				}
			}
		}

		void check()
		return () => {
			cancelled = true
		}
	}, [])

	if (allowed !== true) {
		return (
			<p className="text-sm text-muted-foreground">Checking access…</p>
		)
	}

	return <>{children}</>
}
