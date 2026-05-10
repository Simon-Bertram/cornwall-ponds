import * as React from 'react'

import { cn } from '@/lib/utils'

function FullWidthDivider({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			aria-hidden='true'
			className={cn(
				'relative left-1/2 h-px w-screen -translate-x-1/2 bg-border',
				className,
			)}
			{...props}
		/>
	)
}

export { FullWidthDivider }
