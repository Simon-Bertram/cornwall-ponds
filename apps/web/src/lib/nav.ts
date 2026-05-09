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
