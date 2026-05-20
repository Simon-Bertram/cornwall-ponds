# Go-live checklist (when removing CF Access)

When the site is ready for public traffic, removing CF Access re-exposes routes that are currently perimeter-protected. Complete these **before or as part of** disabling Access:

1. **Disable CF Access** — see [Removing Cloudflare Access](#removing-cloudflare-access-steps) below.

2. **Turnstile fail-closed (H1)** — production must set `TURNSTILE_SECRET_KEY` (or set `TURNSTILE_FAIL_OPEN=true` only for non-public emergencies). Contact and protected auth POSTs are rejected when the secret is missing in production.

3. **Rate limiting (M4)** — Better Auth explicit limits (see [`packages/auth/src/options.ts`](../packages/auth/src/options.ts)) + in-app KV limiter on `POST /api/contact` + optional Cloudflare WAF rule as extra margin.

4. **OpenAPI gating (L1)** — `/api-reference` is off when `ENVIRONMENT=production` unless `OPENAPI_REFERENCE_ENABLED=true` is set on the API worker.

5. **Security headers (M1)** — CSP, HSTS (prod web), and related headers are set on the web Worker (`apps/web/src/middleware.ts`) and API Worker (`apps/server/src/index.ts`); review before launch.

6. **Optional:** server-side auth redirects on `/dashboard` and `/account` — set `ENABLE_SSR_PROTECTED_REDIRECT=true` on the web Worker only when SSR can see session cookies (same-site / shared cookie domain). Otherwise `RequireAuth` remains the gate.

While CF Access is active, findings H1, L1, and contact rate limits are **lower immediate risk** (anonymous traffic cannot reach the API). They remain **required before public launch**.

---

## Removing Cloudflare Access (steps)

1. **Cloudflare dashboard:** Zero Trust → Access → Applications — remove or disable the application(s) protecting your web hostname and API hostname (or update policies so the Internet-facing app allows the right audiences).
2. **Env / IaC:** Set `CF_ACCESS_ENABLED=false` or remove `POLICY_AUD` and `CF_ACCESS_DOMAIN` from production env (e.g. `apps/server/.env.production`, `apps/web/.env.production` as used by Alchemy), matching how bindings are injected in [`packages/infra/alchemy.run.ts`](../packages/infra/alchemy.run.ts).
3. **Redeploy** web and server Workers so requests no longer require `cf-access-jwt-assertion`.
4. **Smoke-test** sign-in, contact form, `/health`, and (if enabled) `/api-reference` as an anonymous visitor.

---

## Rate limiting strategy

Better Auth `rateLimit` applies **only** to `/api/auth/*`. Contact and health routes need separate controls.

| Route | Control |
|-------|---------|
| `/api/auth/sign-in/magic-link`, `/api/auth/sign-in/social` | Better Auth `rateLimit` + Turnstile |
| `POST /api/contact` | KV middleware in [`apps/server/src/middleware/contact-rate-limit.ts`](../apps/server/src/middleware/contact-rate-limit.ts) + optional Cloudflare WAF rule |
| `GET /health` | Optional generous CF WAF rule only; low priority (ops/uptime) |

Turnstile is bot protection, not rate limiting — pair it with IP caps on the contact form before go-live.

## Related files

- CF Access middleware: [`apps/server/src/middleware/cloudflare-auth.tsx`](../apps/server/src/middleware/cloudflare-auth.tsx)
- Turnstile verification: [`packages/turnstile/src/verify.ts`](../packages/turnstile/src/verify.ts)
- Contact handler: [`apps/server/src/routes/contact.ts`](../apps/server/src/routes/contact.ts)
- OpenAPI reference mount: [`apps/server/src/index.ts`](../apps/server/src/index.ts)
