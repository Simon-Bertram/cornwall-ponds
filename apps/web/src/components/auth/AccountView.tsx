'use client'

import { AccountContent } from '@/components/auth/AccountContent'
import { RequireAuth } from '@/components/auth/RequireAuth'

type AccountViewProps = {
	initialDisplayName?: string
	initialEmail?: string | null
}

export function AccountView({
	initialDisplayName,
	initialEmail,
}: AccountViewProps) {
	return (
		<RequireAuth>
			<AccountContent
				initialDisplayName={initialDisplayName}
				initialEmail={initialEmail}
			/>
		</RequireAuth>
	)
}
