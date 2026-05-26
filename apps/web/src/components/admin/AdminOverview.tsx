"use client"

import { useEffect, useState } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { getOrpc } from "@/lib/orpc"

export function AdminOverview() {
	const [customerCount, setCustomerCount] = useState<number | null>(null)

	useEffect(() => {
		void getOrpc()
			.admin.customers.list()
			.then((data) => setCustomerCount(data.customers.length))
			.catch(() => setCustomerCount(0))
	}, [])

	return (
		<AdminLayout title="Admin">
			<div className="space-y-6">
				<p className="text-muted-foreground">
					Provision customer portals, link emails, and upload contracts and care
					guides.
				</p>
				<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
					<p className="text-sm text-muted-foreground">Customers</p>
					<p className="text-3xl font-semibold text-primary">
						{customerCount === null ? "…" : customerCount}
					</p>
				</div>
				<a
					href="/admin/customers/new"
					className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
				>
					Create customer
				</a>
			</div>
		</AdminLayout>
	)
}
