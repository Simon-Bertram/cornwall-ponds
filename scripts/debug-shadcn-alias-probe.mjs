// Debug probe: what shadcn init sees for import aliases (session b1d230).
// Run from repo root: node scripts/debug-shadcn-alias-probe.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.join(__dirname, '..')

function send (payload) {
	// #region agent log
	fetch('http://localhost:7491/ingest/e8332152-a9b9-4809-aab8-43213961e9a7', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Debug-Session-Id': 'b1d230'
		},
		body: JSON.stringify({
			sessionId: 'b1d230',
			runId: process.env.DEBUG_SHADCN_RUN ?? 'probe',
			timestamp: Date.now(),
			...payload
		})
	}).catch(() => {})
	// #endregion
}

const webPkg = path.join(REPO, 'apps/web/package.json')
const webTs = path.join(REPO, 'apps/web/tsconfig.json')
const rootTs = path.join(REPO, 'tsconfig.json')

const webTsRaw = JSON.parse(fs.readFileSync(webTs, 'utf8'))
const rootTsRaw = JSON.parse(fs.readFileSync(rootTs, 'utf8'))
const webPkgRaw = JSON.parse(fs.readFileSync(webPkg, 'utf8'))

let extendedHasPaths = null
let extendedPath = null
if (typeof webTsRaw.extends === 'string') {
	extendedPath = path.resolve(path.dirname(webTs), webTsRaw.extends)
	extendedHasPaths = fs.existsSync(extendedPath)
}

send({
	location: 'debug-shadcn-alias-probe.mjs:web-tsconfig',
	message: 'apps/web compilerOptions alias fields',
	hypothesisId: 'H1',
	data: {
		hasBaseUrl: Boolean(webTsRaw.compilerOptions?.baseUrl),
		hasPaths: Boolean(webTsRaw.compilerOptions?.paths),
		pathKeys: webTsRaw.compilerOptions?.paths
			? Object.keys(webTsRaw.compilerOptions.paths)
			: [],
		extends: webTsRaw.extends ?? null
	}
})

send({
	location: 'debug-shadcn-alias-probe.mjs:extends-resolve',
	message: 'extended tsconfig file presence',
	hypothesisId: 'H2',
	data: {
		resolvedExtendsPath: extendedPath,
		extendsFileExists: extendedHasPaths
	}
})

send({
	location: 'debug-shadcn-alias-probe.mjs:root-tsconfig',
	message: 'repo root compilerOptions.paths (shadcn may not read if cwd is apps/web)',
	hypothesisId: 'H3',
	data: {
		hasPaths: Boolean(rootTsRaw.compilerOptions?.paths),
		pathKeys: rootTsRaw.compilerOptions?.paths
			? Object.keys(rootTsRaw.compilerOptions.paths)
			: []
	}
})

send({
	location: 'debug-shadcn-alias-probe.mjs:package-imports',
	message: 'apps/web package.json imports field',
	hypothesisId: 'H4',
	data: {
		hasImportsField: Object.prototype.hasOwnProperty.call(webPkgRaw, 'imports'),
		importsKeys: webPkgRaw.imports ? Object.keys(webPkgRaw.imports) : []
	}
})

const pnpmWsPath = path.join(REPO, 'pnpm-workspace.yaml')
const pnpmWsRaw = fs.readFileSync(pnpmWsPath, 'utf8')
const mswAllowLine = pnpmWsRaw.match(/^\s*msw:\s*(.+)$/m)
const mswAllowRaw = mswAllowLine ? mswAllowLine[1].trim() : null
send({
	location: 'debug-shadcn-alias-probe.mjs:pnpm-allow-builds-msw',
	message: 'pnpm-workspace.yaml allowBuilds.msw (must be boolean true for msw postinstall)',
	hypothesisId: 'H5',
	data: {
		mswAllowRaw,
		isBooleanTrue: mswAllowRaw === 'true'
	}
})
