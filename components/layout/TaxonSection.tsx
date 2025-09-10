// components/layout/TaxonSection.tsx
import React from 'react';

type TaxonColor = 'emerald' | 'pink' | 'sky' | 'zinc';

export default function TaxonSection({
  color,
  intensity = 0.12,
  spread = '62%',
  topDivider = false,
  bottomDivider = false,
  className,
  children,
}: {
  color: TaxonColor;
  intensity?: number;
  spread?: string;          // e.g. '60%' (radius of the fade)
  topDivider?: boolean;
  bottomDivider?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const rgba = {
    emerald: `rgba(52,211,153,${intensity})`,
    pink:    `rgba(236,72,153,${intensity})`,
    sky:     `rgba(56,189,248,${intensity})`,
    zinc:    `rgba(244,244,245,${intensity})`,
  }[color];

  return (
    <>
      {topDivider && <Divider color={color} />}

      {/* isolate => independent stacking context so the -z glow never falls “behind” other sections */}
      <section className={`relative isolate py-10 md:py-14 ${className ?? ''}`}>
        {/* Radial glow backdrop — slightly oversized so it’s visible around content */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-[10vw] -inset-y-[8vh] -z-10"
          style={{
            background: `radial-gradient(ellipse at center, ${rgba} 0%, rgba(0,0,0,0) ${spread})`,
          }}
        />
        {children}
      </section>

      {bottomDivider && <Divider color={color} />}
    </>
  );
}

/* Internal subtle gradient divider */
function Divider({ color }: { color: TaxonColor }) {
  const palette: Record<TaxonColor, string> = {
    emerald:
      'linear-gradient(to right, rgba(52,211,153,0), rgba(52,211,153,0.18), rgba(52,211,153,0))',
    pink:
      'linear-gradient(to right, rgba(236,72,153,0), rgba(236,72,153,0.18), rgba(236,72,153,0))',
    sky:
      'linear-gradient(to right, rgba(56,189,248,0), rgba(56,189,248,0.18), rgba(56,189,248,0))',
    zinc:
      'linear-gradient(to right, rgba(244,244,245,0), rgba(244,244,245,0.12), rgba(244,244,245,0))',
  };
  return (
    <div className="relative my-6 md:my-8">
      <div className="mx-auto h-px max-w-6xl opacity-60" style={{ background: palette[color] }} />
    </div>
  );
}