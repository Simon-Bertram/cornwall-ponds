/// <reference types="astro/client" />

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
