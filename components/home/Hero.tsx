// components/home/Hero.tsx
export default function Hero() {
  return (
    <section className="hero" style={{ paddingTop: 96 }}>
      <div className="container center" style={{ position: 'relative' }}>
        {/* product name (exact casing) */}
        <p className="eyebrow" style={{ letterSpacing: '0.18em' }}>inOS</p>

        {/* headline */}
        <h1>An operating system for a living world</h1>

        {/* key sentence — no em-dash after "industry" */}
        <div
          className="hemp-panel"
          style={{
            margin: '14px auto 10px',
            maxWidth: 900,
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.10)',
          }}
        >
          <strong style={{ fontWeight: 600 }}>
            Hemp’in translates the hemp universe into practical tools for people and industry
          </strong>
        </div>

        {/* supporting line */}
        <p className="muted" style={{ maxWidth: 820, margin: '10px auto 0' }}>
          connecting science, markets, places, and culture through WORK and LIFE dimensions.
        </p>

        {/* Orion — subtle, colorful, in the background */}
        <div
          aria-hidden
          className="hero-constellation"
          style={{
            position: 'relative',
            height: 340,
            marginTop: 24,
            marginBottom: 14,
          }}
        >
          <svg
            viewBox="0 0 900 480"
            width="100%"
            height="100%"
            style={{
              opacity: 0.42,
              filter: 'blur(0.2px)',
            }}
          >
            <defs>
              {/* soft star glow */}
              <radialGradient id="starGlow" r="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="45%" stopColor="rgba(180,225,255,0.65)" />
                <stop offset="100%" stopColor="rgba(180,225,255,0)" />
              </radialGradient>
              {/* line gradient (emerald → cyan → magenta) */}
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(110,231,183,0.9)" />
                <stop offset="55%" stopColor="rgba(96,165,250,0.85)" />
                <stop offset="100%" stopColor="rgba(244,114,182,0.9)" />
              </linearGradient>
            </defs>

            {/* Orion (stylized) — kept roomy & centered */}
            <g stroke="url(#lineGrad)" strokeWidth="2" fill="none">
              {/* outer poly lines (belt + body + right arm) */}
              <polyline points="140,285 290,270 450,290 720,325" opacity="0.85" />
              <polyline points="290,270 360,430 530,470" opacity="0.6" />
              <polyline points="720,325 750,380" opacity="0.75" />
              <polyline points="140,285 220,450 530,470" opacity="0.5" />
            </g>

            {/* belt (three stars in the middle) */}
            <g>
              {[350, 390, 430].map((x, i) => (
                <circle key={i} cx={x} cy={365} r="10" fill="url(#starGlow)"/>
              ))}
            </g>

            {/* major stars / joints */}
            <g>
              {/* left shoulder, head-ish, right shoulder cluster */}
              <circle cx="140" cy="285" r="12" fill="url(#starGlow)"/>
              <circle cx="290" cy="270" r="12" fill="url(#starGlow)"/>
              <circle cx="450" cy="290" r="12" fill="url(#starGlow)"/>
              <circle cx="720" cy="325" r="12" fill="url(#starGlow)"/>
              <circle cx="750" cy="380" r="11" fill="url(#starGlow)"/>

              {/* body / legs */}
              <circle cx="220" cy="450" r="11" fill="url(#starGlow)"/>
              <circle cx="360" cy="430" r="11" fill="url(#starGlow)"/>
              <circle cx="530" cy="470" r="12" fill="url(#starGlow)"/>
            </g>
          </svg>

          {/* gentle color fog behind Orion */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              filter: 'blur(38px)',
              opacity: 0.22,
              mixBlendMode: 'screen',
              background:
                'radial-gradient(600px 260px at 18% 40%, rgba(110,231,183,.45), transparent 60%), radial-gradient(520px 240px at 82% 52%, rgba(244,114,182,.42), transparent 60%)',
            }}
          />
        </div>

        {/* single CTA */}
        <div className="cta-row" style={{ marginTop: 4 }}>
          <a href="#cta" className="btn primary">Join the launch list</a>
        </div>
      </div>

      {/* keep existing emerald-only hero glow, but very soft */}
      <div
        className="hero-glow"
        aria-hidden
        style={{ opacity: 0.35 }}
      />
    </section>
  );
}