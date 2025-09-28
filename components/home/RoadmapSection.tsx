export default function RoadmapSection() {
  return (
    <section id="roadmap" className="section">
      <div className="container center">
        <h2 className="hemp-underline-aurora">Road ahead</h2>

        {/* Cinematic crawl panel (static perspective; no motion for Phase 2) */}
        <div
          className="hemp-panel"
          style={{
            margin: '16px auto 0',
            maxWidth: 860,
            padding: '20px 20px 28px',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: '0 auto',
              perspective: '800px',
            }}
          >
            <div
              style={{
                transform: 'rotateX(10deg)',
                transformOrigin: 'center bottom',
                textAlign: 'center',
                letterSpacing: '.02em',
                lineHeight: 1.6,
              }}
            >
              <p className="muted" style={{ marginTop: 0 }}>
                A long time from the past to a nearer future, a new atlas emerges…
              </p>
              <ul className="muted" style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
                <li style={{ margin: '10px 0' }}>
                  <strong>Now</strong> — LIFE teaser &amp; Hemp’in Launch Fund.
                </li>
                <li style={{ margin: '10px 0' }}>
                  <strong>Next</strong> — MVPs for <em>Market</em>, <em>Fund</em>, and <em>Knowledge</em>.
                </li>
                <li style={{ margin: '10px 0' }}>
                  <strong>Then</strong> — WORK modules, <em>app.hempin.org</em>, LINE/WeChat bridges, farm sensors.
                </li>
                <li style={{ margin: '10px 0' }}>
                  <strong>Long-term</strong> — a living atlas &amp; engine for a regenerative bioeconomy.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Optional: quick call-to-action strip under the crawl */}
        <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          <a href="#cta" className="btn primary">Join the launch list</a>
          <a href="#tools" className="btn ghost">See the instruments</a>
        </div>
      </div>
    </section>
  );
}