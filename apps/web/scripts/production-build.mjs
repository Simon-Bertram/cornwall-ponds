/**
 * Loads apps/web/.env.production before `astro build` so client bundles
 * inline production PUBLIC_* URLs (not localhost from .env.development).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const productionPath = resolve(webRoot, ".env.production");

if (!existsSync(productionPath)) {
	console.error(
		"Missing apps/web/.env.production — copy from .env.example before building.",
	);
	process.exit(1);
}

config({ path: resolve(webRoot, ".env") });
config({ path: productionPath, override: true });

const serverUrl = process.env.PUBLIC_SERVER_URL ?? "";
if (!serverUrl || serverUrl.includes("localhost")) {
	console.error(
		`PUBLIC_SERVER_URL must be a production URL in .env.production (got "${serverUrl}").`,
	);
	process.exit(1);
}

process.env.NODE_ENV = "production";

console.error(
	`[cornwall-ponds] production-build PUBLIC_SERVER_URL=${serverUrl}`,
);

// Avoid stale astro:env/client chunks (e.g. client.*.js) from prior dev builds.
for (const dir of ["dist", ".astro"]) {
	const target = resolve(webRoot, dir);
	if (existsSync(target)) {
		rmSync(target, { recursive: true, force: true });
	}
}

const astroBin = resolve(webRoot, "node_modules/.bin/astro");
if (!existsSync(astroBin)) {
	console.error(`Missing Astro CLI at ${astroBin}. Run pnpm install from repo root.`);
	process.exit(1);
}

const result = spawnSync(astroBin, ["build"], {
	cwd: webRoot,
	stdio: "inherit",
	env: process.env,
});

if (result.error) {
	console.error("astro build failed to start:", result.error.message);
	process.exit(1);
}
if (result.status !== 0) {
	console.error(`astro build exited with status ${result.status ?? "unknown"}`);
	process.exit(result.status ?? 1);
}

if (!existsSync(resolve(webRoot, "dist/client"))) {
	console.error("astro build finished but dist/client is missing.");
	process.exit(1);
}

function findJsFiles(dir, out = []) {
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, name.name);
		if (name.isDirectory()) findJsFiles(path, out);
		else if (name.name.endsWith(".js")) out.push(path);
	}
	return out;
}

const distRoot = resolve(webRoot, "dist");
if (existsSync(distRoot)) {
	const badDist = findJsFiles(distRoot).filter((file) =>
		readFileSync(file, "utf8").includes("localhost:3000"),
	);
	if (badDist.length > 0) {
		console.error(
			"Production build still contains localhost:3000:",
			badDist.map((f) => f.replace(webRoot + "/", "")).join(", "),
		);
		process.exit(1);
	}
}

process.exit(0);
