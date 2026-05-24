import type { AppRouterClient } from "@cornwall-ponds/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import { getClientPublicServerUrl } from "@/lib/client-public-server-url";

/** No per-call client context; matches default oRPC `ClientContext`. */
type OrpcClientContext = Record<never, never>;

let link: RPCLink<OrpcClientContext> | undefined;
let client: AppRouterClient | undefined;

function getLink(): RPCLink<OrpcClientContext> {
	if (!link) {
		link = new RPCLink({
			url: `${getClientPublicServerUrl()}/rpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		});
	}
	return link;
}

/** Client-only; reads API URL from Layout meta (Worker binding) when available. */
export function getOrpc(): AppRouterClient {
	if (!client) {
		client = createORPCClient<AppRouterClient>(getLink());
	}
	return client;
}
