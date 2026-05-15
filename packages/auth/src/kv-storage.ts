const KV_MIN_TTL_SECONDS = 60

/** Better Auth secondary storage backed by Cloudflare KV (60s minimum TTL). */
export function createKvSecondaryStorage(kv: KVNamespace) {
	return {
		get: (key: string) => kv.get(key),
		set: async (key: string, value: string, ttl?: number) => {
			await kv.put(key, value, {
				expirationTtl: Math.max(ttl ?? KV_MIN_TTL_SECONDS, KV_MIN_TTL_SECONDS),
			})
		},
		delete: (key: string) => kv.delete(key),
		getAndDelete: async (key: string) => {
			const value = await kv.get(key)
			if (value !== null) {
				await kv.delete(key)
			}
			return value
		},
	}
}
