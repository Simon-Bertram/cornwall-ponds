import { getClientPublicServerUrl } from "@/lib/client-public-server-url"

export function portalDocumentDownloadUrl(
	documentId: string,
	viewAsCustomerId?: string,
): string {
	const base = getClientPublicServerUrl()
	const url = new URL(
		`/api/portal/documents/${documentId}/download`,
		base,
	)
	if (viewAsCustomerId) {
		url.searchParams.set("customerId", viewAsCustomerId)
	}
	return url.href
}
