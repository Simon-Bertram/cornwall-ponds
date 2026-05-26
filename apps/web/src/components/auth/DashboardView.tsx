"use client"

import { DashboardContent } from "@/components/auth/DashboardContent"
import { RequireAuth } from "@/components/auth/RequireAuth"

type DashboardViewProps = {
	initialDisplayName?: string
	initialEmail?: string | null
	viewAsCustomerId?: string
}

export function DashboardView({
	initialDisplayName,
	initialEmail,
	viewAsCustomerId,
}: DashboardViewProps) {
	return (
		<RequireAuth>
			<DashboardContent
				initialDisplayName={initialDisplayName}
				initialEmail={initialEmail}
				viewAsCustomerId={viewAsCustomerId}
			/>
		</RequireAuth>
	)
}
