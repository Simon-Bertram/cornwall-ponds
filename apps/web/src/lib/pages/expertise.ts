/**
 * Expertise page copy. Maps 1:1 to the planned Sanity `expertisePage`
 * singleton.
 *
 * Experience claims canonicalized to 15+ years (page previously said 30+ /
 * "three decades", conflicting with the rest of the site).
 */
import type { SeoContent } from "./home";

export type TrustPillarIcon = "trophy" | "leaf" | "shield" | "heart";

export interface TrustPillar {
  title: string;
  body: string;
  icon: TrustPillarIcon;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface ExpertisePageContent {
  seo: SeoContent;
  header: { title: string; intro: string };
  whyChooseUs: {
    eyebrow: string;
    title: string;
    description: string;
    pillars: TrustPillar[];
    stats: TrustStat[];
  };
  credentialsSection: { title: string; intro: string };
  testimonialsTitle: string;
}

export const expertisePageContent: ExpertisePageContent = {
  seo: {
    title: "Our Expertise | Cornwall Ponds",
    description:
      "Over fifteen years of pond design and build expertise across Cornwall. Discover why homeowners trust Cornwall Ponds for craftsmanship, eco-first design, and lifetime support.",
  },
  header: {
    title: "Our Expertise",
    intro:
      "Over fifteen years of quiet expertise, a love of nature, and an unwavering commitment to every client we work with across Cornwall and beyond.",
  },
  whyChooseUs: {
    eyebrow: "Why Cornwall Ponds",
    title: "Craftsmanship You Can Trust",
    description:
      "Every project is built on over fifteen years of quiet expertise, a love of nature, and an unwavering commitment to our clients.",
    pillars: [
      {
        title: "15+ Years Experience",
        body: "Over fifteen years designing and building bespoke water features across Cornwall and Devon.",
        icon: "trophy",
      },
      {
        title: "Eco-First Design",
        body: "Wildlife-friendly construction using natural materials, native planting, and chemical-free filtration.",
        icon: "leaf",
      },
      {
        title: "Certified & Insured",
        body: "Fully qualified, insured, and members of the British Pond Trade Association.",
        icon: "shield",
      },
      {
        title: "Lifetime Support",
        body: "We don't disappear after build day. Every project includes ongoing aftercare advice.",
        icon: "heart",
      },
    ],
    stats: [
      { value: "200+", label: "Projects Completed" },
      { value: "15+", label: "Years of Experience" },
      { value: "100%", label: "Chemical-Free Options" },
      { value: "5★", label: "Average Client Rating" },
    ],
  },
  credentialsSection: {
    title: "Professional Standards",
    intro:
      "We don't just build ponds — we engineer living ecosystems, backed by verifiable credentials and industry memberships.",
  },
  testimonialsTitle: "What Our Clients Say",
};
