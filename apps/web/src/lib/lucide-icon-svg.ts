import type { IconNode } from 'lucide';

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
export function lucideIconToSvg(icon: IconNode, className?: string): string {
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
