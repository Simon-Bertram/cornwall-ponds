"use client"

import { useEffect, useState } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { getOrpc } from "@/lib/orpc"

type CustomerRow = {
	id: string
	displayName: string
	createdAt: Date
}

export function AdminCustomersList() {
	const [customers, setCustomers] = useState<CustomerRow[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		void getOrpc()
			.admin.customers.list()
			.then((data) => setCustomers(data.customers as CustomerRow[]))
			.catch(() => setError("Could not load customers."))
	}, [])

	return (
		<AdminLayout title="Customers">
			<div className="mb-6">
				<a
					href="/admin/customers/new"
					className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
				>
					New customer
				</a>
			</div>
			{error ? (
				<p className="text-sm text-destructive" role="alert">
					{error}
				</p>
			) : null}
			<ul className="divide-y divide-border/15 rounded-lg border border-border/15">
				{customers.map((c) => (
					<li key={c.id}>
						<a
							href={`/admin/customers/${c.id}`}
							className="flex items-center justify-between px-4 py-3 hover:bg-muted/40"
						>
							<span className="font-medium text-primary">{c.displayName}</span>
							<span className="text-sm text-muted-foreground">Manage →</span>
						</a>
					</li>
				))}
			</ul>
			{customers.length === 0 && !error ? (
				<p className="mt-4 text-sm text-muted-foreground">No customers yet.</p>
			) : null}
		</AdminLayout>
	)
}
