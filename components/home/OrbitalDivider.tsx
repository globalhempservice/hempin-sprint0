import * as React from 'react';

/**
 * OrbitalDivider
 * A seeded, lightweight SVG "flight path" between sections.
 *
 * Props:
 * - label: string (seed + optional caption for a11y)
 * - compact?: boolean  -> shorter arc (good for mobile dense sections)
 * - animate?: boolean  -> stroke dash drift (disabled by prefers-reduced-motion via CSS)
 */
type Props = {
  label: string;
  compact?: boolean;
  animate?: boolean;
};

export default function OrbitalDivider({ label, compact = false, animate = true }: Props) {
  // --- tiny seeded RNG (deterministic per label) ---
  const seed = hash32(label);
  const rnd = mulberry32(seed);

  // SVG viewport
  const width = 1200;
  const height = compact ? 90 : 120;

  // Endpoints (as % of width); small jitter per divider
  const x1 = lerp(0.14, 0.22, rnd());
  const x2 = lerp(0.78, 0.86, rnd());
  const yBase = 0.62; // normalized baseline (down from top)
  const y1 = height * (yBase + lerp(-0.02, 0.02, rnd()));
  const y2 = height * (yBase + lerp(-0.02, 0.02, rnd()));

  // Curvature: flip up/down per seed and vary magnitude
  const flip = rnd() > 0.5 ? 1 : -1;
  const curve = (compact ? lerp(20, 40, rnd()) : lerp(28, 56, rnd())) * flip;

  // Control point for quadratic curve
  const cx = ((x1 + x2) / 2) * width + lerp(-40, 40, rnd());
  const cy = (height * 0.35) + curve;

  const p1x = x1 * width;
  const p2x = x2 * width;

  const d = `M ${p1x.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(
    1
  )} ${p2x.toFixed(1)} ${y2.toFixed(1)}`;

  // Choose one of three soft aurora palettes
  const palette = pickPalette(rnd());
  const gid = `grad-${seed.toString(36)}`;

  // Optional dash pattern variation
  const dashA = Math.round(lerp(4, 10, rnd()));
  const dashB = Math.round(lerp(8, 18, rnd()));
  const strokeDasharray = `${dashA} ${dashB}`;

  // Planets (endpoints) sizes + subtle glow
  const planetR = 4 + Math.round(lerp(0, 2, rnd()));
  const planetGlow = 10 + Math.round(lerp(0, 6, rnd()));

  return (
    <div aria-label={label} role="separator" className="orbital-wrap" data-label={label}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid slice"
        className="orbital-svg"
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette[0]} stopOpacity="0.9" />
            <stop offset="50%" stopColor={palette[1]} stopOpacity="0.8" />
            <stop offset="100%" stopColor={palette[2]} stopOpacity="0.9" />
          </linearGradient>

          <filter id={`glow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={planetGlow} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* flight path */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
          className={`orbital-path${animate ? ' is-animated' : ''}`}
          style={{ strokeDasharray }}
        />

        {/* endpoint planets */}
        <g filter={`url(#glow-${gid})`}>
          <circle cx={p1x} cy={y1} r={planetR} fill={palette[0]} opacity="0.9" />
          <circle cx={p2x} cy={y2} r={planetR} fill={palette[2]} opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- helpers ---------- */

// fast deterministic hash
function hash32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// seeded PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pickPalette(t: number): [string, string, string] {
  const palettes: Array<[string, string, string]> = [
    // emerald → cyan → soft magenta
    ['#34d399', '#60a5fa', '#f472b6'],
    // teal → sky → violet
    ['#14b8a6', '#38bdf8', '#a78bfa'],
    // lime → aqua → rose
    ['#84cc16', '#22d3ee', '#fb7185'],
  ];
  const idx = Math.floor(t * palettes.length) % palettes.length;
  return palettes[idx];
}