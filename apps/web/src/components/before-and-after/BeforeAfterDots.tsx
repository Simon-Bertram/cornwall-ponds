import type { Project } from "../../lib/projects";

type TransformationProject = Pick<Project, "title" | "slug">;

interface BeforeAfterDotsProps {
  projects: TransformationProject[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function BeforeAfterDots({
  projects,
  currentIndex,
  onSelect,
}: BeforeAfterDotsProps) {
  return (
    <div
      className="flex justify-center gap-2 mt-4"
      role="tablist"
      aria-label="Project transformations"
    >
      {projects.map((project, index) => (
        <button
          key={project.slug}
          role="tab"
          type="button"
          aria-selected={index === currentIndex}
          aria-label={`View transformation: ${project.title}`}
          onClick={() => onSelect(index)}
          className="group flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
        >
          <span
            aria-hidden="true"
            className={`block h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-primary"
                : "w-2 bg-background/60 group-hover:bg-background/85"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
