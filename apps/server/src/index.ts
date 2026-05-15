import {
  createContext,
  type ServerHonoVariables,
} from "@cornwall-ponds/api/context";
import { appRouter } from "@cornwall-ponds/api/routers/index";
import { createAuth, type AuthEnv } from "@cornwall-ponds/auth";
import { env } from "@cornwall-ponds/env/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono, type Context, type Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type ServerContext = Context<{
  Bindings: AuthEnv;
  Variables: ServerHonoVariables;
}>;

const app = new Hono<{ Bindings: AuthEnv; Variables: ServerHonoVariables }>();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("*", async (c: ServerContext, next: Next) => {
  const auth = createAuth({
    env: c.env,
    executionCtx: c.executionCtx,
    requestUrl: c.req.url,
  });
  c.set("auth", auth);
  await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) =>
  c.get("auth").handler(c.req.raw),
);

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
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

app.get("/health", (c) => {
  return c.text("OK", 200);
});

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
