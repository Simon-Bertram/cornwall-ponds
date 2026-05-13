import { AuthCardShell } from "@/components/auth/AuthCardShell"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignInForm() {
	return (
		<AuthCardShell
			title="Welcome back"
			subtitle="Sign in to manage your Cornwall Ponds account."
			footerLead="Need an account?"
			footerLinkText="Sign up"
			footerHref="/signup"
		>
			<Field>
				<FieldLabel htmlFor="signin-email">Email</FieldLabel>
				<Input
					id="signin-email"
					type="email"
					name="email"
					autoComplete="email"
					placeholder="you@example.com"
					required
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="signin-password">Password</FieldLabel>
				<Input
					id="signin-password"
					type="password"
					name="password"
					autoComplete="current-password"
					placeholder="••••••••"
					required
				/>
			</Field>
			<Field>
				<Button type="button" className="w-full">
					Sign In
				</Button>
			</Field>
		</AuthCardShell>
	)
}
