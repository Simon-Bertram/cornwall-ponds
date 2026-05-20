import type { ServerEnv } from "@cornwall-ponds/env/bindings";
import { createMiddleware } from "hono/factory";
import { jwtVerify, createRemoteJWKSet } from "jose";

function isCfAccessEnabled(env: ServerEnv): boolean {
  const flag = env.CF_ACCESS_ENABLED?.toLowerCase();
  if (flag === "false" || flag === "0") {
    return false;
  }
  if (flag === "true" || flag === "1") {
    return Boolean(env.POLICY_AUD && env.CF_ACCESS_DOMAIN);
  }
  // No explicit flag: require Access only when fully configured (production deploy).
  return Boolean(env.POLICY_AUD && env.CF_ACCESS_DOMAIN);
}

export const cloudflareAuth = createMiddleware<{ Bindings: ServerEnv }>(
  async (c, next) => {
    if (!isCfAccessEnabled(c.env)) {
      await next();
      return;
    }

    // Get the JWT from the request headers
    const token = c.req.header("cf-access-jwt-assertion");

  // Check if token exists
  if (!token) {
    return c.json({ error: "Missing required CF Access JWT" }, 403);
  }

  try {
    // Create JWKS from your team domain
    const JWKS = createRemoteJWKSet(
      new URL(`${c.env.CF_ACCESS_DOMAIN}/cdn-cgi/access/certs`),
    );

    // Verify the JWT
    await jwtVerify(token, JWKS, {
      issuer: c.env.CF_ACCESS_DOMAIN,
      audience: c.env.POLICY_AUD,
    });

    await next();
  } catch (error) {
    console.error("CF Access JWT verification failed:", error);
    return c.json({ error: "Forbidden" }, 403);
  }
  },
);
