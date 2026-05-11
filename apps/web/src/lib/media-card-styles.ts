export const mediaCardShellClass =
	'group flex h-full flex-col overflow-hidden rounded-xl border border-foreground/10 bg-card shadow-sm transition-all duration-300 hover:shadow-xl'

export const mediaCardBodyClass = 'flex grow flex-col p-5'

export const mediaCardTitleLinkClass =
	'group/link mb-2 rounded-sm outline-none focus-visible:ring-2 ring-primary'

export const mediaCardTitleClass =
	'font-serif text-lg font-bold text-foreground transition-colors line-clamp-2 group-hover/link:text-primary sm:text-xl'

export const mediaCardDescriptionClass =
	'mb-4 grow text-sm text-foreground/80 line-clamp-2'

export const mediaCardActionClass =
	'group/btn mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm py-1 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:ring-2 ring-primary outline-none'

export const mediaCardImageClass =
	'absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'

export const mediaCardOverlayClass =
	'pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'
