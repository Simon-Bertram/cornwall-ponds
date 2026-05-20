# Go-live checklist (when removing CF Access)

When the site is ready for public traffic, removing CF Access re-exposes routes that are currently perimeter-protected. Complete these **before or as part of** disabling Access:

1. **Disable CF Access** — set `CF_ACCESS_ENABLED=false` (or remove `POLICY_AUD` / `CF_ACCESS_DOMAIN`) on web and API Workers; remove Zero Trust application policies on hostnames.

2. **Turnstile fail-closed (H1)** — require `TURNSTILE_SECRET_KEY` in production; reject contact and auth POSTs when unset.

3. **Rate limiting (M4)** — Better Auth explicit limits + contact form WAF/KV limits (see [Rate limiting strategy](#rate-limiting-strategy) below).

4. **OpenAPI gating (L1)** — disable or protect `/api-reference` once anonymous users can reach the API.

5. **Security headers (M1)** — CSP, HSTS, `frame-ancestors` before public launch.

6. **Optional:** server-side auth redirects on `/dashboard` and `/account` (M2).

While CF Access is active, findings H1, L1, and contact rate limits are **lower immediate risk** (anonymous traffic cannot reach the API). They remain **required before public launch**.

---

## Rate limiting strategy

Better Auth `rateLimit` applies **only** to `/api/auth/*`. Contact and health routes need separate controls.

| Route | Control |
|-------|---------|
| `/api/auth/sign-in/magic-link`, `/api/auth/sign-in/social` | Better Auth `rateLimit: { enabled: true, max, window, storage: "secondary-storage" }` in [`packages/auth/src/options.ts`](../packages/auth/src/options.ts) + Turnstile |
| `POST /api/contact` | Cloudflare WAF rate rule (preferred on Free zone: 1 rule included) or Hono KV middleware keyed on `cf-connecting-ip` |
| `GET /health` | Optional generous CF WAF rule only; low priority (ops/uptime; not used by the web app) |

Turnstile is bot protection, not rate limiting — pair it with IP caps on the contact form before go-live.

## Related files

- CF Access middleware: [`apps/server/src/middleware/cloudflare-auth.tsx`](../apps/server/src/middleware/cloudflare-auth.tsx)
- Turnstile verification: [`packages/turnstile/src/verify.ts`](../packages/turnstile/src/verify.ts)
- Contact handler: [`apps/server/src/routes/contact.ts`](../apps/server/src/routes/contact.ts)
- OpenAPI reference mount: [`apps/server/src/index.ts`](../apps/server/src/index.ts)
