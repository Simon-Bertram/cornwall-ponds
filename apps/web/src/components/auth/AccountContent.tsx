'use client'

type AccountContentProps = {
	initialDisplayName?: string
	initialEmail?: string | null
}

export function AccountContent({
	initialDisplayName = 'User',
	initialEmail,
}: AccountContentProps) {
	return (
		<main className="mx-auto max-w-2xl px-4 py-12 sm:py-18">
			<h1 className="text-4xl font-bold text-primary my-8">
				Manage your details
			</h1>
			<div className="space-y-6">
				<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
					<p className="text-sm text-muted-foreground">Name</p>
					<p className="mt-1 text-lg font-medium text-foreground">
						{initialDisplayName}
					</p>
				</div>
				{initialEmail ? (
					<div className="rounded-lg border border-border/15 bg-muted/40 p-6">
						<p className="text-sm text-muted-foreground">Email</p>
						<p className="mt-1 text-lg font-medium text-foreground">
							{initialEmail}
						</p>
					</div>
				) : null}
				<p className="text-sm text-muted-foreground">
					Profile editing will be available here in a future update.
				</p>
			</div>
		</main>
	)
}
