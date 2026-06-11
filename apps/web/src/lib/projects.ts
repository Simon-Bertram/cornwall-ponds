import type { ImageWithAlt } from "./image";

export type ServiceType =
  | "Garden Pond"
  | "Natural Swimming Pond"
  | "Koi Pond"
  | "Water Feature"
  | "Maintenance"
  | "Commercial";

export type Location =
  | "Penzance"
  | "Bude"
  | "Fowey"
  | "Truro"
  | "Falmouth"
  | "St Ives";

export interface Project {
  id: string;
  title: string;
  slug: string;
  serviceType: ServiceType;
  location: Location;
  thumbnail: ImageWithAlt;
  beforeImage: ImageWithAlt;
  afterImage: ImageWithAlt;
  shortDescription: string;
  challenge: string;
  solution: string;
  result: string;
  stats: {
    duration: string;
    volume?: string;
    area?: string;
    depth?: string;
  };
  gallery: ImageWithAlt[];
  featured: boolean;
}

/** Home BeforeAfter island — avoids serializing full `Project` in HTML. */
export type TransformationProject = Pick<
  Project,
  "title" | "location" | "beforeImage" | "afterImage" | "slug"
>;

export function toTransformationProjects(
  list: Project[],
): TransformationProject[] {
  return list.map((p) => ({
    title: p.title,
    location: p.location,
    beforeImage: p.beforeImage,
    afterImage: p.afterImage,
    slug: p.slug,
  }));
}

/** Portfolio island — card UI and filters only need these fields. */
export type PortfolioCardProject = Pick<
  Project,
  | "id"
  | "slug"
  | "title"
  | "serviceType"
  | "location"
  | "beforeImage"
  | "afterImage"
  | "shortDescription"
>;

export function toPortfolioCardProjects(
  list: Project[],
): PortfolioCardProject[] {
  return list.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    serviceType: p.serviceType,
    location: p.location,
    beforeImage: p.beforeImage,
    afterImage: p.afterImage,
    shortDescription: p.shortDescription,
  }));
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: ImageWithAlt;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  project: string;
  rating: number;
}

export const services: Service[] = [
  {
    id: "garden-ponds",
    title: "Garden Ponds",
    slug: "garden-ponds",
    description:
      "From intimate courtyard water gardens to expansive estate ponds, we design and build bespoke garden ponds that become the living heart of your outdoor space. Every pond is individually designed to complement your garden's character, soil conditions, and local wildlife.",
    shortDescription:
      "Bespoke garden ponds tailored to your landscape, from intimate water gardens to grand estate features.",
    image: {
      src: "/images/hero-pond.jpg",
      alt: "Bespoke garden pond with natural stone edging and lush planting",
    },
    features: [
      "Custom design & consultation",
      "Natural stone & planting schemes",
      "Filtration & pump systems",
      "Wildlife-friendly design",
      "Liner & concrete construction",
      "Lighting & accessories",
    ],
  },
  {
    id: "natural-swimming-ponds",
    title: "Natural Swimming Ponds",
    slug: "natural-swimming-ponds",
    description:
      "Experience the luxury of swimming in crystal-clear, chemical-free water in your own garden. Our natural swimming ponds use biological filtration zones and carefully selected aquatic plants to maintain pristine water quality, creating a stunning focal point that doubles as your private bathing retreat.",
    shortDescription:
      "Chemical-free swimming in stunning, naturally filtered water. The ultimate luxury garden feature.",
    image: {
      src: "/images/swimming-pond.jpg",
      alt: "Natural swimming pond with crystal-clear water and planted filtration zone",
    },
    features: [
      "Biological filtration zones",
      "Chemical-free water treatment",
      "Natural stone surrounds & decking",
      "Underwater lighting",
      "Heating options available",
      "Year-round maintenance plans",
    ],
  },
  {
    id: "koi-ponds",
    title: "Koi Ponds",
    slug: "koi-ponds",
    description:
      "We build specialist koi ponds engineered for the health and wellbeing of these magnificent fish. Our designs incorporate advanced filtration, optimal depth profiles, and viewing windows, all wrapped in a beautiful garden setting.",
    shortDescription:
      "Specialist koi ponds with advanced filtration, engineered for healthy, thriving fish.",
    image: {
      src: "/images/koi-pond.jpg",
      alt: "Specialist koi pond with colourful koi swimming in clear water",
    },
    features: [
      "Advanced multi-stage filtration",
      "Optimal depth profiles",
      "Viewing windows available",
      "UV sterilisation systems",
      "Aeration & oxygenation",
      "Quarantine pond options",
    ],
  },
  {
    id: "water-features",
    title: "Water Features",
    slug: "water-features",
    description:
      "From cascading waterfalls to contemporary spillways and natural stream courses, our water features add movement, sound, and drama to any outdoor space. Each feature is designed to work harmoniously with its surroundings.",
    shortDescription:
      "Cascading waterfalls, spillways and stream courses that bring movement and sound to your garden.",
    image: {
      src: "/images/water-feature.jpg",
      alt: "Cascading garden water feature in natural stone",
    },
    features: [
      "Waterfalls & cascades",
      "Contemporary spillways",
      "Natural stream courses",
      "Pondless water features",
      "Uplighting & effects",
      "Low-maintenance options",
    ],
  },
  {
    id: "maintenance",
    title: "Pond Maintenance",
    slug: "maintenance",
    description:
      "Keep your pond in pristine condition year-round with our professional maintenance services. From seasonal deep cleans to regular water quality management, our expert team ensures your water feature remains healthy, clear, and beautiful.",
    shortDescription:
      "Professional year-round pond care, from seasonal deep cleans to regular water quality management.",
    image: {
      src: "/images/maintenance.jpg",
      alt: "Pond specialist carrying out seasonal maintenance on a garden pond",
    },
    features: [
      "Seasonal deep cleaning",
      "Water quality testing",
      "Filter servicing",
      "Plant management & thinning",
      "Fish health checks",
      "Emergency call-out service",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "The Penzance Estate Pond",
    slug: "penzance-estate-pond",
    serviceType: "Garden Pond",
    location: "Penzance",
    thumbnail: {
      src: "/images/portfolio-1.jpg",
      alt: "The restored Penzance estate pond surrounded by native planting",
    },
    beforeImage: {
      src: "/images/before-1.jpg",
      alt: "Neglected, overgrown estate pond before restoration",
    },
    afterImage: {
      src: "/images/after-1.jpg",
      alt: "Restored estate pond with clear water and new stone collar",
    },
    shortDescription:
      "A complete transformation of a neglected Victorian estate pond into a stunning wildlife haven.",
    challenge:
      "The client inherited a large, leaking pond that had been neglected for over 15 years. The original clay lining had deteriorated, water levels were critically low, and the surrounding stonework had collapsed. Invasive plants had taken over, smothering native species.",
    solution:
      "We carried out a full de-silting operation, removing over 3 tonnes of accumulated sediment. The existing liner was replaced with a premium butyl rubber system, and we installed a new concrete collar around the entire perimeter. A comprehensive native planting scheme was designed to attract local wildlife while maintaining clear sight lines from the main house.",
    result:
      "The restored pond is now a thriving ecosystem, home to newts, dragonflies, and visiting kingfishers. The clients describe it as the jewel of their garden, and it has become a focal point for entertaining guests.",
    stats: {
      duration: "6 Days",
      volume: "15,000 Litres",
      area: "45 sqm",
    },
    gallery: [
      {
        src: "/images/portfolio-1.jpg",
        alt: "Wide view of the completed Penzance estate pond",
      },
      {
        src: "/images/before-1.jpg",
        alt: "The estate pond before work began",
      },
      {
        src: "/images/after-1.jpg",
        alt: "Detail of the new stone collar and planting scheme",
      },
    ],
    featured: true,
  },
  {
    id: "2",
    title: "Bude Coastal Swimming Pond",
    slug: "bude-coastal-swimming-pond",
    serviceType: "Natural Swimming Pond",
    location: "Bude",
    thumbnail: {
      src: "/images/swimming-pond.jpg",
      alt: "Natural swimming pond in a clifftop garden near Bude",
    },
    beforeImage: {
      src: "/images/before-2.jpg",
      alt: "Exposed clifftop garden before the swimming pond was built",
    },
    afterImage: {
      src: "/images/swimming-pond.jpg",
      alt: "Completed coastal swimming pond with Cornish slate surround",
    },
    shortDescription:
      "A spectacular natural swimming pond designed to withstand the coastal environment.",
    challenge:
      "The homeowners wanted a natural swimming pond in their clifftop garden, but the exposed coastal location presented unique challenges including salt-laden winds, shallow bedrock, and extreme weather conditions.",
    solution:
      "We designed a sheltered, wind-resistant pond with a robust concrete shell foundation laid directly onto the bedrock. A specially selected salt-tolerant planting scheme was used in the biological filtration zone, and local Cornish slate was sourced for the surrounding deck and retaining walls.",
    result:
      "The finished swimming pond provides a stunning, sheltered bathing experience with panoramic coastal views. The biological filtration maintains crystal-clear water throughout the swimming season without any chemicals.",
    stats: {
      duration: "12 Days",
      volume: "40,000 Litres",
      area: "80 sqm",
      depth: "2.2m",
    },
    gallery: [
      {
        src: "/images/swimming-pond.jpg",
        alt: "The coastal swimming pond with panoramic sea views",
      },
      {
        src: "/images/before-2.jpg",
        alt: "The clifftop site before construction",
      },
      {
        src: "/images/portfolio-3.jpg",
        alt: "Cornish slate decking beside the swimming pond",
      },
    ],
    featured: true,
  },
  {
    id: "3",
    title: "Fowey Harbourside Koi Pond",
    slug: "fowey-harbourside-koi-pond",
    serviceType: "Koi Pond",
    location: "Fowey",
    thumbnail: {
      src: "/images/koi-pond.jpg",
      alt: "L-shaped koi pond in a terraced harbourside garden in Fowey",
    },
    beforeImage: {
      src: "/images/before-1.jpg",
      alt: "Compact terraced garden before the koi pond was built",
    },
    afterImage: {
      src: "/images/koi-pond.jpg",
      alt: "Completed koi pond with viewing window set into the terrace wall",
    },
    shortDescription:
      "A bespoke koi pond with advanced filtration in a compact harbourside garden.",
    challenge:
      "The client wanted a substantial koi pond in a relatively compact terraced garden overlooking Fowey harbour. Space constraints meant we needed to maximise water volume while maintaining accessibility for fish care and filtration maintenance.",
    solution:
      "We designed a deep, L-shaped pond that followed the contours of the garden terracing, maximising volume within the available footprint. A hidden plant room houses the multi-stage filtration system including mechanical, biological, and UV stages. A viewing window was set into the lower terrace wall.",
    result:
      "The pond now houses 12 prize koi in pristine conditions. The viewing window has become a favourite feature, offering a unique underwater perspective of the fish. Water clarity is exceptional year-round.",
    stats: {
      duration: "8 Days",
      volume: "12,000 Litres",
      depth: "1.8m",
    },
    gallery: [
      {
        src: "/images/koi-pond.jpg",
        alt: "Prize koi swimming in the completed harbourside pond",
      },
      {
        src: "/images/before-1.jpg",
        alt: "The terraced garden before work began",
      },
      {
        src: "/images/after-1.jpg",
        alt: "The viewing window in the lower terrace wall",
      },
    ],
    featured: true,
  },
  {
    id: "4",
    title: "Truro Garden Water Feature",
    slug: "truro-garden-water-feature",
    serviceType: "Water Feature",
    location: "Truro",
    thumbnail: {
      src: "/images/water-feature.jpg",
      alt: "Tiered granite water feature in a contemporary Truro garden",
    },
    beforeImage: {
      src: "/images/before-2.jpg",
      alt: "The garden before the water feature was installed",
    },
    afterImage: {
      src: "/images/water-feature.jpg",
      alt: "Completed five-tier granite cascade with integrated lighting",
    },
    shortDescription:
      "A contemporary cascading water feature with integrated lighting for a modern Truro garden.",
    challenge:
      "A newly built contemporary home needed a statement water feature that would complement its modern architecture while providing the soothing sound of running water to mask road noise from the nearby lane.",
    solution:
      "We created a tiered cascade using honed Cornish granite, with water flowing over five levels into a hidden reservoir below. LED strip lighting was integrated into each tier, and the entire system is controlled via a smartphone app for easy scheduling.",
    result:
      "The water feature provides a dramatic focal point both day and night. The sound of flowing water effectively masks the road noise, creating a peaceful garden retreat. The client reports it is the most commented-on feature by visitors.",
    stats: {
      duration: "4 Days",
      area: "8 sqm",
    },
    gallery: [
      {
        src: "/images/water-feature.jpg",
        alt: "The granite cascade flowing over five levels",
      },
      {
        src: "/images/before-2.jpg",
        alt: "The bare garden before installation",
      },
      {
        src: "/images/after-2.jpg",
        alt: "The water feature lit at dusk",
      },
    ],
    featured: false,
  },
  {
    id: "5",
    title: "Falmouth Hotel Restoration",
    slug: "falmouth-hotel-restoration",
    serviceType: "Maintenance",
    location: "Falmouth",
    thumbnail: {
      src: "/images/after-2.jpg",
      alt: "Restored ornamental pond in the Falmouth hotel gardens",
    },
    beforeImage: {
      src: "/images/before-1.jpg",
      alt: "The leaking ornamental pond before restoration",
    },
    afterImage: {
      src: "/images/after-2.jpg",
      alt: "The fully restored hotel pond with refreshed planting",
    },
    shortDescription:
      "Emergency restoration of a boutique hotel's ornamental pond system.",
    challenge:
      "A prestigious Falmouth boutique hotel contacted us after their main ornamental pond developed a major leak, losing 500 litres per day. The pond was a centrepiece of their award-winning gardens and needed to be operational for the approaching tourist season.",
    solution:
      "We diagnosed the leak to a failed seam in the original liner, which had degraded over 20 years. We drained and temporarily rehomed the fish, removed the old liner, and installed a new welded EPDM system with a protective underlay. The filtration was upgraded and all planting refreshed.",
    result:
      "The pond was fully operational within 5 days, well ahead of the tourist season. The hotel reported that the refreshed pond received numerous compliments from guests and featured in a regional tourism article.",
    stats: {
      duration: "5 Days",
      volume: "8,000 Litres",
    },
    gallery: [
      {
        src: "/images/after-2.jpg",
        alt: "The restored pond as the centrepiece of the hotel gardens",
      },
      {
        src: "/images/before-1.jpg",
        alt: "The failing pond before the new liner was installed",
      },
      {
        src: "/images/after-1.jpg",
        alt: "Refreshed marginal planting around the restored pond",
      },
    ],
    featured: false,
  },
  {
    id: "6",
    title: "St Ives Artist's Retreat Pond",
    slug: "st-ives-artists-retreat-pond",
    serviceType: "Garden Pond",
    location: "St Ives",
    thumbnail: {
      src: "/images/portfolio-2.jpg",
      alt: "Naturalistic wildlife pond in a St Ives studio garden",
    },
    beforeImage: {
      src: "/images/before-2.jpg",
      alt: "The small studio garden before the wildlife pond was created",
    },
    afterImage: {
      src: "/images/portfolio-1.jpg",
      alt: "The completed wildlife pond with shallow beach area and marginal planting",
    },
    shortDescription:
      "A naturalistic wildlife pond designed as a source of creative inspiration.",
    challenge:
      "A professional artist wanted a naturalistic pond that would attract wildlife to their studio garden in St Ives, providing daily inspiration for their watercolour work. The garden was small with poor drainage and heavy clay soil.",
    solution:
      "We used the clay soil to our advantage, creating a natural clay-lined pond supplemented with bentonite matting. A shallow beach area attracts bathing birds, while deeper sections provide habitat for amphibians. Marginal planting was chosen for seasonal colour and texture.",
    result:
      "The pond has become a magnet for local wildlife including frogs, newts, dragonflies, and numerous bird species. The artist has produced a series of acclaimed watercolours inspired directly by the pond.",
    stats: {
      duration: "3 Days",
      volume: "5,000 Litres",
      area: "20 sqm",
    },
    gallery: [
      {
        src: "/images/portfolio-2.jpg",
        alt: "The wildlife pond viewed from the artist's studio",
      },
      {
        src: "/images/before-2.jpg",
        alt: "The waterlogged garden before the pond was dug",
      },
      {
        src: "/images/after-2.jpg",
        alt: "Marginal planting providing seasonal colour at the pond edge",
      },
    ],
    featured: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Margaret & David H.",
    location: "Penzance",
    quote:
      "Cornwall Ponds transformed our neglected old pond into the most beautiful feature in our garden. The attention to detail was extraordinary, and the team were a pleasure to work with. We could not be happier.",
    project: "The Penzance Estate Pond",
    rating: 5,
  },
  {
    id: "2",
    name: "James T.",
    location: "Bude",
    quote:
      "Having a natural swimming pond was our dream for years. The team at Cornwall Ponds made it a reality beyond our wildest expectations. Swimming in crystal-clear water with views of the Cornish coast is simply magical.",
    project: "Bude Coastal Swimming Pond",
    rating: 5,
  },
  {
    id: "3",
    name: "Sarah & Michael P.",
    location: "Fowey",
    quote:
      "The koi pond is absolutely spectacular. The viewing window was a masterstroke suggestion from the team. Our fish are thriving and the water quality is consistently perfect. Truly outstanding craftsmanship.",
    project: "Fowey Harbourside Koi Pond",
    rating: 5,
  },
  {
    id: "4",
    name: "Rebecca L.",
    location: "St Ives",
    quote:
      "My little wildlife pond has brought me more joy than I could have imagined. Every morning I sit with my coffee and watch the dragonflies. Cornwall Ponds understood exactly what I wanted.",
    project: "St Ives Artist's Retreat Pond",
    rating: 5,
  },
];

export const locations: Location[] = [
  "Penzance",
  "Bude",
  "Fowey",
  "Truro",
  "Falmouth",
  "St Ives",
];

export const serviceTypes: ServiceType[] = [
  "Garden Pond",
  "Natural Swimming Pond",
  "Koi Pond",
  "Water Feature",
  "Maintenance",
  "Commercial",
];
