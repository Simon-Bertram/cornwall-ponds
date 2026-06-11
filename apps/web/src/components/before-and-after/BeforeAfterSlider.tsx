import { useState } from "react";
import type { ImageWithAlt } from "../../lib/image.ts";

/** Intrinsic ratio hint for `<img>`; matches the 16/9 frame, not literal file pixels. */
const COMPARISON_IMG_WIDTH = 1920;
const COMPARISON_IMG_HEIGHT = 1080;

interface BeforeAfterSliderProps {
  beforeImage: ImageWithAlt;
  afterImage: ImageWithAlt;
  title: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
}: BeforeAfterSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl select-none"
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* ── BEFORE image (base layer, always full width) ── */}
      {beforeError ? (
        <div className="absolute inset-0 bg-linear-to-br from-foreground/90 to-foreground/70 flex items-center justify-center">
          <span className="text-background font-serif text-lg">Before</span>
        </div>
      ) : (
        <img
          src={beforeImage.src}
          alt={beforeImage.alt}
          width={COMPARISON_IMG_WIDTH}
          height={COMPARISON_IMG_HEIGHT}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setBeforeError(true)}
        />
      )}

      {/* ── AFTER image (clipped on top via clip-path) ── */}
      {afterError ? (
        <div
          className="absolute inset-0 bg-linear-to-br from-primary/80 to-accent/60 flex items-center justify-center"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
        >
          <span className="text-primary-foreground font-serif text-lg">After</span>
        </div>
      ) : (
        <img
          src={afterImage.src}
          alt={afterImage.alt}
          width={COMPARISON_IMG_WIDTH}
          height={COMPARISON_IMG_HEIGHT}
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
          onError={() => setAfterError(true)}
        />
      )}

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none z-10"
        style={{ left: `${sliderValue}%` }}
        aria-hidden="true"
      />

      {/* ── Drag handle ── */}
      <div
        className="absolute top-1/2 z-20 pointer-events-none -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary border-2 border-primary-foreground text-primary-foreground flex items-center justify-center shadow-xl"
        style={{ left: `${sliderValue}%` }}
        aria-hidden="true"
      >
        {/* ←→ arrows */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 9l-4 3 4 3M16 9l4 3-4 3"
          />
        </svg>
      </div>

      {/* ── Before / After corner labels ── */}
      <span
        className="absolute bottom-4 left-4 z-10 text-xs font-bold uppercase tracking-widest text-foreground bg-background/92 backdrop-blur-sm border border-foreground/10 px-2.5 py-1 rounded"
        aria-hidden="true"
      >
        Before
      </span>
      <span
        className="absolute bottom-4 right-4 z-10 text-xs font-bold uppercase tracking-widest text-foreground bg-background/92 backdrop-blur-sm border border-foreground/10 px-2.5 py-1 rounded"
        aria-hidden="true"
      >
        After
      </span>

      {/* ── Range input: invisible, covers whole area, captures drag ── */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onInput={(e) => {
          const nextValue = Number((e.target as HTMLInputElement).value);
          setSliderValue(nextValue);
        }}
        className="peer absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        aria-label={`Before/after comparison for ${title}. Slide left or right.`}
        aria-describedby="before-after-instructions"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-accent-foreground/80 ring-offset-2 ring-offset-foreground opacity-0 transition-opacity duration-150 peer-focus-visible:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
}
