/// <reference types="astro/client" />
/// <reference path="../../../packages/env/env.d.ts" />

import type { Session, User } from "@cornwall-ponds/auth";

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}

export {};
