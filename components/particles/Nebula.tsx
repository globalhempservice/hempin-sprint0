// components/particles/Nebula.tsx
import React from 'react';

export default function Nebula({ size = 760 }: { size?: number }) {
  // Soft, center-anchored nebula that fades at the edges.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <div
        className="relative rounded-full blur-3xl opacity-55 mix-blend-screen"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* base radial glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(closest-side at 50% 54%, rgba(255,255,255,0.16) 0%, rgba(170,150,255,0.14) 35%, rgba(12,10,18,0) 70%)',
          }}
        />
        {/* subtle rainbow sweep */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-35 mix-blend-screen"
          style={{
            background:
              'conic-gradient(from 0deg, #ff9bd6, #ffd36f, #94ff9b, #86e7ff, #b09aff, #ff9bd6)',
            animation: 'nebHue 22s linear infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes nebHue { from { filter: hue-rotate(0deg) } to { filter: hue-rotate(360deg) } }
      `}</style>
    </div>
  );
}