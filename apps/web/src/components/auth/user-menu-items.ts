import { authClient } from '@/lib/auth-client'

export const USER_MENU_LINKS = [
	{ label: 'Customer portal', href: '/dashboard' },
	{ label: 'Manage user details', href: '/account' },
] as const

export type UserMenuSessionUser = {
	name?: string | null
	email?: string | null
	image?: string | null
}

export function getDisplayName(user: UserMenuSessionUser): string {
	return user.name || user.email?.split('@')[0] || 'User'
}

export function initialsFromName(name: string | null | undefined): string | null {
	const trimmed = name?.trim()
	if (!trimmed) return null

	const parts = trimmed.split(/\s+/).filter(Boolean)
	if (parts.length >= 2) {
		const first = parts[0]?.[0]
		const last = parts[parts.length - 1]?.[0]
		if (first && last) {
			return `${first}${last}`.toUpperCase()
		}
	}

	return trimmed.slice(0, 2).toUpperCase()
}

export function getAvatarFallbackLabel(
	name: string | null | undefined,
	email: string | null | undefined,
): string | null {
	return initialsFromName(name) ?? email?.[0]?.toUpperCase() ?? null
}

export async function signOutUser(): Promise<void> {
	await authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				window.location.href = '/'
			},
		},
	})
}
