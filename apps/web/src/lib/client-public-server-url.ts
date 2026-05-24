import { PUBLIC_SERVER_URL } from "astro:env/client"

const META_NAME = "cornwall-ponds-public-server-url"

/** Set in Layout.astro from the Worker binding so client auth uses production API URL. */
export function getClientPublicServerUrl(): string {
	if (typeof document !== "undefined") {
		const fromDom = document.querySelector(`meta[name="${META_NAME}"]`)?.getAttribute(
			"content",
		);
		if (fromDom?.startsWith("https://")) {
			return fromDom;
		}
	}

	return PUBLIC_SERVER_URL;
}

export { META_NAME as PUBLIC_SERVER_URL_META_NAME };
