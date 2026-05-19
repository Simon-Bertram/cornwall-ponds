import {
	TURNSTILE_RESPONSE_FIELD,
	TURNSTILE_SITEVERIFY_URL,
	TURNSTILE_TOKEN_HEADER,
} from "./constants"

export type TurnstileVerifyResult = {
	success: boolean
	errorCodes?: string[]
}

export function isTurnstileEnabled(secret?: string): boolean {
	return Boolean(secret?.trim())
}

export function getTurnstileTokenFromHeaders(
	headers: Headers,
): string | undefined {
	const headerToken = headers.get(TURNSTILE_TOKEN_HEADER)?.trim()
	if (headerToken) {
		return headerToken
	}
	return undefined
}

export async function getTurnstileTokenFromFormBody(
	request: Request,
): Promise<string | undefined> {
	const contentType = request.headers.get("content-type") ?? ""
	if (!contentType.includes("application/x-www-form-urlencoded")) {
		if (!contentType.includes("multipart/form-data")) {
			return undefined
		}
	}

	try {
		const formData = await request.clone().formData()
		const token = formData.get(TURNSTILE_RESPONSE_FIELD)
		return typeof token === "string" && token ? token : undefined
	} catch {
		return undefined
	}
}

export async function verifyTurnstileToken(options: {
	secret: string
	token: string
	remoteIp?: string
}): Promise<TurnstileVerifyResult> {
	const body = new URLSearchParams({
		secret: options.secret,
		response: options.token,
	})
	if (options.remoteIp) {
		body.set("remoteip", options.remoteIp)
	}

	const response = await fetch(TURNSTILE_SITEVERIFY_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body,
	})

	if (!response.ok) {
		return { success: false, errorCodes: ["internal-error"] }
	}

	const data = (await response.json()) as {
		success?: boolean
		"error-codes"?: string[]
	}

	return {
		success: data.success === true,
		errorCodes: data["error-codes"],
	}
}

export async function requireTurnstile(options: {
	secret?: string
	token: string | undefined
	remoteIp?: string
}): Promise<TurnstileVerifyResult> {
	if (!isTurnstileEnabled(options.secret)) {
		return { success: true }
	}

	if (!options.token) {
		return { success: false, errorCodes: ["missing-input-response"] }
	}

	return verifyTurnstileToken({
		secret: options.secret!,
		token: options.token,
		remoteIp: options.remoteIp,
	})
}
