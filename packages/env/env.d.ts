import type { ServerEnv, WebWorkerBindings } from "./src/bindings";

declare global {
	type Env = ServerEnv;
}

declare module "cloudflare:workers" {
	namespace Cloudflare {
		export interface Env extends ServerEnv, WebWorkerBindings {}
	}
}
