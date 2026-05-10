import { testimonials } from "../lib/projects.ts";
import type { Testimonial } from "../lib/projects.ts";
import { FullWidthDivider } from "./ui/full-width-divider.tsx";
import { QuoteIcon } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="relative mx-auto min-h-screen w-full max-w-4xl place-content-center border-x">
      <FullWidthDivider />
      <div className="mx-auto max-w-2xl px-6 pt-10 text-center md:pt-12">
        <p className="mb-3 text-primary text-sm font-semibold uppercase tracking-widest">
          Our Clients
        </p>
        <h2 className="a11y-testimonial-heading font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Testimonials
        </h2>
      </div>
      <div className="grid md:grid-cols-[2fr_1px_1fr]">
        <div className="divide-y">
          {testimonials.slice(0, 2).map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
        <div className="h-px bg-border md:h-auto" />
        <div className="flex items-center">
          <TestimonialCard testimonial={testimonials[2] as Testimonial} />
        </div>
      </div>
      <FullWidthDivider />
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, location, project } = testimonial;

  return (
    <figure className="p-6 md:p-8">
      <QuoteIcon
        aria-hidden="true"
        className="mb-4 size-12 stroke-1 text-muted-foreground"
      />

      <blockquote className="a11y-testimonial-body mb-6 font-normal text-base md:text-lg">
        &quot;{quote}&quot;
      </blockquote>

      <figcaption className="flex flex-col gap-0.5">
        <cite className="a11y-testimonial-cite font-medium text-lg not-italic">
          {name}
        </cite>
        <p className="text-muted-foreground text-sm">
          {location}
          {project && ` - ${project}`}
        </p>
      </figcaption>
    </figure>
  );
}
