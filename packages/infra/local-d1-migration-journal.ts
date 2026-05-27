import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

/** Drizzle auto-names renamed for clarity; local journal may still list the old id. */
const LOCAL_MIGRATION_RENAMES: Record<string, string> = {
	"0000_slimy_wild_child.sql": "0000_initial_auth.sql",
};

export function getLocalD1PersistDir(workspaceRoot: string): string {
	return resolve(
		workspaceRoot,
		".alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject",
	);
}

function listD1SqliteFiles(persistDir: string): string[] {
	if (!existsSync(persistDir)) {
		return [];
	}
	return readdirSync(persistDir).filter(
		(f) => f.endsWith(".sqlite") && f !== "metadata.sqlite",
	);
}

/** Align d1_migrations journal after migration files were renamed on disk. */
function repairLocalD1MigrationJournal(
	persistDir: string,
	diskMigrations: string[],
): void {
	for (const sqliteFile of listD1SqliteFiles(persistDir)) {
		const dbPath = join(persistDir, sqliteFile);
		const db = new DatabaseSync(dbPath);
		try {
			const tables = db
				.prepare(
					"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
				)
				.all() as Array<{ name: string }>;
			const tableNames = new Set(tables.map((t) => t.name));
			if (!tableNames.has("d1_migrations")) {
				continue;
			}
			const applied = db
				.prepare("SELECT name FROM d1_migrations")
				.all() as Array<{ name: string }>;
			const appliedNames = new Set(applied.map((r) => r.name));
			const authAlreadyApplied =
				tableNames.has("user") ||
				tableNames.has("session") ||
				tableNames.has("account");

			for (const [oldName, newName] of Object.entries(
				LOCAL_MIGRATION_RENAMES,
			)) {
				if (!diskMigrations.includes(newName)) {
					continue;
				}
				if (appliedNames.has(newName)) {
					continue;
				}
				if (!appliedNames.has(oldName) || !authAlreadyApplied) {
					continue;
				}
				db.prepare(
					"UPDATE d1_migrations SET name = ? WHERE name = ?",
				).run(newName, oldName);
			}
		} finally {
			db.close();
		}
	}
}

/** Run before Alchemy applies local D1 migrations in dev. */
export function syncLocalD1MigrationJournalForDev(infraDir: string): void {
	const workspaceRoot = resolve(infraDir, "../..");
	const migrationsDir = resolve(
		workspaceRoot,
		"packages/db/src/migrations",
	);
	const diskMigrations = readdirSync(migrationsDir)
		.filter((f) => f.endsWith(".sql"))
		.sort();
	repairLocalD1MigrationJournal(
		getLocalD1PersistDir(workspaceRoot),
		diskMigrations,
	);
}
