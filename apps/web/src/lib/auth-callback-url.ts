import { PUBLIC_WEB_URL } from "astro:env/client";

export function authCallbackUrl(path = "/dashboard"): string {
	return new URL(path, PUBLIC_WEB_URL).href;
}
