import { defineMiddleware } from "astro:middleware";
import { ENABLE_SSR_PROTECTED_REDIRECT } from "astro:env/server";

import { resolveSsrSession } from "@/lib/ssr-session";

const PROTECTED_PREFIXES = ["/dashboard", "/account"] as const;

function isTruthyEnvFlag(value: unknown): boolean {
	if (value === true) return true;
	if (value === "1") return true;
	if (typeof value === "string" && value.toLowerCase() === "true") return true;
	return false;
}

function withSecurityHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("X-Content-Type-Options", "nosniff");
	headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=()",
	);
	headers.set("X-Frame-Options", "DENY");

	if (import.meta.env.PROD) {
		headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains",
		);
	}

	const serverUrl = import.meta.env.PUBLIC_SERVER_URL ?? "";
	const connectParts = [
		"'self'",
		serverUrl,
		"https://challenges.cloudflare.com",
	];
	if (import.meta.env.DEV) {
		connectParts.push("ws:", "wss:");
	}
	const workerSrc =
		import.meta.env.DEV
			? "'self' blob:" /* Vite dev uses blob: workers */
			: "'self'";
	headers.set(
		"Content-Security-Policy",
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https: blob:",
			"font-src 'self' https: data:",
			`connect-src ${connectParts.join(" ")}`,
			`worker-src ${workerSrc}`,
			"frame-src https://challenges.cloudflare.com",
			"base-uri 'self'",
			"form-action 'self'",
		].join("; "),
	);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

export const onRequest = defineMiddleware(async (context, next) => {
	const path = context.url.pathname;
	const needsAuth = PROTECTED_PREFIXES.some(
		(p) => path === p || path.startsWith(`${p}/`),
	);

	const { session, user } = await resolveSsrSession(context.request);
	context.locals.session = session;
	context.locals.user = user;

	if (isTruthyEnvFlag(ENABLE_SSR_PROTECTED_REDIRECT) && needsAuth && !user) {
		return withSecurityHeaders(context.redirect("/login"));
	}

	const response = await next();
	return withSecurityHeaders(response);
});
