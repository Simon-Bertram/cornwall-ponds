"use client"

import { useCallback, useEffect, useState } from "react"

import { AdminLayout } from "@/components/admin/AdminLayout"
import { getClientPublicServerUrl } from "@/lib/client-public-server-url"
import { getOrpc } from "@/lib/orpc"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type AdminCustomerDetailProps = {
	customerId: string
}

type CustomerDetail = {
	customer: { id: string; displayName: string; notes: string | null }
	emails: Array<{
		id: string
		email: string
		status: string
	}>
	members: Array<{ email: string; name: string }>
	documents: Array<{
		id: string
		type: string
		title: string
		publishedAt: Date | null
	}>
}

export function AdminCustomerDetail({ customerId }: AdminCustomerDetailProps) {
	const [detail, setDetail] = useState<CustomerDetail | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [newEmail, setNewEmail] = useState("")
	const [sendWelcome, setSendWelcome] = useState(true)
	const [uploadTitle, setUploadTitle] = useState("")
	const [uploadType, setUploadType] = useState<
		"contract" | "quote" | "maintenance_guide"
	>("contract")
	const [publishOnUpload, setPublishOnUpload] = useState(false)
	const [busy, setBusy] = useState(false)

	const load = useCallback(async () => {
		try {
			const data = await getOrpc().admin.customers.get({ customerId })
			setDetail(data as CustomerDetail)
		} catch {
			setError("Could not load customer.")
		}
	}, [customerId])

	useEffect(() => {
		void load()
	}, [load])

	async function handleAddEmail(event: React.SubmitEvent) {
		event.preventDefault()
		setBusy(true)
		setError(null)
		try {
			await getOrpc().admin.customers.addEmail({
				customerId,
				email: newEmail,
				sendWelcomeEmail: sendWelcome,
			})
			setNewEmail("")
			await load()
		} catch {
			setError("Could not add email.")
		} finally {
			setBusy(false)
		}
	}

	async function handleUpload(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault()
		const form = event.currentTarget
		const fileInput = form.elements.namedItem("file") as HTMLInputElement
		const file = fileInput.files?.[0]
		if (!file || !uploadTitle.trim()) {
			setError("File and title are required.")
			return
		}

		setBusy(true)
		setError(null)
		try {
			const body = new FormData()
			body.set("file", file)
			body.set("customerId", customerId)
			body.set("type", uploadType)
			body.set("title", uploadTitle.trim())
			body.set("publish", publishOnUpload ? "true" : "false")

			const response = await fetch(
				`${getClientPublicServerUrl()}/api/admin/documents/upload`,
				{
					method: "POST",
					body,
					credentials: "include",
				},
			)
			if (!response.ok) {
				const json = (await response.json()) as { error?: string }
				throw new Error(json.error ?? "Upload failed")
			}
			setUploadTitle("")
			fileInput.value = ""
			await load()
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Could not upload document.",
			)
		} finally {
			setBusy(false)
		}
	}

	async function handlePublish(documentId: string) {
		setBusy(true)
		try {
			await getOrpc().admin.documents.publish({ documentId })
			await load()
		} catch {
			setError("Could not publish document.")
		} finally {
			setBusy(false)
		}
	}

	async function handleDelete(documentId: string) {
		if (!confirm("Delete this document?")) return
		setBusy(true)
		try {
			await getOrpc().admin.documents.delete({ documentId })
			await load()
		} catch {
			setError("Could not delete document.")
		} finally {
			setBusy(false)
		}
	}

	if (!detail) {
		return (
			<AdminLayout title="Customer">
				<p className="text-sm text-muted-foreground">Loading…</p>
			</AdminLayout>
		)
	}

	return (
		<AdminLayout title={detail.customer.displayName}>
			<div className="space-y-10">
				{error ? (
					<p className="text-sm text-destructive" role="alert">
						{error}
					</p>
				) : null}

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-primary">Portal access</h2>
					<a
						href={`/dashboard?customerId=${customerId}`}
						className="text-sm underline-offset-2 hover:underline"
					>
						View portal as customer
					</a>
					<ul className="space-y-1 text-sm">
						{detail.emails.map((e) => (
							<li key={e.id}>
								{e.email}{" "}
								<span className="text-muted-foreground">({e.status})</span>
							</li>
						))}
					</ul>
					{detail.members.length > 0 ? (
						<ul className="space-y-1 text-sm text-muted-foreground">
							{detail.members.map((m) => (
								<li key={m.email}>
									{m.name} — {m.email}
								</li>
							))}
						</ul>
					) : null}
					<form
						onSubmit={handleAddEmail}
						className="flex flex-col gap-3 sm:flex-row sm:items-end"
					>
						<Field className="flex-1">
							<FieldLabel htmlFor="newEmail">Add email</FieldLabel>
							<Input
								id="newEmail"
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								required
								disabled={busy}
							/>
						</Field>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={sendWelcome}
								onChange={(e) => setSendWelcome(e.target.checked)}
								disabled={busy}
							/>
							Send welcome email
						</label>
						<Button type="submit" disabled={busy}>
							Add
						</Button>
					</form>
				</section>

				<section className="space-y-3">
					<h2 className="text-xl font-semibold text-primary">Documents</h2>
					<ul className="space-y-2">
						{detail.documents.map((doc) => (
							<li
								key={doc.id}
								className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/15 px-3 py-2 text-sm"
							>
								<span>
									{doc.title}{" "}
									<span className="text-muted-foreground">
										({doc.type}
										{doc.publishedAt ? ", published" : ", draft"})
									</span>
								</span>
								<span className="flex gap-2">
									{!doc.publishedAt ? (
										<Button
											type="button"
											size="sm"
											variant="outline"
											disabled={busy}
											onClick={() => handlePublish(doc.id)}
										>
											Publish
										</Button>
									) : null}
									<Button
										type="button"
										size="sm"
										variant="outline"
										disabled={busy}
										onClick={() => handleDelete(doc.id)}
									>
										Delete
									</Button>
								</span>
							</li>
						))}
					</ul>

					<form onSubmit={handleUpload} className="max-w-lg space-y-3">
						<h3 className="text-sm font-medium">Upload document</h3>
						<Field>
							<FieldLabel htmlFor="uploadTitle">Title</FieldLabel>
							<Input
								id="uploadTitle"
								value={uploadTitle}
								onChange={(e) => setUploadTitle(e.target.value)}
								required
								disabled={busy}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="uploadType">Type</FieldLabel>
							<select
								id="uploadType"
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								value={uploadType}
								onChange={(e) =>
									setUploadType(
										e.target.value as typeof uploadType,
									)
								}
								disabled={busy}
							>
								<option value="contract">Contract</option>
								<option value="quote">Quote</option>
								<option value="maintenance_guide">Care guide</option>
							</select>
						</Field>
						<Field>
							<FieldLabel htmlFor="file">File (PDF, max 25MB)</FieldLabel>
							<Input
								id="file"
								name="file"
								type="file"
								accept="application/pdf,.pdf"
								required
								disabled={busy}
							/>
						</Field>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={publishOnUpload}
								onChange={(e) => setPublishOnUpload(e.target.checked)}
								disabled={busy}
							/>
							Publish immediately (notifies customer)
						</label>
						<Button type="submit" disabled={busy}>
							Upload
						</Button>
					</form>
				</section>
			</div>
		</AdminLayout>
	)
}
