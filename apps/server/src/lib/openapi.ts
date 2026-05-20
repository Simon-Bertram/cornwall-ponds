import type { ServerEnv } from "@cornwall-ponds/env/bindings"

/**
 * Interactive docs at `/api-reference`.
 * Default: on for `development`, off for `production` or when `ENVIRONMENT` is unset
 * (conservative). Override with `OPENAPI_REFERENCE_ENABLED`.
 */
export function isOpenApiReferenceEnabled(env: ServerEnv): boolean {
	const v = env.OPENAPI_REFERENCE_ENABLED?.toLowerCase()
	if (v === "true" || v === "1") {
		return true
	}
	if (v === "false" || v === "0") {
		return false
	}
	const e = env.ENVIRONMENT?.toLowerCase()
	if (e === "development" || e === "dev") {
		return true
	}
	if (e === "production" || e === "prod") {
		return false
	}
	return false
}
