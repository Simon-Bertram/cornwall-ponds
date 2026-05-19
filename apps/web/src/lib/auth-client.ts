import { PUBLIC_SERVER_URL } from "astro:env/client"
import { createAuthClient } from "better-auth/client"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
	baseURL: PUBLIC_SERVER_URL,
	plugins: [magicLinkClient()],
})
