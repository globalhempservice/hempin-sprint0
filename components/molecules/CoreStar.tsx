// components/molecules/CoreStar.tsx
import { useId } from 'react';

export default function CoreStar({ cx, cy }: { cx: number; cy: number }) {
  const id = useId();
  const R = 58;

  return (
    <g transform={`translate(${cx},${cy})`}>
      <defs>
        {/* Stronger hemp-green aura */}
        <radialGradient id={`${id}-aura`} cx="50%" cy="45%" r="70%">
          <stop offset="0%"  stopColor="#FFFFFF" stopOpacity="0.40" />
          <stop offset="28%" stopColor="#9BD6C5" stopOpacity="0.55" /> {/* greener & stronger */}
          <stop offset="55%" stopColor="#6FC7B0" stopOpacity="0.35" /> {/* deeper green/teal */}
          <stop offset="85%" stopColor="#6E7572" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0B0B0D" stopOpacity="0" />
        </radialGradient>

        {/* Core sphere with a hint of cool green toward rim */}
        <radialGradient id={`${id}-core`} cx="40%" cy="38%" r="75%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="55%"  stopColor="#E6F2EE" stopOpacity="0.60" /> {/* faint greenish white */}
          <stop offset="100%" stopColor="#A2C5BA" stopOpacity="0.40" /> {/* cool green-grey */}
        </radialGradient>

        <filter id={`${id}-spec`} x={-R} y={-R} width={R * 2} height={R * 2} filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Big blur box to avoid square clipping */}
        <filter
          id={`${id}-auraBlur`}
          x={-R * 3}
          y={-R * 3}
          width={R * 6}
          height={R * 6}
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur stdDeviation={R * 0.9} />
        </filter>
      </defs>

      {/* Aura: stronger green + screen blend so it actually shows */}
      <circle
        r={R * 1.7}
        fill={`url(#${id}-aura)`}
        filter={`url(#${id}-auraBlur)`}
        opacity="0.95"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Core sphere (no hairline stroke) */}
      <circle r={R} fill={`url(#${id}-core)`} />

      {/* Subtle highlight */}
      <circle
        cx={-R * 0.28}
        cy={-R * 0.28}
        r={R * 0.24}
        fill="#FFFFFF"
        opacity="0.58"
        filter={`url(#${id}-spec)`}
      />
    </g>
  );
}