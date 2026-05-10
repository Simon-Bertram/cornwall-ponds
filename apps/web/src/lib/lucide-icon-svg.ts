/** Lucide-style SVG element tree (tag + attributes), same shape as `lucide` / `@lucide/astro`. */
export type LucideIconNode = ReadonlyArray<
  readonly [string, Readonly<Record<string, string | number>>]
>;

/** Matches Lucide `menu` (see `@lucide/astro` `src/icons/menu.ts`). */
export const lucideMenuIcon: LucideIconNode = [
  ['path', { d: 'M4 5h16' }],
  ['path', { d: 'M4 12h16' }],
  ['path', { d: 'M4 19h16' }],
];

/** Matches Lucide `x` (see `@lucide/astro` `src/icons/x.ts`). */
export const lucideXIcon: LucideIconNode = [
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
];

function escapeAttr(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/**
 * Renders a Lucide IconNode to an SVG string (SSR-safe; no DOM).
 * Paths match the `lucide` package at build time.
 */
export function lucideIconToSvg(icon: LucideIconNode, className?: string): string {
  const inner = icon
    .map(([tag, attrs]) => {
      const pairs = Object.entries(attrs as Record<string, string | number>)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(' ');
      return `<${tag} ${pairs} />`;
    })
    .join('');
  const cls = className ? ` class="${escapeAttr(className)}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${cls}>${inner}</svg>`;
}
