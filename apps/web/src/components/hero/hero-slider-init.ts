export interface HeroSliderOptions {
	intervalMs?: number
}

export function initHeroSlider(root: HTMLElement, options: HeroSliderOptions = {}): () => void {
	const slides = Array.from(root.querySelectorAll<HTMLElement>('.slide'))
	const indicators = Array.from(root.querySelectorAll<HTMLButtonElement>('.indicator-btn'))
	const pauseToggle = root.querySelector<HTMLButtonElement>('[data-hero-slider-pause]')

	if (slides.length <= 1 || indicators.length === 0) {
		return () => {}
	}

	let currentSlide = 0
	const totalSlides = slides.length
	const intervalMs = options.intervalMs ?? 7000
	let slideInterval: number | undefined
	let isPaused = false

	const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
	if (prefersReducedMotion) {
		isPaused = true
	}

	function updateSlide(nextIndex: number) {
		if (nextIndex === currentSlide) {
			return
		}

		const current = slides[currentSlide]
		const currentIndicator = indicators[currentSlide]
		const next = slides[nextIndex]
		const nextIndicator = indicators[nextIndex]

		current.classList.remove('opacity-100', 'z-10')
		current.classList.add('opacity-0', 'z-0')
		current.setAttribute('aria-hidden', 'true')
		current.inert = true

		currentIndicator.classList.remove('bg-white')
		currentIndicator.classList.add('bg-white/30')
		currentIndicator.setAttribute('aria-pressed', 'false')
		currentIndicator.removeAttribute('aria-current')

		currentSlide = nextIndex

		next.classList.remove('opacity-0', 'z-0')
		next.classList.add('opacity-100', 'z-10')
		next.setAttribute('aria-hidden', 'false')
		next.inert = false

		nextIndicator.classList.remove('bg-white/30')
		nextIndicator.classList.add('bg-white')
		nextIndicator.setAttribute('aria-pressed', 'true')
		nextIndicator.setAttribute('aria-current', 'true')
	}

	function nextSlide() {
		const nextIndex = (currentSlide + 1) % totalSlides
		updateSlide(nextIndex)
	}

	function startInterval() {
		if (isPaused || intervalMs <= 0) {
			return
		}

		stopInterval()
		slideInterval = window.setInterval(nextSlide, intervalMs)
	}

	function stopInterval() {
		if (slideInterval !== undefined) {
			window.clearInterval(slideInterval)
			slideInterval = undefined
		}
	}

	function handleIndicatorClick(event: Event) {
		const target = event.currentTarget as HTMLButtonElement | null
		if (!target) {
			return
		}

		const rawIndex = target.getAttribute('data-index')
		if (!rawIndex) {
			return
		}

		const index = Number.parseInt(rawIndex, 10)
		if (Number.isNaN(index) || index < 0 || index >= totalSlides) {
			return
		}

		updateSlide(index)

		// After explicit user navigation, stop auto-rotation for accessibility
		isPaused = true
		updatePauseToggle()
		stopInterval()
	}

	function updatePauseToggle() {
		if (!pauseToggle) return

		pauseToggle.setAttribute('aria-pressed', isPaused ? 'true' : 'false')
		pauseToggle.textContent = isPaused ? 'Play slideshow' : 'Pause slideshow'
	}

	function handlePauseToggle() {
		isPaused = !isPaused
		updatePauseToggle()

		if (isPaused) {
			stopInterval()
		} else {
			nextSlide()
			startInterval()
		}
	}

	indicators.forEach((indicator, index) => {
		indicator.addEventListener('click', handleIndicatorClick)

		if (index === 0) {
			indicator.setAttribute('aria-pressed', isPaused ? 'false' : 'true')
			if (!isPaused) {
				indicator.setAttribute('aria-current', 'true')
			}
		}
	})

	if (pauseToggle) {
		updatePauseToggle()
		pauseToggle.addEventListener('click', handlePauseToggle)
	}

	if (!isPaused) {
		startInterval()
	}

	return () => {
		stopInterval()
		indicators.forEach((indicator) => {
			indicator.removeEventListener('click', handleIndicatorClick)
		})

		if (pauseToggle) {
			pauseToggle.removeEventListener('click', handlePauseToggle)
		}
	}
}

