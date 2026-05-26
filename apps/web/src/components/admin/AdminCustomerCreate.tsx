"use client"

import { useState } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { getOrpc } from "@/lib/orpc"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function AdminCustomerCreate() {
	const [displayName, setDisplayName] = useState("")
	const [notes, setNotes] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const { id } = await getOrpc().admin.customers.create({
				displayName,
				notes: notes || undefined,
			})
			window.location.href = `/admin/customers/${id}`
		} catch {
			setError("Could not create customer.")
			setLoading(false)
		}
	}

	return (
		<AdminLayout title="New customer">
			<form onSubmit={handleSubmit} className="max-w-md space-y-4">
				<Field>
					<FieldLabel htmlFor="displayName">Display name</FieldLabel>
					<Input
						id="displayName"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
						required
						disabled={loading}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="notes">Notes (internal)</FieldLabel>
					<Input
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						disabled={loading}
					/>
				</Field>
				{error ? (
					<p className="text-sm text-destructive" role="alert">
						{error}
					</p>
				) : null}
				<Button type="submit" disabled={loading}>
					{loading ? "Creating…" : "Create customer"}
				</Button>
			</form>
		</AdminLayout>
	)
}
