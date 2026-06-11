/**
 * Services page copy. Maps 1:1 to the planned Sanity `servicesPage` singleton.
 */
import type { SeoContent } from "./home";

export interface PhilosophyPillar {
  title: string;
  body: string;
  /** Heroicon-style 24x24 stroke paths. */
  svgPaths: string[];
}

export interface ServicesPageContent {
  seo: SeoContent;
  hero: { title: string; intro: string };
  philosophyPillars: PhilosophyPillar[];
  investmentGuide: { title: string; intro: string; disclaimer: string };
  credentialsSection: { title: string; intro: string };
  testimonialsTitle: string;
}

export const servicesPageContent: ServicesPageContent = {
  seo: {
    title: "Our Services | Bespoke Pond Design & Build | Cornwall Ponds",
    description:
      "Explore the full range of bespoke pond design and build services in Cornwall. From garden ponds to luxury natural swimming ponds. Free site visit and quote.",
  },
  hero: {
    title: "Our Services",
    intro:
      "From bespoke garden ponds and natural swimming pools to koi ponds, water features, and year-round maintenance — we design, build, and care for water in your landscape across Cornwall.",
  },
  philosophyPillars: [
    {
      title: "Nature-First Design",
      body: "Every feature is designed to work with your ecosystem. Wildlife and longevity are embedded from day one.",
      svgPaths: [
        "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      ],
    },
    {
      title: "Rooted in Cornwall",
      body: "15 years in Cornwall means we understand your soil, your coastline, and your weather — not just general principles.",
      svgPaths: [
        "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
        "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      ],
    },
    {
      title: "Built to Last",
      body: "Full aftercare documentation and optional lifetime support come with every build we complete.",
      svgPaths: [
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      ],
    },
  ],
  investmentGuide: {
    title: "Investment Guide",
    intro:
      "We pride ourselves on transparency. These guide prices help you baseline your project requirements.",
    disclaimer:
      "Guide figures only. Your exact quote follows a free site visit and design consultation — no obligation.",
  },
  credentialsSection: {
    title: "Professional Standards",
    intro:
      "We don't just build ponds — we engineer living ecosystems, backed by verifiable credentials.",
  },
  testimonialsTitle: "What Our Clients Say",
};
