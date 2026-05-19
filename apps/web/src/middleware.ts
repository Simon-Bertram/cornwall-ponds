import { defineMiddleware } from "astro:middleware";

import { resolveSsrSession } from "@/lib/ssr-session";
import type { WebWorkerEnv } from "@cornwall-ponds/env/web-worker";

const PROTECTED_PREFIXES = ["/dashboard"];

function isProtectedPath(pathname: string) {
	return PROTECTED_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

function getWebEnv(locals: App.Locals): WebWorkerEnv | undefined {
	const runtime = locals.runtime as { env?: WebWorkerEnv } | undefined;
	return runtime?.env;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const env = getWebEnv(context.locals);
	const { session, user } = await resolveSsrSession(context.request, env);

	context.locals.session = session;
	context.locals.user = user;

	if (isProtectedPath(context.url.pathname) && !user) {
		return context.redirect("/login");
	}

	return next();
});
