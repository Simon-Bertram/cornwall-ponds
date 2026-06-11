/**
 * Site-wide business facts and global copy. Single source of truth ahead of
 * the Sanity migration — maps 1:1 to the planned `siteSettings` singleton.
 *
 * Canonical values resolved here (previously inconsistent across components):
 * - email: hello@cornwallponds.co.uk (Footer previously used info@)
 * - years of experience: 15+ (expertise page previously claimed 30+)
 */

export interface NavLinkItem {
  href: string;
  label: string;
}

export interface GlobalCtaContent {
  title: string;
  body: string;
  ctas: Array<{
    href: string;
    label: string;
    variant: "hero-primary" | "hero-outline";
  }>;
  trustItems: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: { display: string; href: string };
  email: string;
  address: { lines: string[] };
  openingHours: string;
  serviceArea: string;
  yearsOfExperience: number;
  trustBadge: string;
  footerBlurb: string;
  footerQuickLinks: NavLinkItem[];
  legalLinks: NavLinkItem[];
  copyrightNotice: string;
  globalCta: GlobalCtaContent;
}

export const siteSettings: SiteSettings = {
  siteName: "Cornwall Ponds",
  tagline: "Design & Build",
  phone: { display: "01234 567 890", href: "tel:+441234567890" },
  email: "hello@cornwallponds.co.uk",
  address: { lines: ["12 Artisan Way", "Truro, Cornwall", "TR1 2XY"] },
  openingHours: "Mon-Fri: 8am - 6pm",
  serviceArea: "Serving Cornwall & Devon",
  yearsOfExperience: 15,
  trustBadge: "Over 15 years of delivering excellence",
  footerBlurb:
    "With over 15 years of excellence, we create stunning water features across Cornwall. From bespoke fish ponds to grand natural swimming pools.",
  footerQuickLinks: [
    { href: "/our-work", label: "Our Work" },
    { href: "/expertise", label: "Our Expertise" },
    { href: "/contact", label: "Contact Us" },
  ],
  legalLinks: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  copyrightNotice:
    "Cornwall Ponds. All rights reserved. Registered in England & Wales.",
  globalCta: {
    title: "Ready to Transform Your Garden?",
    body: "Every project begins with a conversation. Tell us your vision — we'll handle the rest.",
    ctas: [
      { href: "/contact", label: "Book a Free Consultation", variant: "hero-primary" },
      { href: "/our-work", label: "Browse Our Work", variant: "hero-outline" },
    ],
    trustItems: ["Free site visit", "No obligation quote", "Fully insured"],
  },
};
