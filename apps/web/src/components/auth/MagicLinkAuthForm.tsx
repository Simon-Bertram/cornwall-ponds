"use client"

import { useState } from "react"

import { TurnstileField } from "@/components/turnstile/TurnstileField"
import { authCallbackUrl } from "@/lib/auth-callback-url"
import { getAuthClient } from "@/lib/auth-client"
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

export function MagicLinkAuthForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [turnstileToken, setTurnstileToken] = useState("")
	const [showName, setShowName] = useState(false)

	const turnstileRequired = Boolean(PUBLIC_TURNSTILE_SITE_KEY)

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
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

		const { error } = await getAuthClient().signIn.magicLink(
			{
				email,
				name: typeof name === "string" && name ? name : undefined,
				callbackURL: authCallbackUrl(),
				newUserCallbackURL: authCallbackUrl(),
			},
			{
				headers: turnstileHeaders(turnstileToken),
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

		const { error } = await getAuthClient().signIn.social(
			{
				provider: "google",
				callbackURL: authCallbackUrl(),
			},
			{
				headers: turnstileHeaders(turnstileToken),
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
					<CardTitle>Customer portal</CardTitle>
					<CardDescription>
						Continue with email to access your contracts and care guides.
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
								{showName ? (
									<Field>
										<FieldLabel htmlFor="name">Name (optional)</FieldLabel>
										<Input
											id="name"
											name="name"
											type="text"
											autoComplete="name"
											disabled={status === "loading"}
										/>
									</Field>
								) : (
									<Field>
										<button
											type="button"
											className="text-sm text-muted-foreground underline-offset-2 hover:underline"
											onClick={() => setShowName(true)}
										>
											Add your name (optional)
										</button>
									</Field>
								)}
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
										{status === "loading"
											? "Sending…"
											: "Continue with email"}
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
										disabled={status === "loading"}
										onClick={handleGoogleSignIn}
									>
										Continue with Google
									</Button>
									{errorMessage ? (
										<p className="text-sm text-destructive" role="alert">
											{errorMessage}
										</p>
									) : null}
									<FieldDescription className="text-center">
										First time here? Use the same form — we&apos;ll email you a
										sign-in link.
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
