'use client'

import { User } from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import { getAvatarFallbackLabel, getDisplayName } from './user-menu-items'

export type UserAvatarTriggerProps = {
	imageUrl?: string | null
	name?: string | null
	email?: string | null
	size?: 'sm' | 'default' | 'lg'
	className?: string
}

export function UserAvatarTrigger({
	imageUrl,
	name,
	email,
	size = 'sm',
	className,
}: UserAvatarTriggerProps) {
	const displayName = getDisplayName({ name, email })
	const fallbackLabel = getAvatarFallbackLabel(name, email)
	const imageSrc = imageUrl?.trim() ?? ''

	return (
		<Avatar size={size} className={cn(className)}>
			{imageSrc ? (
				<AvatarImage src={imageSrc} alt={displayName} />
			) : null}
			<AvatarFallback>
				{fallbackLabel ? (
					<span aria-hidden="true">{fallbackLabel}</span>
				) : (
					<User aria-hidden="true" />
				)}
			</AvatarFallback>
		</Avatar>
	)
}
