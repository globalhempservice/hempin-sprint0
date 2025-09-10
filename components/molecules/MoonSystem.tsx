import { Node, Moon } from '@/lib/cosmos';

/**
 * Renders a local orbit around a planet and its moons.
 * This component recomputes the planet's (cx, cy) so it can be used alongside <Planet />
 * with the same inputs (node, orbit radius, local center).
 */
export default function MoonSystem({
  node,
  orbitRadius,
  center,
  spinSeconds = 28,       // how long the moon ring takes to make one revolution
  showLabels = true,
}: {
  node: Node;             // must include node.moons
  orbitRadius: number;    // the planet's distance from ring center (same as Planet's radius)
  center: number;         // the SVG center used for the ring group (0 inside translated rings)
  spinSeconds?: number;
  showLabels?: boolean;
}) {
  if (!node.moons || node.moons.length === 0) return null;

  // Recompute planet position (same math as Planet.tsx)
  const planetAngleDeg = node.angle ?? 0;
  const planetAngle = (planetAngleDeg * Math.PI) / 180;
  const planetCx = center + Math.cos(planetAngle) * orbitRadius;
  const planetCy = center + Math.sin(planetAngle) * orbitRadius;

  // Local moon ring radius (tight circle around the planet)
  const R = 46;

  return (
    <g transform={`translate(${planetCx},${planetCy})`} style={{ pointerEvents: 'none' }}>
      {/* local rotating group so moons orbit their parent */}
      <g style={{ animation: `moonSpin ${spinSeconds}s linear infinite` }}>
        {/* ring */}
        <circle
          r={R}
          fill="none"
          stroke="rgba(255,255,255,.18)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* moons */}
        {node.moons.map((m, i) => (
          <MoonDot key={m.id} moon={m} radius={R} showLabel={showLabels} index={i} />
        ))}
      </g>

      <style>{`
        @keyframes moonSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </g>
  );
}

function MoonDot({
  moon,
  radius,
  showLabel,
  index,
}: {
  moon: Moon;
  radius: number;
  showLabel: boolean;
  index: number;
}) {
  const a = ((moon.angle ?? 0) * Math.PI) / 180;

  // Vary moon size a bit (first bigger, others smaller)
  const sizes = [10, 8, 7];
  const r = sizes[index % sizes.length];

  const [fromHex, toHex] = resolveAccent(moon.accent);

  // moon position on its local ring
  const cx = Math.cos(a) * radius;
  const cy = Math.sin(a) * radius;

  const gradId = `moon-grad-${moon.id}`;

  return (
    <g transform={`translate(${cx},${cy})`} style={{ pointerEvents: 'auto' }}>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="55%" stopColor={fromHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={toHex}   stopOpacity="0.98" />
        </radialGradient>
      </defs>

      <circle r={r} fill={`url(#${gradId})`} stroke="rgba(255,255,255,.18)" strokeWidth="0.8" />
      <circle r={r * 0.38} cx={-r * 0.35} cy={-r * 0.35} fill="rgba(255,255,255,.5)" style={{ filter: 'blur(1px)' }} />

      {showLabel && (
        <text
          x="0"
          y={r + 12}
          textAnchor="middle"
          className="fill-white/80 text-[10px] select-none"
        >
          {moon.title}
        </text>
      )}
    </g>
  );
}

/* ───────── helpers: small token→hex map (same idea as Planet.tsx) ───────── */

function resolveAccent(accent?: string): [string, string] {
  const fallback: [string, string] = ['#7aa7ff', '#4fd1c5'];
  if (!accent) return fallback;

  const match = accent.match(/from-([a-z]+-\d+)\s+to-([a-z]+-\d+)/i);
  if (!match) return fallback;

  const [, fromToken, toToken] = match;
  const fromHex = tailwindHex(fromToken) ?? fallback[0];
  const toHex = tailwindHex(toToken) ?? fallback[1];
  return [fromHex, toHex];
}

function tailwindHex(token: string): string | undefined {
  const map: Record<string, string> = {
    'pink-400': '#f472b6',
    'rose-400': '#fb7185',
    'amber-300': '#fcd34d',
    'yellow-400': '#facc15',
    'zinc-200':  '#e4e4e7',
    'slate-200': '#e2e8f0',
    'sky-400':   '#38bdf8',
    'cyan-300':  '#67e8f9',
    'indigo-400':'#818cf8',
    'violet-400':'#a78bfa',
    'emerald-400':'#34d399',
    'lime-400':  '#a3e635',
    'teal-400':  '#2dd4bf',
    'green-400': '#4ade80',
    'blue-400':  '#60a5fa',
    'white':     '#ffffff',
  };
  return map[token];
}