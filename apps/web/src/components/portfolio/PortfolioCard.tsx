import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "../../lib/projects";

interface PortfolioCardProps {
  project: Project;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="group flex flex-col h-full bg-card rounded-xl overflow-hidden border border-foreground/10 shadow-sm hover:shadow-xl transition-all duration-300">
      <a
        href={`/our-work/${project.slug}`}
        className="block relative aspect-4/3 overflow-hidden"
      >
        {/* Before Image */}
        <img
          src={project.beforeImage}
          alt={`Before: ${project.title}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105 ${showAfter ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
        />

        {/* After Image */}
        <img
          src={project.afterImage}
          alt={`After: ${project.title}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:scale-105 ${showAfter ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />

        {/* Before/After Toggle */}
        <div className="absolute top-3 left-3 z-10 flex rounded-full bg-muted/92 backdrop-blur-md overflow-hidden p-0.5 border border-foreground/15 shadow-sm">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowAfter(false);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${!showAfter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowAfter(true);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${showAfter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            After
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
          <span className="rounded-full bg-primary/95 text-primary-foreground px-2.5 py-1.5 text-[11px] font-bold tracking-wide shadow-sm">
            {project.serviceType}
          </span>
          <span className="rounded-full bg-muted/80 text-muted-foreground backdrop-blur-sm px-2.5 py-1.5 text-[11px] font-medium shadow-sm">
            {project.location}
          </span>
        </div>

        {/* Shadow gradient for text contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </a>

      <div className="p-5 flex flex-col grow">
        <a
          href={`/our-work/${project.slug}`}
          className="group/link mb-2 outline-none focus-visible:ring-2 ring-primary rounded-sm"
        >
          <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground group-hover/link:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
        </a>
        <p className="text-sm text-foreground/80 line-clamp-2 mb-4 grow">
          {project.shortDescription}
        </p>
        <a
          href={`/our-work/${project.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors w-fit group/btn outline-none focus-visible:ring-2 ring-primary rounded-sm py-1"
        >
          View Case Study
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
