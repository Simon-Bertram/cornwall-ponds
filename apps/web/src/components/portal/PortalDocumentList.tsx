"use client"

import { portalDocumentDownloadUrl } from "@/lib/portal-download-url"

export type PortalDocumentItem = {
	id: string
	type: string
	title: string
	description: string | null
	mimeType: string
	sizeBytes: number
	publishedAt: Date | null
	createdAt: Date
}

type PortalDocumentListProps = {
	documents: PortalDocumentItem[]
	viewAsCustomerId?: string
	emptyMessage: string
	showDrafts?: boolean
}

function formatType(type: string): string {
	switch (type) {
		case "maintenance_guide":
			return "Care guide"
		case "quote":
			return "Quote"
		case "contract":
			return "Contract"
		default:
			return type
	}
}

function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function PortalDocumentList({
	documents,
	viewAsCustomerId,
	emptyMessage,
	showDrafts = false,
}: PortalDocumentListProps) {
	if (documents.length === 0) {
		return (
			<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
				<p className="text-sm text-muted-foreground">{emptyMessage}</p>
			</div>
		)
	}

	return (
		<ul className="space-y-3">
			{documents.map((doc) => (
				<li
					key={doc.id}
					className="flex flex-col gap-2 rounded-lg border border-border/15 bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<p className="font-medium text-primary">{doc.title}</p>
						<p className="text-sm text-muted-foreground">
							{formatType(doc.type)} · {formatSize(doc.sizeBytes)}
							{showDrafts && !doc.publishedAt ? " · Draft" : ""}
						</p>
						{doc.description ? (
							<p className="mt-1 text-sm text-muted-foreground">
								{doc.description}
							</p>
						) : null}
					</div>
					<a
						href={portalDocumentDownloadUrl(doc.id, viewAsCustomerId)}
						className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
						download
					>
						Download
					</a>
				</li>
			))}
		</ul>
	)
}
