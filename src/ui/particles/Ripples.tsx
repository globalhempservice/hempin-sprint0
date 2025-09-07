'use client';

type RipplesProps = {
  active: boolean;
};

/**
 * Ripples — concentric wave rings that animate while active.
 * - Pure CSS, mounted once and toggled via `active`.
 */
export default function Ripples({ active }: RipplesProps) {
  // Keep mounted (so no layout shift), but fade in/out with `active`
  return (
    <div
      aria-hidden
      className="
        pointer-events-none absolute inset-0 flex items-center justify-center
        transition-opacity duration-300
      "
      style={{ opacity: active ? 0.6 : 0 }}
    >
      <div className="relative h-[48vh] w-[48vh] min-h-[280px] min-w-[280px] max-h-[72vh] max-w-[72vh]">
        {/* 3 waves */}
        <span className="ripple" />
        <span className="ripple [animation-delay:180ms]" />
        <span className="ripple [animation-delay:360ms]" />
      </div>
    </div>
  );
}