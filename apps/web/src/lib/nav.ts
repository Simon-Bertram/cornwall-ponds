export interface NavLink {
  href: string
  label: string
}

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/our-work', label: 'Our Work' },
  { href: '/services', label: 'Services' },
  { href: '/expertise', label: 'Expertise' },
  { href: '/contact', label: 'Contact' },
]

export function normalizeNavPath(pathname: string) {
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '')
}

export function isNavLinkActive(pathname: string, href: string) {
  return href === '/'
    ? pathname === '/'
    : pathname.startsWith(href)
}
