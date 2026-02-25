import * as React from 'react';

type Props = {
  label: string;
  compact?: boolean;
  animate?: boolean;  // now means: animate only knots (not the whole ribbon)
  knots?: boolean;
  scanline?: boolean;
};

export default function NebulaDivider({
  label,
  compact = false,
  animate = true,
  knots = true,
  scanline = false,
}: Props) {
  const seed = hash32(label);
  const rnd = mulberry32(seed);

  const width = 1200;
  const height = compact ? 68 : 96;

  const palette = pickPalette(rnd());
  const gid = `nebula-grad-${seed.toString(36)}`;
  const gid2 = `nebula-grad2-${seed.toString(36)}`;
  const blurId = `nebula-blur-${seed}`;
  const scanId = `scanline-grad-${seed}`;

  const bow = lerp(0.18, 0.32, rnd());
  const wobble = lerp(8, 18, rnd());
  const yBase = height * lerp(0.42, 0.58, rnd());

  const kR = lerp(8, 12, rnd());
  const kGlow = lerp(16, 26, rnd());

  const segments = 6;
  const topPts: Array<[number, number]> = [];
  const botPts: Array<[number, number]> = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * width;
    const curve = Math.sin((t - 0.5) * Math.PI) * bow * height;
    const wob = Math.sin((t * 2 + rnd()) * Math.PI) * wobble;
    const thick = lerp(12, 22, (Math.sin(t * Math.PI * 2 + rnd()) + 1) / 2);
    const centerY = yBase + curve * (rnd() > 0.5 ? 1 : -1) + wob * 0.15;
    topPts.push([x, centerY - thick / 2]);
    botPts.push([x, centerY + thick / 2]);
  }

  const pathTop = toPath(topPts);
  const pathBot = toPath(botPts);

  // knot positions
  const k1x = width * lerp(0.12, 0.2, rnd());
  const k2x = width * lerp(0.8, 0.88, rnd());
  const k1y = yAtX(topPts, botPts, k1x);
  const k2y = yAtX(topPts, botPts, k2x);

  // tangent angles at knots (so we can animate along the ribbon)
  const k1ang = tangentAngleAtX(topPts, botPts, k1x);
  const k2ang = tangentAngleAtX(topPts, botPts, k2x);

  // motion prefs
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // small amplitude in px; pure CSS keyframes move along +x in knot-local space
  const amp = 6;

  return (
    <div className="nebula-wrap" role="separator" aria-label={label} data-label={label}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid slice"
        className="nebula-svg"
      >
        <defs>
          {/* main ribbon gradient */}
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={palette[0]} stopOpacity="0.65" />
            <stop offset="50%"  stopColor={palette[1]} stopOpacity="0.60" />
            <stop offset="100%" stopColor={palette[2]} stopOpacity="0.65" />
          </linearGradient>

          {/* inner glow sweep */}
          <linearGradient id={gid2} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>

          {/* scanline gradient (was missing before) */}
          <linearGradient id={scanId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          {/* soft blur for halos */}
          <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faint star dots */}
        <g opacity="0.18" aria-hidden>
          {Array.from({ length: 8 }).map((_, i) => {
            const tx = lerp(0.08, 0.92, (i + rnd()) / 8) * width;
            const ty = yAtX(topPts, botPts, tx) + lerp(-18, 18, rnd());
            const r = lerp(0.6, 1.4, rnd());
            return <circle key={i} cx={tx} cy={ty} r={r} fill="#fff" />;
          })}
        </g>

        {/* ribbon (fixed, no lateral drift) */}
        <path d={pathTop} fill="none" stroke={`url(#${gid})`} strokeWidth="18" strokeLinecap="round" opacity="0.55" />
        <path d={pathBot} fill="none" stroke={`url(#${gid})`} strokeWidth="18" strokeLinecap="round" opacity="0.55" />
        <path d={pathTop} fill="none" stroke={`url(#${gid2})`} strokeWidth="6"  strokeLinecap="round" opacity="0.30" />
        <path d={pathBot} fill="none" stroke={`url(#${gid2})`} strokeWidth="6"  strokeLinecap="round" opacity="0.30" />

        {/* optional scanline */}
        {scanline && (
          <rect x="0" y={yBase - 1} width={width} height="2" fill={`url(#${scanId})`} opacity="0.55" />
        )}

        {/* knots: subtle along-path oscillation */}
        {knots && (
          <g filter={`url(#${blurId})`} aria-hidden>
            {/* K1 */}
            <g
              transform={`translate(${k1x},${k1y}) rotate(${k1ang})`}
              className={animate && !reduceMotion ? 'knot-anim' : undefined}
              style={{ ['--amp' as any]: `${amp}px`, ['--phase' as any]: '0s' }}
            >
              <circle cx="0" cy="0" r={kGlow} fill={palette[0]} opacity="0.18" />
              <circle cx="0" cy="0" r={kR} fill={palette[0]} />
            </g>

            {/* K2 */}
            <g
              transform={`translate(${k2x},${k2y}) rotate(${k2ang})`}
              className={animate && !reduceMotion ? 'knot-anim' : undefined}
              style={{ ['--amp' as any]: `${amp}px`, ['--phase' as any]: '-.8s' }}
            >
              <circle cx="0" cy="0" r={kGlow} fill={palette[2]} opacity="0.18" />
              <circle cx="0" cy="0" r={kR} fill={palette[2]} />
            </g>
          </g>
        )}
      </svg>

      {/* Only the knots move (tiny along-tangent sway). The ribbon never shifts. */}
      <style jsx>{`
        .nebula-wrap { overflow: visible; } /* allow blur halos to bleed into adjacent sections */
        .knot-anim {
          transform-box: fill-box;
          transform-origin: center;
          animation: knot-sway 3.8s ease-in-out infinite;
          animation-delay: var(--phase, 0s);
        }
        @keyframes knot-sway {
          0%   { translate: 0 0; }
          50%  { translate: var(--amp, 6px) 0; }
          100% { translate: 0 0; }
        }
      `}</style>
    </div>
  );
}

/* ---------- helpers ---------- */

function toPath(points: Array<[number, number]>): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function yAtX(top: Array<[number, number]>, bot: Array<[number, number]>, x: number): number {
  const idx = bot.findIndex((p) => p[0] >= x);
  if (idx <= 0) return (top[0][1] + bot[0][1]) / 2;
  const i0 = idx - 1, i1 = idx;
  const t = (x - bot[i0][0]) / (bot[i1][0] - bot[i0][0]);
  const topY = top[i0][1] + (top[i1][1] - top[i0][1]) * t;
  const botY = bot[i0][1] + (bot[i1][1] - bot[i0][1]) * t;
  return (topY + botY) / 2;
}

function tangentAngleAtX(top: Array<[number, number]>, bot: Array<[number, number]>, x: number): number {
  // derivative from centerline via neighbors
  const idx = bot.findIndex((p) => p[0] >= x);
  const i0 = Math.max(0, idx - 1);
  const i1 = Math.min(bot.length - 1, idx);
  const x0 = bot[i0][0];
  const x1 = bot[i1][0];
  const y0 = (top[i0][1] + bot[i0][1]) / 2;
  const y1 = (top[i1][1] + bot[i1][1]) / 2;
  const ang = Math.atan2(y1 - y0, x1 - x0);
  return (ang * 180) / Math.PI;
}

function hash32(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function pickPalette(t: number): [string, string, string] {
  const palettes: Array<[string, string, string]> = [
    ['#34d399', '#60a5fa', '#f472b6'],
    ['#22d3ee', '#93c5fd', '#a78bfa'],
    ['#84cc16', '#38bdf8', '#fb7185'],
  ];
  const idx = Math.floor(t * palettes.length) % palettes.length;
  return palettes[idx];
}