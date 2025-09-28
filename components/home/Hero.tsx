export default function Hero() {
  return (
    <section className="hero">
      <div className="container center">
        <p className="eyebrow">inOS</p>

        <h1>An operating system for a living world</h1>

        {/* subtle constellation backdrop */}
        <div className="hero-constellation" aria-hidden>
          <svg viewBox="0 0 800 220" fill="none">
            <g opacity="0.7" stroke="rgba(255,255,255,0.5)" strokeWidth="1">
              <circle cx="50"  cy="160" r="1.2" />
              <circle cx="140" cy="90"  r="1.2" />
              <circle cx="230" cy="130" r="1.2" />
              <circle cx="340" cy="70"  r="1.2" />
              <circle cx="470" cy="120" r="1.2" />
              <circle cx="590" cy="80"  r="1.2" />
              <circle cx="720" cy="150" r="1.2" />
              <polyline
                points="50,160 140,90 230,130 340,70 470,120 590,80 720,150"
                stroke="url(#grad)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <linearGradient id="grad" x1="50" y1="160" x2="720" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%"  stopColor="var(--accent)" />
                <stop offset="55%" stopColor="var(--accent-2)" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p className="lede">
          <span className="tagline-strong">
            Hempin translates the hemp universe into practical tools for people and industry
          </span>{" "}
          — connecting science, markets, places, and culture through WORK and LIFE dimensions.
        </p>

        <div className="cta-row">
          <a href="#cta" className="btn primary thruster">Join the launch list</a>
          <a href="#roadmap" className="btn ghost">See the roadmap</a>
        </div>
      </div>

      {/* emerald glow (clipped by .hero overflow) */}
      <div className="hero-glow" aria-hidden />
    </section>
  );
}