import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import alchemy from "alchemy";
import { Astro, D1Database, KVNamespace, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

const infraDir = dirname(fileURLToPath(import.meta.url));
const isDeploy = process.argv.some((arg) => arg === "deploy");

if (isDeploy) {
	process.env.NODE_ENV = "production";
}

/** Load `.env`, then mode-specific overrides (production on deploy, development otherwise). */
function loadAppEnv(appRelativeDir: string) {
	const base = resolve(infraDir, appRelativeDir);
	config({ path: resolve(base, ".env") });
	const modeFile = isDeploy ? ".env.production" : ".env.development";
	const modePath = resolve(base, modeFile);
	if (existsSync(modePath)) {
		config({ path: modePath });
	}
}

// Override empty devcontainer/containerEnv placeholders (see .devcontainer/devcontainer.json).
config({ path: resolve(infraDir, ".env"), override: true });

loadAppEnv("../../apps/web");
loadAppEnv("../../apps/server");

const alchemyPassword = process.env.ALCHEMY_PASSWORD;
if (!alchemyPassword) {
	throw new Error(
		"ALCHEMY_PASSWORD is required in packages/infra/.env to decrypt Alchemy secrets. " +
			"Set it in that file or export it in your shell before running alchemy dev.",
	);
}

const app = await alchemy("cornwall-ponds", {
	password: alchemyPassword,
});

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
	...(process.env.GOOGLE_CLIENT_ID
		? { GOOGLE_CLIENT_ID: alchemy.env.GOOGLE_CLIENT_ID! }
		: {}),
	...(process.env.RESEND_FROM_EMAIL
		? { RESEND_FROM_EMAIL: alchemy.env.RESEND_FROM_EMAIL! }
		: {}),
	...(process.env.CF_ACCESS_ENABLED
		? { CF_ACCESS_ENABLED: alchemy.env.CF_ACCESS_ENABLED! }
		: {}),
	...(process.env.POLICY_AUD
		? { POLICY_AUD: alchemy.env.POLICY_AUD! }
		: {}),
	...(process.env.CF_ACCESS_DOMAIN
		? { CF_ACCESS_DOMAIN: alchemy.env.CF_ACCESS_DOMAIN! }
		: {}),
};

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
