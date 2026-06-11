import { createAuthClient } from "better-auth/client"
import {
	inferAdditionalFields,
	magicLinkClient,
} from "better-auth/client/plugins"

import { getClientPublicServerUrl } from "@/lib/client-public-server-url"

function createConfiguredAuthClient() {
	return createAuthClient({
		baseURL: getClientPublicServerUrl(),
		plugins: [
			magicLinkClient(),
			// Mirrors user.additionalFields in packages/auth/src/options.ts so
			// session types include `role` (keep both in sync).
			inferAdditionalFields({
				user: {
					role: { type: "string", required: false },
				},
			}),
		],
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
