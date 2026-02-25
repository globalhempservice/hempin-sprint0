// components/visuals/Orion.tsx
import * as React from 'react';

type StarProps = { x: number; y: number; r?: number; color?: string; glowColor?: string };

const Star = React.memo(function Star({
  x, y, r = 3,
  color = 'white',
  glowColor = 'rgba(96,165,250,0.55)',
}: StarProps) {
  return (
    <>
      <circle cx={x} cy={y} r={r * 3.2} fill="none"
        style={{ fill: glowColor.replace('0.55', '0.00') }}
        opacity="0.38"
      />
      {/* soft outer halo */}
      <circle cx={x} cy={y} r={r * 3.0}
        fill={glowColor.replace(',0.55)', ',0.12)').replace(',0.55,', ',0.12,')}
        opacity="0.5"
      />
      {/* mid glow */}
      <circle cx={x} cy={y} r={r * 1.6}
        fill={glowColor.replace(',0.55)', ',0.45)').replace(',0.55,', ',0.45,')}
      />
      {/* bright core */}
      <circle cx={x} cy={y} r={r} fill={color} opacity="0.95" />
    </>
  );
});

export default function Orion({ className = '' }: { className?: string }) {
  const uid = React.useId();
  const auroraId = `auroraStroke-${uid}`;
  const lineGlowId = `lineGlow-${uid}`;

  // Positions based on real Orion star coordinates, mapped to 200x160 viewBox.
  // x increases westward (standard sky-facing-south view), y increases downward.
  const stars = {
    // Shoulders
    Betelgeuse: { x: 58,  y: 32,  r: 4.2 },  // alpha Ori — top-left, red supergiant
    Bellatrix:  { x: 130, y: 26,  r: 3.0 },  // gamma Ori — top-right
    // Belt (left=east, slight upward tilt to the right)
    Alnitak:    { x: 68,  y: 82,  r: 2.6 },  // zeta Ori — belt left
    Alnilam:    { x: 96,  y: 78,  r: 3.0 },  // eps  Ori — belt center
    Mintaka:    { x: 122, y: 73,  r: 2.6 },  // del  Ori — belt right
    // Feet
    Saiph:      { x: 60,  y: 138, r: 2.8 },  // kappa Ori — lower-left
    Rigel:      { x: 138, y: 136, r: 4.6 },  // beta  Ori — lower-right, blue supergiant
    // Raised club (extension from Bellatrix arm)
    Club1:      { x: 160, y: 50,  r: 2.0 },
    Club2:      { x: 170, y: 72,  r: 2.0 },
  } as const;

  return (
    <div className={`hero-orion ${className}`} aria-hidden>
      <svg
        viewBox="0 0 200 160"
        className="hero-constellation"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={auroraId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(110,231,183,.9)" />
            <stop offset="55%"  stopColor="rgba(96,165,250,.9)" />
            <stop offset="100%" stopColor="rgba(244,114,182,.9)" />
          </linearGradient>

          <filter id={lineGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Body lines: left side (Betelgeuse → Alnitak → Saiph) */}
        <g fill="none" stroke={`url(#${auroraId})`} filter={`url(#${lineGlowId})`} opacity="0.80" strokeWidth="1.1">
          <line x1={stars.Betelgeuse.x} y1={stars.Betelgeuse.y} x2={stars.Alnitak.x}    y2={stars.Alnitak.y} />
          <line x1={stars.Alnitak.x}    y1={stars.Alnitak.y}    x2={stars.Saiph.x}      y2={stars.Saiph.y} />
          {/* Right side: Bellatrix → Mintaka → Rigel */}
          <line x1={stars.Bellatrix.x}  y1={stars.Bellatrix.y}  x2={stars.Mintaka.x}    y2={stars.Mintaka.y} />
          <line x1={stars.Mintaka.x}    y1={stars.Mintaka.y}    x2={stars.Rigel.x}      y2={stars.Rigel.y} />
          {/* Shoulder connector */}
          <line x1={stars.Betelgeuse.x} y1={stars.Betelgeuse.y} x2={stars.Bellatrix.x}  y2={stars.Bellatrix.y} />
          {/* Raised club from Bellatrix */}
          <polyline points={`${stars.Bellatrix.x},${stars.Bellatrix.y} ${stars.Club1.x},${stars.Club1.y} ${stars.Club2.x},${stars.Club2.y}`} />
        </g>

        {/* Belt — slightly brighter */}
        <polyline
          points={`${stars.Alnitak.x},${stars.Alnitak.y} ${stars.Alnilam.x},${stars.Alnilam.y} ${stars.Mintaka.x},${stars.Mintaka.y}`}
          fill="none"
          stroke={`url(#${auroraId})`}
          strokeWidth="1.5"
          filter={`url(#${lineGlowId})`}
          opacity="0.95"
        />

        {/* Stars */}
        {/* Betelgeuse — red supergiant, larger, warm tone */}
        <Star x={stars.Betelgeuse.x} y={stars.Betelgeuse.y} r={stars.Betelgeuse.r}
          color="#ffd0a0" glowColor="rgba(255,120,60,0.55)" />

        {/* Rigel — blue-white supergiant, larger, bright */}
        <Star x={stars.Rigel.x} y={stars.Rigel.y} r={stars.Rigel.r}
          color="#d0eeff" glowColor="rgba(120,180,255,0.60)" />

        {/* All other stars — standard white-blue */}
        <Star x={stars.Bellatrix.x} y={stars.Bellatrix.y} r={stars.Bellatrix.r} />
        <Star x={stars.Alnitak.x}   y={stars.Alnitak.y}   r={stars.Alnitak.r} />
        <Star x={stars.Alnilam.x}   y={stars.Alnilam.y}   r={stars.Alnilam.r} />
        <Star x={stars.Mintaka.x}   y={stars.Mintaka.y}   r={stars.Mintaka.r} />
        <Star x={stars.Saiph.x}     y={stars.Saiph.y}     r={stars.Saiph.r} />
        <Star x={stars.Club1.x}     y={stars.Club1.y}     r={stars.Club1.r} />
        <Star x={stars.Club2.x}     y={stars.Club2.y}     r={stars.Club2.r} />
      </svg>
    </div>
  );
}
