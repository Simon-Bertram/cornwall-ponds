"use client"

import type { ReactNode } from "react"

import { RequireAdmin } from "@/components/auth/RequireAdmin"

type AdminLayoutProps = {
	children: ReactNode
	title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
	return (
		<RequireAdmin>
			<div className="mx-auto max-w-5xl px-4 py-10">
				<header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-3xl font-bold text-primary">{title}</h1>
					<nav className="flex flex-wrap gap-4 text-sm">
						<a href="/admin" className="underline-offset-2 hover:underline">
							Overview
						</a>
						<a
							href="/admin/customers"
							className="underline-offset-2 hover:underline"
						>
							Customers
						</a>
						<a
							href="/dashboard"
							className="underline-offset-2 hover:underline"
						>
							Customer portal
						</a>
					</nav>
				</header>
				{children}
			</div>
		</RequireAdmin>
	)
}
