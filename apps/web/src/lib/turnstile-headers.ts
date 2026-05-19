import { TURNSTILE_TOKEN_HEADER } from "@cornwall-ponds/turnstile"

export function turnstileHeaders(token: string | undefined): HeadersInit | undefined {
	if (!token) {
		return undefined
	}
	return { [TURNSTILE_TOKEN_HEADER]: token }
}
