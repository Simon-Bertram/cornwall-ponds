import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const nodeModules = join(root, 'node_modules')

/** @returns {string[]} */
function findAlchemyExecFiles(dir, depth = 0) {
	if (depth > 14) return []
	const results = []
	try {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name)
			if (entry.isDirectory()) {
				results.push(...findAlchemyExecFiles(path, depth + 1))
			} else if (
				entry.name === 'exec.js' &&
				path.includes(`${join('alchemy', 'lib', 'os', 'exec.js')}`)
			) {
				results.push(path)
			}
		}
	} catch {
		// ignore missing dirs during partial installs
	}
	return results
}

const parseBlock = `        // Parse the command into command and args
        const [cmd, ...args] = props.command.split(/\\s+/);
`

let fixed = 0

for (const file of findAlchemyExecFiles(nodeModules)) {
	let content = readFileSync(file, 'utf8')
	if (!content.includes('spawn(cmd, args,')) continue

	content = content.replace(parseBlock, '')
	content = content.replace(
		'const childProcess = spawn(cmd, args, {',
		'const childProcess = spawn(props.command, {',
	)
	content = content.replace(
		'    const [cmd, ...args] = command.split(/\\s+/);\n',
		'',
	)
	content = content.replace(
		'const child = spawn(cmd, args, spawnOptions);',
		'const child = spawn(command, spawnOptions);',
	)

	writeFileSync(file, content)
	fixed++
}

if (fixed > 0) {
	console.log(`Applied Alchemy DEP0190 spawn fix to ${fixed} file(s)`)
}
