import { heroSlides } from "../../lib/hero-slides";
import type { HeroSlide } from "../../lib/hero-slides";

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

/**
 * Temporary static content layer until the hero section is served via CMS.
 */
export const heroContent: HeroContent = {
  regionLabel: "Featured pond projects slideshow",
  slides: heroSlides,
  ctas: [
    {
      href: "/contact",
      label: "Request a Free Quote",
      tone: "primary",
    },
    {
      href: "/our-work",
      label: "View Our Work",
      tone: "secondary",
    },
  ],
};
