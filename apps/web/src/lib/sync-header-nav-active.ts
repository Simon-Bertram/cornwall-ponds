import {
	HEADER_NAV_LINK_ACTIVE,
	HEADER_NAV_LINK_INACTIVE,
} from '@/lib/header-nav-styles'
import { isNavLinkActive } from '@/lib/nav'

function applyClassTokens(
	element: HTMLElement,
	addTokens: string,
	removeTokens: string,
) {
	for (const token of removeTokens.split(/\s+/)) {
		if (token) element.classList.remove(token)
	}
	for (const token of addTokens.split(/\s+/)) {
		if (token) element.classList.add(token)
	}
}

export function syncHeaderNavActive(pathname = window.location.pathname) {
	const header = document.querySelector('header')
	if (!header) return

	const links = header.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')

	for (const link of links) {
		const href = link.getAttribute('data-nav-link')
		if (!href) continue

		const isActive = isNavLinkActive(pathname, href)

		if (isActive) {
			link.setAttribute('aria-current', 'page')
			applyClassTokens(link, HEADER_NAV_LINK_ACTIVE, HEADER_NAV_LINK_INACTIVE)
		} else {
			link.removeAttribute('aria-current')
			applyClassTokens(link, HEADER_NAV_LINK_INACTIVE, HEADER_NAV_LINK_ACTIVE)
		}
	}
}
