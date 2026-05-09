/**
 * Shape consumed by the hero carousel. When slides are sourced from Sanity,
 * map the CMS document fields to this type in the page or a dedicated loader.
 */
export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  /** First slide: eager load / high fetch priority for LCP */
  priority: boolean;
}

/** Static placeholder until hero content is fetched from Sanity. */
export const heroSlides: HeroSlide[] = [
  {
    image: "/images/hero-pond.jpg",
    title: "Bespoke Pond Design",
    subtitle: "for Cornwall & Devon",
    description:
      "Cornwall's premier pond specialists. We design, build and maintain stunning water features that transform outdoor spaces into living works of art.",
    priority: true,
  },
  {
    image: "/images/swimming-pond.jpg",
    title: "Natural Swimming Ponds",
    subtitle: "Chemical-free luxury",
    description:
      "Experience the luxury of swimming in crystal-clear, chemical-free water in your own garden. The ultimate natural outdoor feature.",
    priority: false,
  },
  {
    image: "/images/koi-pond.jpg",
    title: "Specialist Koi Ponds",
    subtitle: "Engineered for perfection",
    description:
      "We build specialist koi ponds engineered with advanced filtration systems for the health and wellbeing of these magnificent fish.",
    priority: false,
  },
  {
    image: "/images/maintenance.jpg",
    title: "Pond Maintenance",
    subtitle: "Professional year-round care",
    description:
      "Keep your pond in pristine condition year-round with our professional maintenance, cleaning, and restoration services.",
    priority: false,
  },
];
