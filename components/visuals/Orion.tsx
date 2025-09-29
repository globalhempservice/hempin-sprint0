import * as React from 'react';

type StarProps = { x: number; y: number; r?: number };

const Star = ({ x, y, r = 3 }: StarProps) => (
  <>
    <circle cx={x} cy={y} r={r * 3.2} fill="url(#starGlow)" opacity="0.35" />
    <circle cx={x} cy={y} r={r * 1.4} fill="url(#starCore)" />
    <circle cx={x} cy={y} r={r} fill="white" opacity="0.9" />
  </>
);

export default function HeroOrion({ className = '' }: { className?: string }) {
  // Orion points (200×160 viewBox)
  const stars = {
    Betelgeuse: { x: 40,  y: 25 },
    Bellatrix:  { x: 115, y: 20 },
    Saiph:      { x: 50,  y: 140 },
    Rigel:      { x: 130, y: 150 },
    Alnitak:    { x: 72,  y: 90 },
    Alnilam:    { x: 92,  y: 92 },
    Mintaka:    { x: 112, y: 88 },
    Club1:      { x: 155, y: 90 },
    Club2:      { x: 165, y: 115 },
  };

  return (
    <div className={`hero-orion ${className}`} aria-hidden>
      <svg viewBox="0 0 200 160" width="80%" height="auto" className="hero-constellation">
        <defs>
          <linearGradient id="auroraStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(110,231,183,.9)" />
            <stop offset="55%"  stopColor="rgba(96,165,250,.9)" />
            <stop offset="100%" stopColor="rgba(244,114,182,.9)" />
          </linearGradient>
          <radialGradient id="starGlow">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.85)" />
            <stop offset="35%" stopColor="rgba(96,165,250,0.55)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0.00)" />
          </radialGradient>
          <radialGradient id="starCore">
            <stop offset="0%"  stopColor="#E6FDF7" />
            <stop offset="100%" stopColor="#B7E9FF" />
          </radialGradient>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trapezium & limbs */}
        <polyline
          points={`${stars.Betelgeuse.x},${stars.Betelgeuse.y} ${stars.Alnilam.x},${stars.Alnilam.y} ${stars.Bellatrix.x},${stars.Bellatrix.y}`}
          fill="none" stroke="url(#auroraStroke)" strokeWidth="1.2" filter="url(#lineGlow)" opacity="0.85"
        />
        <polyline
          points={`${stars.Saiph.x},${stars.Saiph.y} ${stars.Betelgeuse.x},${stars.Betelgeuse.y} ${stars.Rigel.x},${stars.Rigel.y} ${stars.Saiph.x},${stars.Saiph.y}`}
          fill="none" stroke="url(#auroraStroke)" strokeWidth="1.2" filter="url(#lineGlow)" opacity="0.85"
        />
        {/* Shoulder to club */}
        <polyline
          points={`${stars.Bellatrix.x},${stars.Bellatrix.y} ${stars.Club1.x},${stars.Club1.y} ${stars.Club2.x},${stars.Club2.y}`}
          fill="none" stroke="url(#auroraStroke)" strokeWidth="1.2" filter="url(#lineGlow)" opacity="0.85"
        />
        {/* Belt */}
        <polyline
          points={`${stars.Alnitak.x},${stars.Alnitak.y} ${stars.Alnilam.x},${stars.Alnilam.y} ${stars.Mintaka.x},${stars.Mintaka.y}`}
          fill="none" stroke="url(#auroraStroke)" strokeWidth="1.4" filter="url(#lineGlow)" opacity="0.95"
        />

        {/* Stars */}
        <Star {...stars.Betelgeuse} r={3.2} />
        <Star {...stars.Bellatrix}  r={2.8} />
        <Star {...stars.Saiph}      r={2.6} />
        <Star {...stars.Rigel}      r={3.4} />
        <Star {...stars.Alnitak}    r={2.4} />
        <Star {...stars.Alnilam}    r={2.8} />
        <Star {...stars.Mintaka}    r={2.4} />
        <Star {...stars.Club1}      r={2.1} />
        <Star {...stars.Club2}      r={2.1} />
      </svg>
    </div>
  );
}