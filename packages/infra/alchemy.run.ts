import alchemy from "alchemy";
import { Astro, D1Database, KVNamespace, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

const app = await alchemy("cornwall-ponds");

const db = await D1Database("database", {
	migrationsDir: "../../packages/db/src/migrations",
});

const sessionKv = await KVNamespace("session-kv", {
	title: "cornwall-ponds-session-kv",
});

const serverBindings = {
	DB: db,
	SESSION_KV: sessionKv,
	CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
	WEB_URL: alchemy.env.WEB_URL ?? alchemy.env.CORS_ORIGIN!,
	BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
	GOOGLE_CLIENT_ID: alchemy.env.GOOGLE_CLIENT_ID,
	RESEND_FROM_EMAIL: alchemy.env.RESEND_FROM_EMAIL,
} as const;

/** alchemy.secret.env throws when unset; add OAuth/email secrets only when configured. */
const serverSecretBindings = {
	...(process.env.GOOGLE_CLIENT_SECRET
		? { GOOGLE_CLIENT_SECRET: alchemy.secret.env.GOOGLE_CLIENT_SECRET }
		: {}),
	...(process.env.RESEND_API_KEY
		? { RESEND_API_KEY: alchemy.secret.env.RESEND_API_KEY }
		: {}),
};

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		...serverBindings,
		...serverSecretBindings,
	},
	dev: {
		port: 3000,
	},
});

export const web = await Astro("web", {
	cwd: "../../apps/web",
	entrypoint: "dist/server/entry.mjs",
	assets: "dist/client",
	bindings: {
		PUBLIC_SERVER_URL: alchemy.env.PUBLIC_SERVER_URL!,
		/** Service binding to the Hono API worker (SSR session, internal RPC). */
		API: server,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
