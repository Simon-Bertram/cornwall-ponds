"use client"

import { useEffect, useState } from "react"

import { PortalDocumentList } from "@/components/portal/PortalDocumentList"
import type { PortalDocumentItem } from "@/components/portal/PortalDocumentList"
import { getAuthClient } from "@/lib/auth-client"
import { getOrpc } from "@/lib/orpc"

type DashboardContentProps = {
	initialDisplayName?: string
	initialEmail?: string | null
	/** Admin view-as-customer from query string. */
	viewAsCustomerId?: string
}

type PortalStatus =
	| {
			linked: false
			isAdmin: boolean
			pendingMessage?: string
	  }
	| {
			linked: true
			isAdmin: boolean
			viewAs?: boolean
			customer: { id: string; displayName: string } | null
	  }

export function DashboardContent({
	initialDisplayName,
	initialEmail,
	viewAsCustomerId,
}: DashboardContentProps) {
	const [displayName, setDisplayName] = useState(initialDisplayName ?? "User")
	const [email, setEmail] = useState(initialEmail ?? "—")
	const [portalStatus, setPortalStatus] = useState<PortalStatus | null>(null)
	const [contracts, setContracts] = useState<PortalDocumentItem[]>([])
	const [guides, setGuides] = useState<PortalDocumentItem[]>([])
	const [loadError, setLoadError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false

		async function load() {
			try {
				const { data } = await getAuthClient().getSession()
				if (!cancelled && data?.user) {
					const user = data.user
					setDisplayName(user.name || user.email?.split("@")[0] || "User")
					setEmail(user.email ?? "—")
				}

				const input = viewAsCustomerId
					? { customerId: viewAsCustomerId }
					: undefined

				await getOrpc().portal.bootstrap(input)
				const status = await getOrpc().portal.status(input)
				if (cancelled) return
				setPortalStatus(status as PortalStatus)

				if (status.linked || (status.isAdmin && viewAsCustomerId)) {
					const { documents } =
						await getOrpc().portal.documents.list(input)
					if (cancelled) return
					const items = documents as PortalDocumentItem[]
					setContracts(
						items.filter(
							(d) => d.type === "contract" || d.type === "quote",
						),
					)
					setGuides(
						items.filter((d) => d.type === "maintenance_guide"),
					)
				}
			} catch {
				if (!cancelled) {
					setLoadError("Could not load your portal. Please try again.")
				}
			}
		}

		void load()
		return () => {
			cancelled = true
		}
	}, [viewAsCustomerId])

	const isAdminView = Boolean(
		portalStatus &&
			"isAdmin" in portalStatus &&
			portalStatus.isAdmin &&
			viewAsCustomerId,
	)

	return (
		<main className="h-full min-h-0 w-full max-w-4xl px-4">
			{isAdminView ? (
				<p className="mb-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-900 dark:text-amber-100">
					Admin mode — viewing customer portal
					{portalStatus?.linked && portalStatus.customer
						? ` for ${portalStatus.customer.displayName}`
						: ""}
				</p>
			) : null}

			<h1 className="my-8 text-4xl font-bold text-primary">
				Welcome to your customer portal
			</h1>

			<div className="space-y-10">
				<div className="space-y-4">
					<div className="rounded-lg p-4">
						<p className="text-sm text-muted-foreground">Welcome back,</p>
						<p className="text-xl font-medium text-primary">{displayName}</p>
					</div>
					<div className="rounded-lg p-4">
						<p className="mb-2 text-sm text-muted-foreground">Email</p>
						<p className="text-primary">{email}</p>
					</div>
				</div>

				{loadError ? (
					<p className="text-sm text-destructive" role="alert">
						{loadError}
					</p>
				) : null}

				{portalStatus && !portalStatus.linked && !isAdminView ? (
					<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
						<p className="text-sm text-muted-foreground">
							{"pendingMessage" in portalStatus && portalStatus.pendingMessage
								? portalStatus.pendingMessage
								: "Your portal will populate once Cornwall Ponds links your project."}
						</p>
					</div>
				) : null}

				{(portalStatus?.linked || isAdminView) && (
					<>
						<section className="space-y-4">
							<div>
								<h2 className="text-2xl font-semibold text-primary">
									Job contracts and quotes
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									View signed contracts, pending quotes, and project proposals.
								</p>
							</div>
							<PortalDocumentList
								documents={contracts}
								viewAsCustomerId={viewAsCustomerId}
								emptyMessage="No contracts or quotes yet."
								showDrafts={isAdminView}
							/>
						</section>

						<section className="space-y-4">
							<div>
								<h2 className="text-2xl font-semibold text-primary">
									Aftercare
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									Care guides, maintenance schedules, and ongoing support for
									your pond.
								</p>
							</div>
							<PortalDocumentList
								documents={guides}
								viewAsCustomerId={viewAsCustomerId}
								emptyMessage="No care guides yet."
								showDrafts={isAdminView}
							/>
						</section>
					</>
				)}

				{portalStatus &&
				"isAdmin" in portalStatus &&
				portalStatus.isAdmin &&
				!viewAsCustomerId ? (
					<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
						<p className="text-sm text-muted-foreground">
							You are signed in as an administrator.{" "}
							<a href="/admin" className="underline-offset-2 hover:underline">
								Manage customers and documents
							</a>
						</p>
					</div>
				) : null}
			</div>
		</main>
	)
}
