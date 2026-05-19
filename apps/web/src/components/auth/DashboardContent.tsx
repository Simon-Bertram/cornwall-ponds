"use client"

import { useEffect, useState } from "react"

import { authClient } from "@/lib/auth-client"
import { orpc } from "@/lib/orpc"

type DashboardContentProps = {
	initialDisplayName?: string
	initialEmail?: string | null
}

export function DashboardContent({
	initialDisplayName,
	initialEmail,
}: DashboardContentProps) {
	const [displayName, setDisplayName] = useState(
		initialDisplayName ?? "User",
	)
	const [email, setEmail] = useState(initialEmail ?? "—")
	const [apiMessage, setApiMessage] = useState("Loading…")

	useEffect(() => {
		let cancelled = false

		async function loadSession() {
			try {
				const { data } = await authClient.getSession()
				if (cancelled || !data?.user) return
				const user = data.user
				setDisplayName(
					user.name || user.email?.split("@")[0] || "User",
				)
				setEmail(user.email ?? "—")
			} catch {
				// RequireAuth already gated; keep SSR fallbacks
			}
		}

		async function loadPrivateData() {
			try {
				const data = await orpc.privateData()
				if (!cancelled) {
					setApiMessage(data.message || "Connected to server")
				}
			} catch {
				if (!cancelled) {
					setApiMessage("Failed to load server data")
				}
			}
		}

		void loadSession()
		void loadPrivateData()

		return () => {
			cancelled = true
		}
	}, [])

	return (
		<div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
			<h1 className="mb-6 text-3xl font-bold text-white">Dashboard</h1>

			<div className="space-y-4">
				<div className="rounded-lg bg-neutral-800/50 p-4">
					<p className="text-sm text-neutral-400">Welcome back,</p>
					<p className="text-xl font-medium text-white">{displayName}</p>
				</div>

				<div className="rounded-lg bg-neutral-800/50 p-4">
					<p className="mb-2 text-sm text-neutral-400">Email</p>
					<p className="text-white">{email}</p>
				</div>

				<div className="rounded-lg bg-neutral-800/50 p-4">
					<p className="mb-2 text-sm text-neutral-400">Server Message</p>
					<p className="text-white">{apiMessage}</p>
				</div>
			</div>
		</div>
	)
}
