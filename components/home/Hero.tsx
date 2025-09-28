export default function Hero() {
  return (
    <section className="hero">
      <div className="container center hero-stack">
        <p className="eyebrow">inOS</p>

        <h1>An operating system for a living world</h1>

        {/* Key line highlighted as a soft capsule */}
        <p className="hero-highlight">
          Hemp’in translates the hemp universe into practical tools for people and industry
        </p>

        <p className="lede">
          connecting science, markets, places, and culture through WORK and LIFE dimensions.
        </p>

        {/* Orion constellation (decorative) */}
        <div className="constellation orion" aria-hidden>
          <svg viewBox="0 0 800 420" role="img" focusable="false">
            <defs>
              <radialGradient id="star" r="60%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Lines (Orion simplified: shoulders, belt, feet, club) */}
            <g stroke="rgba(180,200,255,0.65)" strokeWidth="2" strokeLinecap="round">
              {/* Left shoulder (Betelgeuse) to right shoulder (Bellatrix) */}
              <line x1="220" y1="70" x2="400" y2="50" />
              {/* Right shoulder to club base */}
              <line x1="400" y1="50" x2="700" y2="90" />
              {/* Torso left shoulder to left foot (Saiph) */}
              <line x1="220" y1="70" x2="300" y2="270" />
              {/* Torso right shoulder to right foot (Rigel) */}
              <line x1="400" y1="50" x2="520" y2="350" />
              {/* Belt three stars */}
              <line x1="330" y1="205" x2="380" y2="195" />
              <line x1="380" y1="195" x2="430" y2="185" />
              {/* Hip to hip */}
              <line x1="300" y1="270" x2="520" y2="350" />
              {/* Short forearm to shield/club tip */}
              <line x1="700" y1="90" x2="740" y2="160" />
            </g>

            {/* Stars */}
            {[
              { x: 220, y: 70 },  // Betelgeuse (left shoulder)
              { x: 400, y: 50 },  // Bellatrix (right shoulder)
              { x: 300, y: 270 }, // Saiph (left foot)
              { x: 520, y: 350 }, // Rigel (right foot)
              { x: 330, y: 205 }, // Alnitak (belt 1)
              { x: 380, y: 195 }, // Alnilam (belt 2)
              { x: 430, y: 185 }, // Mintaka (belt 3)
              { x: 700, y: 90 },  // club base
              { x: 740, y: 160 }, // club tip
            ].map((s, i) => (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r="3.5" fill="white" />
                <circle cx={s.x} cy={s.y} r="14" fill="url(#star)" />
              </g>
            ))}
          </svg>
        </div>

        <div className="cta-row">
          <a href="#cta" className="btn primary">Join the launch list</a>
        </div>
      </div>

      {/* keep the subtle hero glow, clipped by .hero overflow */}
      <div className="hero-glow" aria-hidden />
    </section>
  );
}