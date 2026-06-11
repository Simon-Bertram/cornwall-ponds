/**
 * Home page copy. Maps 1:1 to the planned Sanity `homePage` singleton;
 * components receive these objects as props so the CMS swap only changes
 * the data source in the page frontmatter.
 */
import { heroSlides } from "../hero-slides";
import type { HeroSlide } from "../hero-slides";

export interface SeoContent {
  title: string;
  description: string;
}

export interface SectionHeaderContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface FooterCtaContent {
  copy: string;
  href: string;
  label: string;
}

export interface HeroCta {
  href: string;
  label: string;
  tone: "primary" | "secondary";
}

export interface HeroContent {
  regionLabel: string;
  slides: HeroSlide[];
  ctas: HeroCta[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface HomePageContent {
  seo: SeoContent;
  hero: HeroContent;
  servicesPreview: SectionHeaderContent & { footerCta: FooterCtaContent };
  transformations: SectionHeaderContent & { ctaLabel: string };
  howWeWork: SectionHeaderContent & {
    steps: ProcessStep[];
    stepsAriaLabel: string;
    footerCta: FooterCtaContent;
  };
  testimonials: { eyebrow: string; title: string };
}

export const homePageContent: HomePageContent = {
  seo: {
    title: "Bespoke Pond Design & Build in Cornwall | Cornwall Ponds",
    description:
      "Cornwall's pond design and build specialists. Bespoke garden ponds, natural swimming ponds, koi ponds, and water features — designed, built, and maintained across Cornwall and Devon.",
  },
  hero: {
    regionLabel: "Featured pond projects slideshow",
    slides: heroSlides,
    ctas: [
      { href: "/contact", label: "Request a Free Quote", tone: "primary" },
      { href: "/our-work", label: "View Our Work", tone: "secondary" },
    ],
  },
  servicesPreview: {
    eyebrow: "Our Services",
    title: "What We Create",
    description:
      "From intimate wildlife ponds to grand natural swimming pools — every project is bespoke, built by hand, and designed to last a lifetime.",
    footerCta: {
      copy: "Not sure which service is right for you?",
      href: "/contact",
      label: "Book a Free Consultation",
    },
  },
  transformations: {
    eyebrow: "Our Work",
    title: "Recent Transformations",
    description:
      "Drag the slider to reveal the before & after. Every image is from a real Cornwall Ponds project.",
    ctaLabel: "View All Projects",
  },
  howWeWork: {
    eyebrow: "Our Process",
    title: "How We Work",
    description:
      "From first conversation to finished pond — a clear, transparent journey with no surprises.",
    stepsAriaLabel: "Our 4-step process",
    steps: [
      {
        number: "01",
        title: "Free Consultation",
        description:
          "We visit your site, listen to your vision, and assess the landscape. No obligation.",
      },
      {
        number: "02",
        title: "Bespoke Design",
        description:
          "Our designers create a detailed plan tailored to your garden, budget, and ecosystem goals.",
      },
      {
        number: "03",
        title: "Expert Build",
        description:
          "Our experienced team constructs your pond with minimal disruption and maximum care.",
      },
      {
        number: "04",
        title: "Aftercare & Support",
        description:
          "We provide a full handover, ongoing advice, and optional maintenance contracts.",
      },
    ],
    footerCta: {
      copy: "Ready to begin?",
      href: "/contact",
      label: "Start with a Free Site Visit",
    },
  },
  testimonials: {
    eyebrow: "Our Clients",
    title: "Testimonials",
  },
};
