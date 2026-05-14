import { useState } from "react";
import type { TransformationProject } from "../../lib/projects.ts";
import BeforeAfterSlider from "./BeforeAfterSlider.tsx";
import BeforeAfterProjectNav from "./BeforeAfterProjectNav.tsx";
import BeforeAfterDots from "./BeforeAfterDots.tsx";

interface Props {
  projects: TransformationProject[];
}

export default function BeforeAfter({ projects }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const project = projects[currentIndex];
  if (!project) return null;

  const handlePrev = () => {
    const nextIndex = (currentIndex - 1 + projects.length) % projects.length;
    setCurrentIndex(nextIndex);
  };
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % projects.length;
    setCurrentIndex(nextIndex);
  };

  const hasMultipleProjects = projects.length > 1;

  return (
    <section
      data-before-after-root="true"
      aria-labelledby="transformations-heading"
      className="py-24 sm:py-32 bg-foreground"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-background mb-3">
            Our Work
          </p>
          <h2
            id="transformations-heading"
            className="font-serif text-3xl font-bold tracking-tight text-background sm:text-4xl"
          >
            Recent Transformations
          </h2>
          <p className="mt-4 text-background/90 text-lg leading-relaxed">
            Drag the slider to reveal the before &amp; after. Every image is
            from a real Cornwall Ponds project.
          </p>
        </div>

        {/* ── Slider area ── */}
        <div className="mx-auto max-w-4xl">
          <p id="before-after-instructions" className="sr-only">
            Use left and right arrow keys or drag to compare the before and
            after images for this project.
          </p>

          <div data-before-after-slider-area="true">
            <BeforeAfterSlider
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              title={project.title}
            />
          </div>

          <BeforeAfterProjectNav
            title={project.title}
            location={project.location}
            hasMultipleProjects={hasMultipleProjects}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {hasMultipleProjects && (
            <BeforeAfterDots
              projects={projects}
              currentIndex={currentIndex}
              onSelect={setCurrentIndex}
            />
          )}

          {/* ── CTA ── */}
          <div className="text-center mt-12">
            <a
              href="/our-work"
              className="btn btn-outline border-background/30 text-background hover:bg-background hover:text-foreground hover:border-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              View All Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
