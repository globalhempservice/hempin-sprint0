'use client';

type LeafXPProps = {
  /** 0..100 — how “grown” the leaf is */
  level?: number;
  className?: string;
};

export default function LeafXP({ level = 0, className = '' }: LeafXPProps) {
  const clamped = Math.max(0, Math.min(100, level));
  // brightness 0.35..1.15, hue shift slightly as it grows
  const bright = 0.35 + (clamped / 100) * 0.8;
  const hue = 140 + (clamped / 100) * 20; // 140→160

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        className="drop-shadow-[0_0_8px_rgba(120,255,180,.25)]"
        style={{ filter: `brightness(${bright})` }}
        aria-hidden
      >
        {/* glow */}
        <defs>
          <radialGradient id="leafGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`hsl(${hue} 90% 65% / .80)`} />
            <stop offset="100%" stopColor={`hsl(${hue} 90% 65% / 0)`} />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="url(#leafGlow)" />
        {/* leaf body */}
        <path
          d="M48 14c-6 2-14 6-20 12s-10 14-12 20c6-2 14-6 20-12S46 20 48 14Z"
          fill={`hsl(${hue} 70% 50%)`}
          fillOpacity={0.85}
        />
        {/* vein */}
        <path
          d="M18 46c8-8 16-16 26-26"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xs text-zinc-300/80">{clamped}%</span>
    </div>
  );
}