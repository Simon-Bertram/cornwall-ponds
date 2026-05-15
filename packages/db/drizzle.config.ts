import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const packageRoot = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(packageRoot, "../../packages/infra/.env") });
dotenv.config({ path: resolve(packageRoot, "../../apps/server/.env") });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId =
	process.env.CLOUDFLARE_DATABASE_ID ?? process.env.CLOUDFLARE_D1_DATABASE_ID;
const token =
	process.env.CLOUDFLARE_D1_TOKEN ?? process.env.CLOUDFLARE_API_TOKEN;

const useRemoteD1 = Boolean(accountId && databaseId && token);

if (process.argv.includes("push") && !useRemoteD1) {
	console.error(`
[drizzle] Missing Cloudflare D1 credentials for "drizzle-kit push".

Add to apps/server/.env or packages/infra/.env:
  CLOUDFLARE_ACCOUNT_ID=...
  CLOUDFLARE_DATABASE_ID=...   # D1 → your database → Database ID
  CLOUDFLARE_D1_TOKEN=...        # or CLOUDFLARE_API_TOKEN with D1 Edit

Find IDs in the Cloudflare dashboard. For local Alchemy dev without remote push,
generate SQL migrations instead (no D1 HTTP needed):

  pnpm run db:generate

Then start dev; Alchemy applies packages/db/src/migrations to local D1.
`);
	process.exit(1);
}

const migrationsDir = resolve(packageRoot, "src/migrations");
if (!existsSync(migrationsDir)) {
	mkdirSync(migrationsDir, { recursive: true });
}

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "sqlite",
	...(useRemoteD1
		? {
				driver: "d1-http",
				dbCredentials: {
					accountId: accountId!,
					databaseId: databaseId!,
					token: token!,
				},
			}
		: {}),
});
