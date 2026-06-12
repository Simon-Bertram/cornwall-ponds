'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { getAuthClient } from '@/lib/auth-client'

import { UserAvatarTrigger } from './UserAvatarTrigger'
import {
	USER_MENU_LINKS,
	getDisplayName,
	signOutUser,
	type UserMenuSessionUser,
} from './user-menu-items'

export type UserAccountMenuProps = {
	variant?: 'compact' | 'mobile'
	initialName?: string | null
	initialEmail?: string | null
	initialImageUrl?: string | null
	initialLoggedIn?: boolean
	mobileLinkBaseClass?: string
	mobileLinkInactiveClass?: string
	signInLinkClassName?: string
}

type SessionUser = UserMenuSessionUser & { id?: string; role?: string | null }

function mapSessionUser(user: SessionUser) {
	return {
		name: user.name,
		email: user.email,
		image: user.image,
		displayName: getDisplayName(user),
	}
}

export function UserAccountMenu({
	variant = 'compact',
	initialName,
	initialEmail,
	initialImageUrl,
	initialLoggedIn = false,
	mobileLinkBaseClass = '',
	mobileLinkInactiveClass = '',
	signInLinkClassName = 'btn btn-primary antialiased rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
}: UserAccountMenuProps) {
	const [user, setUser] = useState<SessionUser | null>(
		initialLoggedIn
			? {
					name: initialName,
					email: initialEmail,
					image: initialImageUrl,
				}
			: null,
	)
	const [synced, setSynced] = useState(initialLoggedIn)

	useEffect(() => {
		if (initialLoggedIn) return

		let cancelled = false

		async function syncSession() {
			try {
				const { data } = await getAuthClient().getSession()
				if (cancelled) return
				if (data?.user) {
					setUser(data.user)
				}
			} catch {
				// Not logged in
			} finally {
				if (!cancelled) {
					setSynced(true)
				}
			}
		}

		void syncSession()

		return () => {
			cancelled = true
		}
	}, [initialLoggedIn])

	if (!user) {
		if (!synced && !initialLoggedIn) {
			return variant === 'compact' ? (
				<span
					className="inline-flex h-8 w-8 shrink-0 rounded-full"
					aria-live="polite"
					aria-busy="true"
				>
					<span className="sr-only">Loading account</span>
				</span>
			) : null
		}

		return (
			<a
				href="/login"
				className={cn(
					variant === 'mobile' && mobileLinkBaseClass,
					variant === 'mobile' && mobileLinkInactiveClass,
					signInLinkClassName,
				)}
				data-mobile-menu-link={variant === 'mobile' ? true : undefined}
			>
				Sign In
			</a>
		)
	}

	const { displayName } = mapSessionUser(user)
	const menuLinks = [
		...USER_MENU_LINKS,
		...(user.role === 'admin'
			? [{ label: 'Admin', href: '/admin' } as const]
			: []),
	]

	if (variant === 'mobile') {
		return (
			<div className="flex flex-col gap-1">
				<p className="px-3 py-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
					Account
				</p>
				<div className="flex items-center gap-3 px-3 py-2">
					<UserAvatarTrigger
						imageUrl={user.image}
						name={user.name}
						email={user.email}
						size="sm"
					/>
					<span className="text-base font-medium text-foreground">
						{displayName}
					</span>
				</div>
				<ul className="flex flex-col gap-1">
					{menuLinks.map((item) => (
						<li key={item.href}>
							<a
								href={item.href}
								data-mobile-menu-link
								className={cn(
									mobileLinkBaseClass,
									mobileLinkInactiveClass,
								)}
							>
								{item.label}
							</a>
						</li>
					))}
					<li>
						<button
							type="button"
							data-mobile-menu-link
							className={cn(
								mobileLinkBaseClass,
								mobileLinkInactiveClass,
								'w-full text-left',
							)}
							onClick={() => {
								void signOutUser()
							}}
						>
							<span className="text-destructive">Sign Out</span>
						</button>
					</li>
				</ul>
			</div>
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="rounded-full"
					aria-label={`Account menu for ${displayName}`}
				>
					<UserAvatarTrigger
						imageUrl={user.image}
						name={user.name}
						email={user.email}
						size="sm"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-48">
				{menuLinks.map((item) => (
					<DropdownMenuItem
						key={item.href}
						onSelect={() => {
							window.location.href = item.href
						}}
					>
						{item.label}
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onSelect={() => {
						void signOutUser()
					}}
				>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
