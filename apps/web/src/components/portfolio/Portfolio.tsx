import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Project, ServiceType, Location } from "../../lib/projects";
import { serviceTypes, locations } from "../../lib/projects";
import { FilterChip } from "./FilterChip";
import { PortfolioCard } from "./PortfolioCard";

// #region agent log
fetch("http://localhost:7491/ingest/e8332152-a9b9-4809-aab8-43213961e9a7", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"X-Debug-Session-Id": "646293",
	},
	body: JSON.stringify({
		sessionId: "646293",
		runId: "pre-fix",
		hypothesisId: "H4",
		location: "Portfolio.tsx:post-imports",
		message: "Portfolio module evaluated after static imports",
		data: {},
		timestamp: Date.now(),
	}),
}).catch(() => {});
// #endregion

export interface PortfolioProps {
  projects: Project[];
  initialLocation?: Location | null;
}

export function Portfolio({ projects, initialLocation = null }: PortfolioProps) {
  const [activeService, setActiveService] = useState<ServiceType | "All">("All");
  const [activeLocation, setActiveLocation] = useState<Location | "All">(initialLocation || "All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = projects.filter((p) => {
    const matchService = activeService === "All" || p.serviceType === activeService;
    const matchLocation = activeLocation === "All" || p.location === activeLocation;
    return matchService && matchLocation;
  });

  const clearFilters = () => {
    setActiveService("All");
    setActiveLocation("All");
  };

  const hasFilters = activeService !== "All" || activeLocation !== "All";

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors btn btn-ghost btn-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-foreground/70 hover:text-foreground transition-colors btn btn-ghost btn-sm"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="rounded-xl border border-foreground/10 bg-card p-6 space-y-6 shadow-sm animate-in fade-in slide-in-from-top-2">
            {/* Service Type Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Service Type</h3>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={activeService === "All"} onClick={() => setActiveService("All")} />
                {serviceTypes
                  .filter((st) => projects.some((p) => p.serviceType === st))
                  .map((st) => (
                    <FilterChip
                      key={st}
                      label={st}
                      active={activeService === st}
                      onClick={() => setActiveService(st)}
                    />
                  ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Location</h3>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={activeLocation === "All"} onClick={() => setActiveLocation("All")} />
                {locations
                  .filter((loc) => projects.some((p) => p.location === loc))
                  .map((loc) => (
                    <FilterChip
                      key={loc}
                      label={loc}
                      active={activeLocation === loc}
                      onClick={() => setActiveLocation(loc)}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-foreground/70 mb-6">
        Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {hasFilters && " (filtered)"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/50 rounded-xl border border-foreground/5 mt-4">
          <p className="text-lg text-foreground/70 font-medium">No projects match your current filters.</p>
          <button type="button" onClick={clearFilters} className="mt-6 btn btn-primary btn-outline">
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
