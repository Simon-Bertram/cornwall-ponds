import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import alchemy from "alchemy";
import {
	Astro,
	D1Database,
	KVNamespace,
	R2Bucket,
	Worker,
} from "alchemy/cloudflare";
import { config } from "dotenv";

// Node's native TS runner (used by `alchemy dev`) requires explicit extensions on relative ESM imports.
import { syncLocalD1MigrationJournalForDev } from "./local-d1-migration-journal.ts";

const infraDir = dirname(fileURLToPath(import.meta.url));
const cliArgs = process.argv.slice(2);
const isAlchemyDev =
	cliArgs.includes("dev") ||
	cliArgs.includes("--dev") ||
	cliArgs.includes("--local");
/** Set by packages/infra `pnpm run deploy` — argv often lacks the string "deploy" when this file loads. */
const isProductionDeploy =
	process.env.ALCHEMY_DEPLOY === "1" ||
	cliArgs.includes("deploy") ||
	(!isAlchemyDev && process.env.npm_lifecycle_event === "deploy");

if (isProductionDeploy) {
	process.env.NODE_ENV = "production";
}

/** Load `.env`, then mode-specific overrides (production when not `alchemy dev`). */
function loadAppEnv(appRelativeDir: string) {
	const base = resolve(infraDir, appRelativeDir);
	config({ path: resolve(base, ".env") });
	const productionPath = resolve(base, ".env.production");
	const developmentPath = resolve(base, ".env.development");
	const modePath = isProductionDeploy ? productionPath : developmentPath;
	if (existsSync(modePath)) {
		// Alchemy pre-injects .env.development; override so deploy uses production URLs.
		config({ path: modePath, override: true });
	}
}

// Override empty devcontainer/containerEnv placeholders (see .devcontainer/devcontainer.json).
config({ path: resolve(infraDir, ".env"), override: true });

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

// Alchemy pre-injects .env.development before this file runs; re-apply mode env after bootstrap.
loadAppEnv("../../apps/web");
loadAppEnv("../../apps/server");

if (isProductionDeploy) {
	const serverUrl = process.env.PUBLIC_SERVER_URL ?? "";
	if (!serverUrl || serverUrl.includes("localhost")) {
		throw new Error(
			`Deploy requires production PUBLIC_SERVER_URL in apps/web/.env.production (got "${serverUrl}"). ` +
				"Ensure that file exists and lists your Workers.dev API URL.",
		);
	}
}

if (isAlchemyDev) {
	syncLocalD1MigrationJournalForDev(infraDir);
}

const db = await D1Database("database", {
	migrationsDir: "../../packages/db/src/migrations",
});

const sessionKv = await KVNamespace("session-kv", {
	title: "cornwall-ponds-session-kv",
});

const portalFiles = await R2Bucket("portal-files", {
	name: "cornwall-ponds-portal-files",
});

const serverBindings = {
	DB: db,
	SESSION_KV: sessionKv,
	PORTAL_FILES: portalFiles,
	CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
	WEB_URL: alchemy.env.WEB_URL ?? alchemy.env.CORS_ORIGIN!,
	BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
	ENVIRONMENT: isProductionDeploy ? "production" : "development",
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
	...(process.env.OPENAPI_REFERENCE_ENABLED
		? { OPENAPI_REFERENCE_ENABLED: alchemy.env.OPENAPI_REFERENCE_ENABLED! }
		: {}),
	...(process.env.TURNSTILE_FAIL_OPEN
		? { TURNSTILE_FAIL_OPEN: alchemy.env.TURNSTILE_FAIL_OPEN! }
		: {}),
	...(process.env.CONTACT_TO_EMAIL
		? { CONTACT_TO_EMAIL: alchemy.env.CONTACT_TO_EMAIL! }
		: {}),
	...(process.env.ADMIN_EMAIL
		? { ADMIN_EMAIL: alchemy.env.ADMIN_EMAIL! }
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
	...(process.env.TURNSTILE_SECRET_KEY
		? { TURNSTILE_SECRET_KEY: alchemy.secret.env.TURNSTILE_SECRET_KEY }
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

const webPublicEnv = isProductionDeploy
	? {
			PUBLIC_SERVER_URL: process.env.PUBLIC_SERVER_URL!,
			PUBLIC_WEB_URL: process.env.PUBLIC_WEB_URL!,
		}
	: undefined;

export const web = await Astro("web", {
	cwd: "../../apps/web",
	entrypoint: "dist/server/entry.mjs",
	assets: "dist/client",
	...(isProductionDeploy
		? {
				build: {
					command: "node ./scripts/production-build.mjs",
					env: webPublicEnv,
					memoize: false,
				},
			}
		: {}),
	bindings: {
		PUBLIC_SERVER_URL: alchemy.env.PUBLIC_SERVER_URL!,
		PUBLIC_WEB_URL:
			alchemy.env.PUBLIC_WEB_URL ??
			process.env.WEB_URL ??
			process.env.CORS_ORIGIN!,
		...(process.env.PUBLIC_TURNSTILE_SITE_KEY
			? {
					PUBLIC_TURNSTILE_SITE_KEY: alchemy.env.PUBLIC_TURNSTILE_SITE_KEY!,
				}
			: {}),
		...(process.env.ENABLE_SSR_PROTECTED_REDIRECT
			? {
					ENABLE_SSR_PROTECTED_REDIRECT:
						alchemy.env.ENABLE_SSR_PROTECTED_REDIRECT!,
				}
			: {}),
		/** Service binding to the Hono API worker (SSR session, internal RPC). */
		API: server,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
