// components/home/Hero.tsx
export default function Hero() {
  return (
    <section className="hero">
      <div className="container center" style={{ position: 'relative' }}>
        <p className="eyebrow">INOS</p>

        <h1>An operating system for a living world</h1>

        {/* Key one-liner, lightly highlighted (keeps your existing look) */}
        <p className="lede" style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '10px',
              background:
                'linear-gradient(180deg, rgba(110,231,183,.12), rgba(96,165,250,.10))',
              boxShadow: '0 0 0 1px rgba(255,255,255,.06) inset',
            }}
          >
            Hempin translates the hemp universe into practical tools for people and industry
          </span>{' '}
          — connecting science, markets, places, and culture through WORK and LIFE dimensions.
        </p>

        {/* Single focused CTA */}
        <div className="cta-row" style={{ marginTop: 24 }}>
          <a href="#cta" className="btn primary">
            Join the launch list
          </a>
        </div>

        {/* Decorative Orion constellation (subtle, non-interactive) */}
        <div aria-hidden className="constellation-orion"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '62px',
            width: 'min(520px, 80vw)',
            opacity: .35,
            filter: 'drop-shadow(0 0 12px rgba(96,165,250,.12))',
            pointerEvents: 'none'
          }}
        >
          <svg viewBox="0 0 520 160" width="100%" height="100%" role="presentation">
            {/* Lines (approx Orion: Betelgeuse–Bellatrix–Rigel–Saiph with the belt) */}
            <g stroke="rgba(148,163,184,0.45)" strokeWidth="1.2" fill="none">
              {/* Shoulders */}
              <path d="M90,40 L170,55" />
              {/* Left to belt center */}
              <path d="M90,40 L200,90" />
              {/* Right shoulder to belt center */}
              <path d="M170,55 L200,90" />
              {/* Belt (three stars) */}
              <path d="M180,84 L200,90 L220,96" />
              {/* Belt to Rigel (right foot) */}
              <path d="M200,90 L300,135" />
              {/* Belt to Saiph (left foot) */}
              <path d="M200,90 L130,130" />
            </g>

            {/* Stars */}
            <g>
              {/* Betelgeuse (left shoulder) */}
              <circle cx="90" cy="40" r="2.7" fill="rgba(244,114,182,.9)" />
              {/* Bellatrix (right shoulder) */}
              <circle cx="170" cy="55" r="2.6" fill="rgba(96,165,250,.9)" />
              {/* Belt: Alnitak, Alnilam, Mintaka */}
              <circle cx="180" cy="84" r="2.2" fill="rgba(110,231,183,.95)" />
              <circle cx="200" cy="90" r="2.6" fill="rgba(148,163,184,.95)" />
              <circle cx="220" cy="96" r="2.2" fill="rgba(110,231,183,.95)" />
              {/* Saiph (left foot) */}
              <circle cx="130" cy="130" r="2.5" fill="rgba(96,165,250,.9)" />
              {/* Rigel (right foot) */}
              <circle cx="300" cy="135" r="3.0" fill="rgba(110,231,183,.95)" />
            </g>
          </svg>
        </div>
      </div>

      <div className="hero-glow" aria-hidden />
    </section>
  );
}