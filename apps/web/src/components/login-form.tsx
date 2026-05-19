"use client"

import { useState } from "react"

import { authClient } from "@/lib/auth-client"
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

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setStatus("loading")
		setErrorMessage(null)

		const formData = new FormData(event.currentTarget)
		const email = formData.get("email")
		if (typeof email !== "string" || !email) {
			setStatus("error")
			setErrorMessage("Please enter your email address.")
			return
		}

		const { error } = await authClient.signIn.magicLink({
			email,
			callbackURL: "/dashboard",
			newUserCallbackURL: "/dashboard",
		})

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

		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		})

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
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email and we&apos;ll send you a sign-in link.
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
								<Field>
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
										Login with Google
									</Button>
									{errorMessage ? (
										<p className="text-sm text-destructive" role="alert">
											{errorMessage}
										</p>
									) : null}
									<FieldDescription className="text-center">
										Don&apos;t have an account?{" "}
										<a
											href="/signup"
											className="underline-offset-2 hover:underline"
										>
											Sign up
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
