import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  mediaCardActionClass,
  mediaCardBodyClass,
  mediaCardDescriptionClass,
  mediaCardImageClass,
  mediaCardOverlayClass,
  mediaCardShellClass,
  mediaCardTitleClass,
  mediaCardTitleLinkClass,
} from "../../lib/media-card-styles";
import type { PortfolioCardProject } from "../../lib/projects";

interface PortfolioCardProps {
  project: PortfolioCardProject;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className={mediaCardShellClass}>
      <a
        href={`/our-work/${project.slug}`}
        className="block relative aspect-4/3 overflow-hidden"
      >
        {/* Before Image */}
        <img
          src={project.beforeImage.src}
          alt={project.beforeImage.alt}
          className={`${mediaCardImageClass} transition-opacity ${showAfter ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
        />

        {/* After Image */}
        <img
          src={project.afterImage.src}
          alt={project.afterImage.alt}
          className={`${mediaCardImageClass} transition-opacity ${showAfter ? "opacity-100" : "opacity-0"}`}
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
        <div className={mediaCardOverlayClass} />
      </a>

      <div className={mediaCardBodyClass}>
        <a
          href={`/our-work/${project.slug}`}
          className={mediaCardTitleLinkClass}
        >
          <h3 className={mediaCardTitleClass}>
            {project.title}
          </h3>
        </a>
        <p className={mediaCardDescriptionClass}>
          {project.shortDescription}
        </p>
        <a
          href={`/our-work/${project.slug}`}
          className={mediaCardActionClass}
        >
          View Case Study
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
