type DatabaseSectionProps = {
  /** Set false if you want to move WETAS to the next section entirely */
  showWetasTeaser?: boolean;
};

export default function DatabaseSection({ showWetasTeaser = true }: DatabaseSectionProps) {
  return (
    <section id="database" className="section db-section">
      <div className="container">
        <div className="center">
          <h2 className="display-title hemp-underline-aurora">The database is our physics</h2>

          <p className="lede">
            A single source of truth keeps every galaxy in sync — from raw molecules to markets.
            Change something upstream and the ripple is visible everywhere.
          </p>
        </div>

        {/* One Graph — Molecules to Markets */}
        <div className="db-rail hemp-panel" aria-label="One graph pipeline">
          <ol className="db-nodes" role="list">
            {['Molecules', 'Materials', 'Components', 'Products', 'Brands', 'Markets'].map((label) => (
              <li className="db-node" key={label}>
                <span className="dot" aria-hidden />
                <span className="label">{label}</span>
              </li>
            ))}
          </ol>
          <p className="muted center" style={{ marginTop: 10 }}>
            One graph. Many views. Everyone builds on the same verified layers.
          </p>
        </div>

        {/* Two-column: Lifecycle + (optional) WETAS teaser */}
        <div className="db-grid">
          {/* Lifecycle storyboard */}
          <article className="db-panel">
            <header className="db-head">
              <h3>From plant to people</h3>
              <p className="muted">
                Every step is modeled in the graph with linked evidence — agronomy, processing, manufacturing,
                logistics, and use.
              </p>
            </header>

            <ul className="db-cards" role="list">
              {[
                ['Seed', 'Genetics, soil &amp; weather'],
                ['Grow', 'Field data &amp; regen practices'],
                ['Harvest', 'Moisture, yield, quality'],
                ['Process', 'Fiber / hurd / extract'],
                ['Make', 'BOM &amp; LCA evidence'],
                ['Share', 'Markets, reviews &amp; reuse'],
              ].map(([t, s]) => (
                <li className="db-card" key={t}>
                  <div className="glyph" aria-hidden />
                  <div className="text">
                    <strong dangerouslySetInnerHTML={{ __html: t }} />
                    <span
                      className="muted"
                      dangerouslySetInnerHTML={{ __html: s }}
                    />
                  </div>
                  <div className="chips" aria-label="Indicative metrics">
                    <span className="chip">CO₂e ↓</span>
                    <span className="chip">Water ↓</span>
                    <span className="chip">Energy ↓</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* WETAS teaser (phone mock) */}
          {showWetasTeaser && (
            <aside className="db-phone" aria-label="WETAS preview">
              <div className="phone">
                <div className="phone-head">
                  <span className="pill">WETAS</span>
                  <span className="icons" aria-hidden>🌍🔐</span>
                </div>

                <div className="phone-ring">
                  <svg viewBox="0 0 120 120" aria-hidden>
                    <circle cx="60" cy="60" r="48" className="bg" />
                    <circle cx="60" cy="60" r="48" className="fg" />
                  </svg>
                  <div className="ring-label">
                    <strong>Regenerative score</strong>
                    <span className="muted">74 / 100</span>
                  </div>
                </div>

                <div className="phone-row">
                  <div className="stat">
                    <div className="stat-top">Credits</div>
                    <div className="stat-num">+128</div>
                  </div>
                  <div className="stat">
                    <div className="stat-top">Impact</div>
                    <div className="stat-num">CO₂e −1.9t</div>
                  </div>
                </div>

                <div className="phone-list">
                  <div className="item">
                    <span className="badge green" /> Invested in farm co-op
                    <b>+35</b>
                  </div>
                  <div className="item">
                    <span className="badge blue" /> Bought hemp goods
                    <b>+12</b>
                  </div>
                  <div className="item">
                    <span className="badge purple" /> Recycled textile
                    <b>+6</b>
                  </div>
                </div>

                <a href="#modules" className="phone-cta">Open WETAS →</a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}