/**
 * Runs on every Astro request (SSR and static routes served through the worker).
 *
 * 1. Optionally loads session from the API worker for protected pages only.
 * 2. Optionally redirects unauthenticated users away from those pages.
 * 3. Adds security headers (CSP, HSTS, etc.) on the way out.
 *
 * Auth cookies live on PUBLIC_SERVER_URL (API origin), not the web origin — so
 * locals.user is often null on public pages even when the browser is signed in.
 * Client islands should use getAuthClient().getSession() for UI; treat locals as
 * a server-side hint for protected routes only.
 */
import { defineMiddleware } from "astro:middleware";
import { ENABLE_SSR_PROTECTED_REDIRECT } from "astro:env/server";

import { getPublicServerUrl } from "@/lib/public-server-url";
import { resolveSsrSession } from "@/lib/ssr-session";

/** Routes that may call the API for SSR session and optional redirect-to-login. */
const PROTECTED_PREFIXES = ["/dashboard", "/account"] as const;

function isTruthyEnvFlag(value: unknown): boolean {
  if (value === true) return true;
  if (value === "1") return true;
  if (typeof value === "string" && value.toLowerCase() === "true") return true;
  return false;
}

/** Clone the response so we can set CSP and related headers on every outgoing page. */
function withSecurityHeaders(response: Response, serverUrl: string): Response {
  const headers = new Headers(response.headers);
  // Re-wrapping the body invalidates original length/encoding headers.
  // headers.delete("content-encoding");
  // headers.delete("content-length");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("X-Frame-Options", "DENY");

  if (import.meta.env.PROD) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  // Allow fetch/WebSocket to the Hono API (auth, oRPC) and Turnstile.
  const connectParts = ["'self'", "https://challenges.cloudflare.com"];
  if (serverUrl) {
    connectParts.push(serverUrl);
  }
  if (import.meta.env.DEV) {
    connectParts.push("ws:", "wss:");
  }
  const workerSrc = import.meta.env.DEV ? "'self' blob:" : "'self'";
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

  // Worker binding at runtime; import.meta.env fallback in local dev.
  const serverUrl = getPublicServerUrl(context);

  let session = null;
  let user = null;
  // Skip API round-trip on public pages (home, contact, etc.).
  if (
    needsAuth &&
    serverUrl.startsWith("https://") &&
    !(import.meta.env.PROD && serverUrl.includes("localhost"))
  ) {
    ({ session, user } = await resolveSsrSession(context.request, serverUrl));
  }
  context.locals.session = session;
  context.locals.user = user;

  // Opt-in via ENABLE_SSR_PROTECTED_REDIRECT; off by default in many setups.
  if (isTruthyEnvFlag(ENABLE_SSR_PROTECTED_REDIRECT) && needsAuth && !user) {
    return withSecurityHeaders(context.redirect("/login"), serverUrl);
  }

  const response = await next();
  try {
    return withSecurityHeaders(response, serverUrl);
  } catch {
    // If re-wrapping the body fails (e.g. streamed/compressed SSR), return as-is.
    return response;
  }
});
