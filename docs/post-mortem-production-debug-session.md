# Post-mortem: production debugging session

**Status:** Site returns **HTTP 500** on the web worker after Cloudflare Access. `/cdn-cgi/trace` returning 200 only proves the request reaches Cloudflare’s edge—not that the Astro worker can render `/`.

**Date context:** Session focused on fixing `localhost:3000` in production client bundles and deploy env ordering.

---

## 1. Original problem (confirmed)

- **Symptom:** Browser called `http://localhost:3000/api/auth/get-session` on the live `workers.dev` site (CORS / Local Network Access errors).
- **Cause (confirmed):** `PUBLIC_SERVER_URL` is **inlined at Astro build time** into `dist/client/`. Dashboard-only env changes do not fix already-built JS.
- **Contributing deploy bug:** Alchemy often injected `apps/web/.env.development` before deploy; builds could ship localhost even when production vars existed elsewhere.

That diagnosis was sound. The failure is that **fixing the client bundle did not restore a working homepage**—the site now returns a server-side **500** instead of a partially loaded app with wrong API URLs.

---

## 2. What was changed (by area)

### A. Deploy / build pipeline (infra)

| Change | Intent | Risk |
|--------|--------|------|
| `loadAppEnv(..., override: true)` for `.env.production` | Beat Alchemy’s `.env.development` injection | Low if `.env.production` is correct |
| `ALCHEMY_DEPLOY=1` + `isProductionDeploy` checks | Reliable production mode | Low |
| `build.command: node ./scripts/production-build.mjs` | Clean `dist/`, force production env, fail if `localhost:3000` in output | Low; build **did** log correct URL on 21:30 deploy |
| Deploy-time throw if `PUBLIC_SERVER_URL` contains `localhost` | Block bad deploys | Good guardrail |
| `memoize: false` on web build | Avoid stale cached builds | Slightly longer deploys |

**Evidence it worked for the original bug:** Deploy log showed:

```text
[cornwall-ponds] production-build PUBLIC_SERVER_URL=https://cornwall-ponds-server-node.simonbertram.workers.dev
```

Local verification: `grep localhost` on `apps/web/dist/client` was clean; client chunks contained production server URL.

### B. Astro config

| Change | Intent | Risk |
|--------|--------|------|
| Removed hard-coded `localhost` defaults from `PUBLIC_SERVER_URL` / `PUBLIC_WEB_URL` (commit `b87d734`) | Stop silently shipping dev URLs | **Higher:** missing env at build/dev can fail builds or leave empty values if env loading order is wrong |

### C. Web app runtime (mostly uncommitted on `main` at time of report)

| Change | Intent | Risk |
|--------|--------|------|
| `getPublicServerUrl()` from Worker binding + build fallback | CSP / SSR use runtime URL | Low unless binding missing |
| Layout `<meta>` + `getClientPublicServerUrl()` | Client auth reads production API from DOM | Low |
| `getAuthClient()` / `getOrpc()` instead of module-level singletons | Avoid stale base URL | Low |
| Middleware: SSR session **only** on `/dashboard`, `/account` | Stop homepage calling API every request | **Should reduce** load, not increase |
| Middleware: `withSecurityHeaders` deletes `content-encoding` / `content-length`, then `new Response(response.body, …)` | Fix CSP / security headers | **High on Workers** — known pattern for broken streams / 500s |
| `try/catch` around `withSecurityHeaders` | Avoid total failure if re-wrap throws | Only helps if the error is thrown **inside** that call; stream errors can still surface as 500 |
| `ssr-session`: `AbortSignal.timeout(5s)` | Avoid hung SSR | Low on homepage (not called there after middleware change) |

### D. Docs

- Updated `docs/plans/cloudflare-deployment-guide.md` with build-time vs runtime env notes.

### E. Debug instrumentation (removed)

- Temporary `fetch` to `localhost:7491/ingest/...` caused **CSP violations** on production. Removed; did not cause the 500 by itself.

---

## 3. What was verified vs not verified

| Check | Result |
|-------|--------|
| Edge reachable (`/cdn-cgi/trace`) | **OK** (LHR / IAD colo) |
| Worker alive without session | **302** → Cloudflare Access (expected) |
| Production build URL in deploy log | **OK** (21:30 deploy) |
| Homepage **200** after Access login | **Not verified** — user reported **500** |
| Cloudflare **Worker logs** for the 500 stack trace | **Not done** in this session |
| Bisect (disable middleware / security headers) | **Not done** |

We fixed a **real build/env bug** but **did not close the loop** on “does `/` return 200 after Access?”

---

## 4. Why HTTP 500 (most likely causes, ranked)

### 1. Middleware re-wrapping the response body (most likely)

`withSecurityHeaders` in `apps/web/src/middleware.ts` does:

```typescript
return new Response(response.body, {
  status: response.status,
  statusText: response.statusText,
  headers,
});
```

This pattern existed before the session (commit `182dfcc` “Security mitigations”). On Cloudflare Workers, cloning/re-wrapping **compressed or streamed** SSR bodies often causes **runtime errors → 500**. Recent edits added `content-encoding` / `content-length` deletion, which can make that worse if the body was still encoded.

The homepage runs through this on **every** request after Access, so a single failure there = sitewide 500.

### 2. Uncaught SSR error in a page or layout (possible)

Homepage uses `Layout.astro` with Google Fonts (`<Font preload />`), React islands, etc. Any uncaught throw during SSR → 500. Stack trace from the dashboard was not captured.

### 3. Env / binding mismatch at runtime (less likely for 500 on `/`)

- Build uses `process.env` from `.env.production`.
- Worker bindings use `alchemy.env.PUBLIC_SERVER_URL`.
- If binding were wrong, you’d more likely see **wrong API URL in the browser**, not necessarily 500 on the homepage—unless something **throws** on missing env (Astro env schema).

### 4. Cloudflare Access interaction (possible, secondary)

`X-Frame-Options: DENY` and strict CSP usually do **not** cause HTTP 500; they cause blank frames or blocked scripts. Access + 500 still points at **worker crash**, not framing policy.

### 5. Changes that probably did **not** cause the 500

- Production build script / localhost grep guard
- Client meta tag for API URL
- Limiting `resolveSsrSession` to protected routes (reduces work on `/`)
- Removing debug ingest `fetch`

---

## 5. Did this session “break the project further”?

**Partially, in effect if not in intent:**

| Before session | After session |
|----------------|---------------|
| Site might load but call **wrong API** (localhost) | Build likely has **correct API URL** in client JS |
| Possible flaky/slow homepage (SSR session on every request) | Homepage should do **less** API work in middleware |
| Security middleware re-wrap **already present** on `main` | Same pattern, with **more** header/body manipulation |

The session **did not invent** the `new Response(response.body, …)` pattern, but **extended** middleware and deploy complexity **without** proving post-Access **200** on `/`. Net user experience: **worse** (hard 500 vs broken auth calls).

**Repo state at time of report:** Most fixes lived as **uncommitted local changes** (`apps/web`, `packages/infra`, new `apps/web/scripts/production-build.mjs`, etc.). Only `b87d734` (astro config localhost removal) was clearly on committed history for this line of work.

---

## 6. Chrome messages that were red herrings

- **`chrome-error://chromewebdata/`** — Chrome’s error page, not app code.
- **`Unsafe attempt to load URL … from frame with URL chrome-error://`** — Side effect of failed navigation, not a same-origin bug in the app.

The actionable error is **`HTTP ERROR 500`** from the worker.

---

## 7. Recommended recovery (in order)

1. **Cloudflare dashboard → Workers → web worker → Logs** (or Real-time Logs). Reproduce 500 once; copy the **exception message and stack**.
2. **Quick bisect:** Temporarily return middleware to only `return await next()` (no `withSecurityHeaders`). Redeploy. If `/` → 200, fix headers without re-wrapping body (e.g. set CSP via meta or a narrower scope).
3. **Confirm binding:** Worker env `PUBLIC_SERVER_URL` matches `https://cornwall-ponds-server-node.simonbertram.workers.dev`.
4. **Commit or revert:** Either commit the working subset with a clear message, or stash/revert uncommitted web+infra changes and redeploy known-good `main`, then re-apply build fixes one at a time.

---

## 8. Summary

| Item | Assessment |
|------|------------|
| Original localhost-in-bundle diagnosis | **Correct** |
| Production build / deploy env fixes | **Likely correct**; deploy log supports that |
| Site working in browser after Access | **Failed** — **500** |
| Root cause of 500 in this session | **Not proven** — no worker stack trace captured |
| Best hypothesis | **SSR middleware `new Response(response.body, …)`** after security header changes |
| Session made things worse? | **Yes in outcome** until 500 is fixed, even if some changes were improvements on paper |

---

## Related docs

- [Cloudflare deployment guide](./plans/cloudflare-deployment-guide.md) — deploy flow, env files, build-time vs runtime `PUBLIC_*` vars.
