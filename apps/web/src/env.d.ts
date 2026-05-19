/// <reference types="astro/client" />

import type { Session, User } from "@cornwall-ponds/auth";
import type { WebWorkerEnv } from "@cornwall-ponds/env/web-worker";

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
			runtime?: {
				env: WebWorkerEnv;
			};
		}
	}
}

export {};
