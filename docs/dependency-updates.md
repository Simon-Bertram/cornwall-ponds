# Updating dependencies (pnpm v11 + Turborepo)

This repo is a **pnpm workspace** (`apps/*`, `packages/*`) with a **shared version catalog** in `pnpm-workspace.yaml` and **Turbo** orchestrating builds and checks. Use the levels below so lockfile, hoisting, and task caching stay consistent.

## Where to change versions

### 1. Root `package.json`

Use for dependencies that are **only** meaningful at the workspace root (tooling shared conceptually with the whole repo, or things the root scripts need).

- Examples here: `turbo`, `typescript` (via `catalog:`), `dotenv`, `zod`, `@types/node`, `@cloudflare/workers-types`.
- Install with **`-w`** (workspace root) so pnpm does not try to attach the package to a single app.

### 2. Per-package `package.json` (`apps/*`, `packages/*`)

Use for anything **used by that package’s code or scripts**: frameworks (e.g. Astro), adapters, UI libs, DB clients, `workspace:*` links to `@cornwall-ponds/*`, etc.

- Keeps each package’s dependency graph accurate for publishing, boundaries, and Turbo’s `dependsOn: ["^build"]` graph.
- Prefer **`pnpm --filter <name>`** so the edit targets the right manifest without `cd`.

**Internal packages:** always use `"workspace:*"` (e.g. `"@cornwall-ponds/env": "workspace:*"`). Never pin a semver version for monorepo packages.

### 3. Catalog in `pnpm-workspace.yaml`

The `catalog:` block defines **one version range per shared dependency**. Any `package.json` entry like `"hono": "catalog:"` resolves through that block.

**Update the catalog when:**

- More than one package should stay on the **same** version of a library (e.g. `hono`, `zod`, `better-auth`, `@orpc/*`, `alchemy`).
- You are bumping a shared runtime or types package and want a single source of truth.

**After editing the catalog:** run `pnpm install` from the **repository root** so all `catalog:` references and `pnpm-lock.yaml` refresh together.

**Add a new cataloged dependency:**

1. Add the key and range under `catalog:` in `pnpm-workspace.yaml`.
2. In the target package(s), add `"dep-name": "catalog:"` (or `catalog:default` if you use named catalogs later).
3. Run `pnpm install` at the root.

### Quick decision

| Situation | Where to edit |
|-----------|----------------|
| Only `web` uses the package | `apps/web/package.json` (+ `--filter web`) |
| Only `server` uses it | `apps/server/package.json` |
| Shared by several apps/packages and should align | `pnpm-workspace.yaml` `catalog:` + `catalog:` in each consumer |
| Root scripts / repo-wide tooling | Root `package.json` with `-w` |

---

## Commands (run from repo root)

Use a **current Node** for this repo (the workspace targets **Node v24**; Astro and related tooling expect a recent Node—see project docs or devcontainer if present).

### Add or remove a dependency

```bash
# Root (e.g. add a dev tool for the whole repo)
pnpm add -w -D <package>
pnpm remove -w <package>

# Single workspace package (use the "name" field from that package’s package.json)
pnpm --filter web add <package>
pnpm --filter web add -D <package>
pnpm --filter server remove <package>
pnpm --filter @cornwall-ponds/db add -D <package>
```

`web` and `server` are the `name` values in `apps/web` and `apps/server`; scoped packages use their full name with `--filter`.

### Bump versions

```bash
# Refresh lockfile from current ranges (root + all workspaces)
pnpm install

# Interactive updates within current semver ranges (useful monorepo-wide)
pnpm update -i -r

# Update one dependency everywhere it appears (respects catalog: by updating the catalog entry if that’s what pins the version)
pnpm update <package-name> -r
```

For a **breaking major**, prefer explicitly setting the new range in the right `package.json` or in the catalog, then `pnpm install`.

### Inspect

```bash
pnpm outdated -r
pnpm why <package-name>
pnpm list <package-name> -r
```

If you use peer checks:

```bash
pnpm peers check
```

Resolve peer warnings by upgrading the dependent package, adjusting `pnpm.peerDependencyRules` / `packageExtensions` in root `package.json` if intentional, or aligning versions—not by silencing without understanding.

---

## After dependency changes

1. **`pnpm install`** at root whenever manifests or the catalog changed.
2. **Verify with Turbo** (from root):
   - `pnpm build` — runs `turbo build` (dependency builds first via `^build`).
   - `pnpm check-types` — typecheck across packages that define the task.
3. Fix any peer dependency or duplicate-type issues before merging.

---

## Turbo and dependencies

Turbo does not install packages; it runs **tasks** defined in each package and cached in `turbo.json`. Changing dependencies can change build outputs, so caches may invalidate naturally. If something looks stale after a big upgrade, use your normal Turbo cache-busting workflow (e.g. `turbo build --force` when debugging cache issues).

---

## Summary

- **Root `-w`:** root-only tooling and deps.
- **`--filter <pkg>`:** deps for a specific app or package.
- **`pnpm-workspace.yaml` catalog:** shared versions for `catalog:` entries; then root `pnpm install`.
- **Always** run **`pnpm install`** from the repo root after manifest or catalog edits.
- **Validate** with **`pnpm build`** / **`pnpm check-types`** (or targeted `turbo -F <pkg> <task>`).
