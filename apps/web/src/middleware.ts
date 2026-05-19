import { defineMiddleware } from "astro:middleware";

import { resolveSsrSession } from "@/lib/ssr-session";

export const onRequest = defineMiddleware(async (context, next) => {
	const { session, user } = await resolveSsrSession(context.request);

	context.locals.session = session;
	context.locals.user = user;

	return next();
});
