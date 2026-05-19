import type { Session, User } from "@cornwall-ponds/auth";
import { PUBLIC_SERVER_URL } from "astro:env/client";

const SESSION_PATH = "/api/auth/get-session";

type GetSessionJson = {
	session: Session | null;
	user: User | null;
};

export async function resolveSsrSession(
	request: Request,
): Promise<GetSessionJson> {
	const cookie = request.headers.get("cookie");
	if (!cookie) {
		return { session: null, user: null };
	}

	const headers = new Headers({ cookie });

	try {
		const response = await fetch(new URL(SESSION_PATH, PUBLIC_SERVER_URL), {
			method: "GET",
			headers,
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
