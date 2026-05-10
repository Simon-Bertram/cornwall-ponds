interface BeforeAfterProjectNavProps {
  title: string;
  location: string;
  hasMultipleProjects: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function BeforeAfterProjectNav({
  title,
  location,
  hasMultipleProjects,
  onPrev,
  onNext,
}: BeforeAfterProjectNavProps) {
  return (
    <div className="flex items-center justify-between mt-6 gap-4">
      {/* Prev */}
      {hasMultipleProjects && (
        <button
          data-before-after-prev="true"
          onClick={onPrev}
          className="flex items-center gap-1.5 text-background/90 hover:text-background transition-colors duration-200 text-sm font-medium shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded-sm py-1"
          aria-label="Previous project transformation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Prev
        </button>
      )}

      {/* Title + location */}
      <div className="text-center flex-1 min-w-0 px-2">
        <p className="font-serif text-xl font-bold text-background truncate">
          {title}
        </p>
        <p className="text-background/85 text-sm mt-0.5">
          {location}, Cornwall
        </p>
      </div>

      {/* Next */}
      {hasMultipleProjects && (
        <button
          data-before-after-next="true"
          onClick={onNext}
          className="flex items-center gap-1.5 text-background/90 hover:text-background transition-colors duration-200 text-sm font-medium shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-foreground rounded-sm py-1"
          aria-label="Next project transformation"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
