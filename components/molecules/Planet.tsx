// components/molecules/Planet.tsx
import { Node } from '@/lib/cosmos';

/**
 * Props
 * - node:      data for the planet
 * - radius:    distance from the ring center
 * - center:    SVG center (cx==cy) — usually 0 when used inside a translated ring
 * - showLabel: toggle text
 * - spinSeconds: (optional) ring revolution time; when provided we counter-spin
 *                the label so it stays horizontal while the ring rotates.
 */
export default function Planet({
  node,
  radius,
  center,
  showLabel = true,
  spinSeconds,
}: {
  node: Node;
  radius: number;
  center: number;
  showLabel?: boolean;
  spinSeconds?: number;
}) {
  const angleDeg = node.angle ?? 0;
  const angle = (angleDeg * Math.PI) / 180;

  // absolute position from the provided center
  const cx = center + Math.cos(angle) * radius;
  const cy = center + Math.sin(angle) * radius;

  // build a unique gradient id per node
  const gradId = `planet-grad-${node.id}`;

  // Parse "from-*-*" / "to-*-*" tailwind tokens into hex colors we control in SVG.
  const [fromHex, toHex] = resolveAccent(node.accent);

  return (
    <g transform={`translate(${cx},${cy})`} style={{ pointerEvents: 'auto' }}>
      <defs>
        {/* soft colored body */}
        <radialGradient id={gradId} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%" stopColor={fromHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={toHex}   stopOpacity="0.98" />
        </radialGradient>
      </defs>

      {/* Planet sphere — bigger than before */}
      <circle r="15" fill={`url(#${gradId})`} stroke="rgba(255,255,255,.22)" strokeWidth="1.2" />
      {/* glossy highlight scaled up */}
      <circle r="6" cx="-5" cy="-5" fill="rgba(255,255,255,.45)" style={{ filter: 'blur(2px)' }} />

      {/* Label — counter-spin to stay horizontal */}
      {showLabel && (
        <g
          style={
            spinSeconds
              ? { animation: `counterSpin ${spinSeconds}s linear infinite` }
              : undefined
          }
        >
          <text
            x="0"
            y="26" // nudged further down since planets are larger
            textAnchor="middle"
            className="fill-white/85 text-[12px] select-none"
            transform={`rotate(${-angleDeg})`}
          >
            {node.title}
          </text>
        </g>
      )}

      <style>{`
        @keyframes counterSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </g>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────────────────── */

function resolveAccent(accent?: string): [string, string] {
  const fallback: [string, string] = ['#7aa7ff', '#4fd1c5']; // pleasant blue→teal
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
    'yellow-300': '#fde047',
    'amber-400': '#f59e0b',
    'zinc-200': '#e4e4e7',
    'slate-300': '#cbd5e1',
    'sky-200': '#bae6fd',
    'cyan-300': '#67e8f9',
    'pink-400': '#f472b6',
    'fuchsia-400': '#e879f9',
    'blue-500': '#3b82f6',
    'cyan-400': '#22d3ee',
    'emerald-400': '#34d399',
    'teal-400': '#2dd4bf',
    'indigo-400': '#818cf8',
    'sky-400': '#38bdf8',
    'orange-500': '#f97316',
    'white': '#ffffff',
  };
  return map[token];
}