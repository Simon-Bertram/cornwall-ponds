import type { Session, User } from "@cornwall-ponds/auth";

/** Better Auth session endpoint on the API worker (not the Astro host). */
const SESSION_PATH = "/api/auth/get-session";

type GetSessionJson = {
	session: Session | null;
	user: User | null;
};

/**
 * Resolve the current user/session during Astro SSR (see middleware.ts).
 *
 * Proxies the incoming request's Cookie header to the API worker's get-session
 * endpoint. Better Auth stores session cookies on PUBLIC_SERVER_URL, not the
 * web origin — so in cross-origin production, locals.user is often null even
 * when the browser is signed in. Use client-side authClient.getSession() for
 * gating; do not rely on locals alone for authorization.
 */
export async function resolveSsrSession(
	request: Request,
	serverUrl: string,
): Promise<GetSessionJson> {
	if (!serverUrl) {
		return { session: null, user: null };
	}
	const cookie = request.headers.get("cookie");
	if (!cookie) {
		return { session: null, user: null };
	}

	// Forward only Cookie — API validates session and returns user/session JSON.
	const headers = new Headers({ cookie });

	try {
		const response = await fetch(new URL(SESSION_PATH, serverUrl), {
			method: "GET",
			headers,
			signal: AbortSignal.timeout(5_000),
		});

		if (!response.ok) {
			return { session: null, user: null };
		}

		const body = (await response.json()) as GetSessionJson | null;
		return {
			session: body?.session ?? null,
			user: body?.user ?? null,
		};
	} catch {
		return { session: null, user: null };
	}
}
