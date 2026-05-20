import {
  createContext,
  type ServerHonoVariables,
} from "@cornwall-ponds/api/context";
import { appRouter } from "@cornwall-ponds/api/routers/index";
import { createAuth } from "@cornwall-ponds/auth";
import type { ServerEnv } from "@cornwall-ponds/env/bindings";
import { env } from "@cornwall-ponds/env/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono, type Context, type Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { isOpenApiReferenceEnabled } from "./lib/openapi";
import { cloudflareAuth } from "./middleware/cloudflare-auth";
import { contactRateLimit } from "./middleware/contact-rate-limit";
import { turnstileGuard } from "./middleware/turnstile-guard";
import { handleContactPost } from "./routes/contact";

type ServerContext = Context<{
  Bindings: ServerEnv;
  Variables: ServerHonoVariables;
}>;

const app = new Hono<{ Bindings: ServerEnv; Variables: ServerHonoVariables }>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Turnstile-Token"],
    credentials: true,
  }),
);

app.use("/*", async (c, next) => {
  await next();
  const headers = c.res.headers;
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'",
  );
  if (new URL(c.req.url).protocol === "https:") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }
});

app.use("/*", cloudflareAuth);
app.use("/*", contactRateLimit);
app.use("/*", turnstileGuard);

app.post("/api/contact", handleContactPost);

app.use("*", async (c: ServerContext, next: Next) => {
  const auth = createAuth({
    env: c.env,
    executionCtx: c.executionCtx,
    requestUrl: c.req.url,
  });
  c.set("auth", auth);
  await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => c.get("auth").handler(c.req.raw));

export const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c: ServerContext, next: Next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api-reference",
    context: context,
  });

  if (apiResult.matched) {
    if (!isOpenApiReferenceEnabled(c.env)) {
      return c.text("Not Found", 404);
    }
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.get("/health", (c) => {
  return c.text("OK", 200);
});

export default app;
