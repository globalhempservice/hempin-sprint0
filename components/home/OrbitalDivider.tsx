// components/home/OrbitalDivider.tsx
import React from 'react';

type OrbitalDividerProps = {
  /** Optional label centered under the arc */
  label?: string;
  /** Top/bottom spacing (px). Default 32 */
  marginY?: number;
};

export default function OrbitalDivider({ label, marginY = 32 }: OrbitalDividerProps) {
  const arcId = React.useId();
  const gradId = `${arcId}-grad`;

  return (
    <div
      className="orbit-wrap"
      role="separator"
      aria-orientation="horizontal"
      style={{ margin: `${marginY}px 0` }}
    >
      <svg className="orbit-svg" viewBox="0 0 800 120" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="var(--accent-2)" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id={`${arcId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* thin arc */}
        <path
          d="M 20 100 C 260 10, 540 10, 780 100"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          filter={`url(#${arcId}-glow)`}
          className="orbit-arc"
        />
      </svg>

      {label && <div className="orbit-label">{label}</div>}

      <style jsx>{`
        .orbit-wrap {
          display: grid;
          place-items: center;
          padding: 0 8px;
        }
        .orbit-svg {
          width: min(820px, 96vw);
          height: 120px;
          opacity: 0.9;
        }
        .orbit-label {
          margin-top: -8px;
          font-size: 0.85rem;
          color: var(--muted);
        }

        /* (Optional) super-subtle motion using stroke-dashoffset — disabled if reduced-motion */
        .orbit-arc {
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          animation: orbit-drift 16s linear infinite;
          opacity: 0.85;
        }
        @keyframes orbit-drift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -160; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-arc {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}