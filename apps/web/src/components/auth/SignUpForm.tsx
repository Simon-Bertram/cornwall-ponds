import { AuthCardShell } from "@/components/auth/AuthCardShell"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignUpForm() {
	return (
		<AuthCardShell
			title="Create account"
			subtitle="Join Cornwall Ponds to track projects and messages."
			footerLead="Already have an account?"
			footerLinkText="Sign in"
			footerHref="/login"
		>
			<Field>
				<FieldLabel htmlFor="signup-name">Name</FieldLabel>
				<Input
					id="signup-name"
					type="text"
					name="name"
					autoComplete="name"
					placeholder="John Doe"
					required
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="signup-email">Email</FieldLabel>
				<Input
					id="signup-email"
					type="email"
					name="email"
					autoComplete="email"
					placeholder="you@example.com"
					required
				/>
			</Field>
			<Field>
				<FieldLabel htmlFor="signup-password">Password</FieldLabel>
				<Input
					id="signup-password"
					type="password"
					name="password"
					autoComplete="new-password"
					placeholder="••••••••"
					minLength={8}
					required
				/>
				<FieldDescription>Must be at least 8 characters</FieldDescription>
			</Field>
			<Field>
				<Button type="button" className="w-full">
					Sign Up
				</Button>
			</Field>
		</AuthCardShell>
	)
}
