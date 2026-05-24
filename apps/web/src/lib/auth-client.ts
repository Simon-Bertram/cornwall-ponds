import { createAuthClient } from "better-auth/client"
import { magicLinkClient } from "better-auth/client/plugins"

import { getClientPublicServerUrl } from "@/lib/client-public-server-url"

function createConfiguredAuthClient() {
	return createAuthClient({
		baseURL: getClientPublicServerUrl(),
		plugins: [magicLinkClient()],
	})
}

type AuthClient = ReturnType<typeof createConfiguredAuthClient>

let client: AuthClient | undefined

/** Client-only; reads API URL from Layout meta (Worker binding) when available. */
export function getAuthClient(): AuthClient {
	if (!client) {
		client = createConfiguredAuthClient()
	}
	return client
}
