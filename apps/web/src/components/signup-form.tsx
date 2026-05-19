"use client"

import { useState } from "react"

import { TurnstileField } from "@/components/turnstile/TurnstileField"
import { authCallbackUrl } from "@/lib/auth-callback-url"
import { authClient } from "@/lib/auth-client"
import { turnstileHeaders } from "@/lib/turnstile-headers"
import { PUBLIC_TURNSTILE_SITE_KEY } from "astro:env/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormStatus = "idle" | "loading" | "sent" | "error"

export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [turnstileToken, setTurnstileToken] = useState("")

	const turnstileRequired = Boolean(PUBLIC_TURNSTILE_SITE_KEY)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setStatus("loading")
		setErrorMessage(null)

		const formData = new FormData(event.currentTarget)
		const email = formData.get("email")
		const name = formData.get("name")
		if (typeof email !== "string" || !email) {
			setStatus("error")
			setErrorMessage("Please enter your email address.")
			return
		}

		if (turnstileRequired && !turnstileToken) {
			setStatus("error")
			setErrorMessage("Please complete the security check.")
			return
		}

		const { error } = await authClient.signIn.magicLink(
			{
				email,
				name: typeof name === "string" && name ? name : undefined,
				callbackURL: authCallbackUrl(),
				newUserCallbackURL: authCallbackUrl(),
			},
			{
				fetchOptions: {
					headers: turnstileHeaders(turnstileToken),
				},
			},
		)

		if (error) {
			setStatus("error")
			setErrorMessage(error.message ?? "Could not send sign-in link.")
			return
		}

		setStatus("sent")
	}

	async function handleGoogleSignIn() {
		setStatus("loading")
		setErrorMessage(null)

		if (turnstileRequired && !turnstileToken) {
			setStatus("error")
			setErrorMessage("Please complete the security check.")
			return
		}

		const { error } = await authClient.signIn.social(
			{
				provider: "google",
				callbackURL: authCallbackUrl(),
			},
			{
				fetchOptions: {
					headers: turnstileHeaders(turnstileToken),
				},
			},
		)

		if (error) {
			setStatus("error")
			setErrorMessage(error.message ?? "Could not start Google sign-in.")
			return
		}

		setStatus("idle")
	}

	return (
		<div className={cn("flex flex-col gap-6 p-8", className)} {...props}>
			<Card className="rounded-md">
				<CardHeader>
					<CardTitle>Sign up for an account</CardTitle>
					<CardDescription>
						Enter your details and we&apos;ll email you a sign-in link.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{status === "sent" ? (
						<p className="text-sm text-muted-foreground">
							Check your email for a sign-in link. It expires shortly.
						</p>
					) : (
						<form onSubmit={handleSubmit}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										disabled={status === "loading"}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="you@example.com"
										autoComplete="email"
										required
										disabled={status === "loading"}
									/>
								</Field>
								<Field>
									<TurnstileField
										onTokenChange={setTurnstileToken}
										onError={() =>
											setErrorMessage(
												"Security check failed. Please try again.",
											)
										}
									/>
									<Button
										type="submit"
										className="w-full"
										disabled={status === "loading"}
									>
										{status === "loading" ? "Sending…" : "Email sign-in link"}
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
										disabled={status === "loading"}
										onClick={handleGoogleSignIn}
									>
										Sign up with Google
									</Button>
									{errorMessage ? (
										<p className="text-sm text-destructive" role="alert">
											{errorMessage}
										</p>
									) : null}
									<FieldDescription className="text-center">
										Already have an account?{" "}
										<a
											href="/login"
											className="underline-offset-2 hover:underline"
										>
											Login
										</a>
									</FieldDescription>
								</Field>
							</FieldGroup>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
