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
    <nav aria-label="Choose a project transformation" className="mt-4">
      <ul className="flex justify-center gap-2">
        {projects.map((project, index) => {
          const isCurrent = index === currentIndex;

          return (
            <li key={project.slug}>
              <button
                type="button"
                aria-current={isCurrent ? "true" : undefined}
                aria-label={
                  isCurrent
                    ? `Currently viewing transformation: ${project.title}`
                    : `View transformation: ${project.title}`
                }
                onClick={() => onSelect(index)}
                className="group flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-6 bg-primary"
                      : "w-2 bg-background/60 group-hover:bg-background/85"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
