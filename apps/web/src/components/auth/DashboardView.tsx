"use client"

import { DashboardContent } from "@/components/auth/DashboardContent"
import { RequireAuth } from "@/components/auth/RequireAuth"

type DashboardViewProps = {
	initialDisplayName?: string
	initialEmail?: string | null
}

export function DashboardView({
	initialDisplayName,
	initialEmail,
}: DashboardViewProps) {
	return (
		<RequireAuth>
			<DashboardContent
				initialDisplayName={initialDisplayName}
				initialEmail={initialEmail}
			/>
		</RequireAuth>
	)
}
