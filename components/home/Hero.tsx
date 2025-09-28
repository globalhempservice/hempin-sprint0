export default function Hero() {
  return (
    <section className="hero">
      <div className="container center">
        <p className="eyebrow">inOS</p>

        <h1>An operating system for a living world</h1>

        <p className="lede">
          connecting science, markets, places, and culture through WORK and LIFE dimensions.
        </p>

        {/* Key comprehension sentence highlighted, mobile-first */}
        <div className="hemp-panel" style={{ margin: '14px auto 0', maxWidth: 720 }}>
          <strong>Hemp’in translates the hemp universe into practical tools for people and industry.</strong>
        </div>

        <div className="cta-row">
          <a href="#cta" className="btn primary">Join the launch list</a>
          <a href="#roadmap" className="btn ghost">See the roadmap</a>
        </div>
      </div>

      <div className="hero-glow" aria-hidden />
    </section>
  );
}