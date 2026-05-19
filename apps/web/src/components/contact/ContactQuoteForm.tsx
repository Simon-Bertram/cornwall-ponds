"use client"

import { PUBLIC_SERVER_URL } from "astro:env/client"
import { useRef, useState } from "react"

import { TurnstileField } from "@/components/turnstile/TurnstileField"
import { turnstileHeaders } from "@/lib/turnstile-headers"

type FormStatus = "idle" | "loading" | "success" | "error"

export function ContactQuoteForm() {
	const [status, setStatus] = useState<FormStatus>("idle")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [turnstileToken, setTurnstileToken] = useState("")
	const formRef = useRef<HTMLFormElement>(null)

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setStatus("loading")
		setErrorMessage(null)

		const form = event.currentTarget
		const formData = new FormData(form)

		try {
			const response = await fetch(`${PUBLIC_SERVER_URL}/api/contact`, {
				method: "POST",
				body: formData,
				headers: turnstileHeaders(turnstileToken) ?? {},
			})

			if (!response.ok) {
				const data = (await response.json().catch(() => null)) as {
					error?: string
				} | null
				setStatus("error")
				setErrorMessage(
					data?.error ?? "Could not send your enquiry. Please try again.",
				)
				return
			}

			setStatus("success")
			form.reset()
			setTurnstileToken("")
		} catch {
			setStatus("error")
			setErrorMessage("Could not send your enquiry. Please try again.")
		}
	}

	return (
		<div className="w-full rounded-3xl border border-foreground/10 bg-card p-8 shadow-xl shadow-foreground/5 sm:p-10">
			{status === "success" ? (
				<p className="text-center text-base text-foreground/80">
					Thank you — we&apos;ve received your enquiry and will be in touch
					soon.
				</p>
			) : (
				<form
					ref={formRef}
					className="flex flex-col gap-8"
					onSubmit={handleSubmit}
				>
					<section className="flex flex-col gap-6">
						<h2 className="text-xl font-bold text-foreground">1. Your Details</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									First Name *
								</span>
								<input
									type="text"
									name="firstName"
									required
									placeholder="John"
									disabled={status === "loading"}
									className="input input-bordered w-full bg-muted/50 transition-colors focus:border-primary focus:bg-card"
								/>
							</label>
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									Last Name *
								</span>
								<input
									type="text"
									name="lastName"
									required
									placeholder="Smith"
									disabled={status === "loading"}
									className="input input-bordered w-full bg-muted/50 transition-colors focus:border-primary focus:bg-card"
								/>
							</label>
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									Email Address *
								</span>
								<input
									type="email"
									name="email"
									required
									placeholder="john@example.com"
									disabled={status === "loading"}
									className="input input-bordered w-full bg-muted/50 transition-colors focus:border-primary focus:bg-card"
								/>
							</label>
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									Phone Number *
								</span>
								<input
									type="tel"
									name="phone"
									required
									placeholder="07700 900000"
									disabled={status === "loading"}
									className="input input-bordered w-full bg-muted/50 transition-colors focus:border-primary focus:bg-card"
								/>
							</label>
						</div>
					</section>

					<section className="flex flex-col gap-6">
						<h2 className="text-xl font-bold text-foreground">
							2. Project Details
						</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									Service Required *
								</span>
								<select
									name="service"
									required
									defaultValue=""
									disabled={status === "loading"}
									className="select select-bordered w-full bg-muted/50 font-medium transition-colors focus:border-primary focus:bg-card"
								>
									<option value="" disabled>
										Select a Service
									</option>
									<option value="Garden Pond">Garden Pond</option>
									<option value="Natural Swimming Pond">
										Natural Swimming Pond
									</option>
									<option value="Koi Pond">Koi Pond</option>
									<option value="Water Feature">Water Feature</option>
									<option value="Maintenance">
										Maintenance &amp; Restoration
									</option>
								</select>
							</label>
							<label className="form-control gap-2">
								<span className="font-bold text-foreground/80">
									Estimated Budget *
								</span>
								<select
									name="budget"
									required
									defaultValue=""
									disabled={status === "loading"}
									className="select select-bordered w-full bg-muted/50 font-medium transition-colors focus:border-primary focus:bg-card"
								>
									<option value="" disabled>
										Guide Pricing
									</option>
									<option value="Under £5k">Under £5,000</option>
									<option value="£5k - £15k">£5,000 - £15,000</option>
									<option value="£15k - £30k">£15,000 - £30,000</option>
									<option value="£30k+">£30,000+</option>
								</select>
							</label>
							<label className="form-control gap-2 sm:col-span-2">
								<span className="font-bold text-foreground/80">
									Project Postcode *
								</span>
								<input
									type="text"
									name="postcode"
									required
									placeholder="TR1 1AA"
									disabled={status === "loading"}
									className="input input-bordered w-full bg-muted/50 transition-colors focus:border-primary focus:bg-card sm:w-1/2"
								/>
							</label>
							<label className="form-control gap-2 sm:col-span-2">
								<span className="font-bold text-foreground/80">
									Tell us about your vision *
								</span>
								<textarea
									name="message"
									required
									rows={4}
									placeholder="Briefly describe your garden space, ideas, and any specific requirements you have..."
									disabled={status === "loading"}
									className="textarea textarea-bordered w-full resize-y bg-muted/50 text-base transition-colors focus:border-primary focus:bg-card"
								/>
							</label>
						</div>
					</section>

					<div className="flex flex-col gap-4 border-t border-foreground/10 pt-6">
						<TurnstileField
							onTokenChange={setTurnstileToken}
							onError={() =>
								setErrorMessage("Security check failed. Please try again.")
							}
						/>
						<button
							type="submit"
							className="btn btn-primary btn-lg w-full font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-[1.01]"
							disabled={status === "loading"}
						>
							{status === "loading"
								? "Sending…"
								: "Book a free consultation"}
						</button>
						{errorMessage ? (
							<p className="text-center text-sm text-error" role="alert">
								{errorMessage}
							</p>
						) : null}
						<p className="mx-auto max-w-lg text-center text-xs leading-relaxed text-foreground/60">
							By submitting this form, you agree to our privacy policy. We will
							only use your information to contact you regarding your enquiry
							and never share it with third parties.
						</p>
					</div>
				</form>
			)}
		</div>
	)
}
