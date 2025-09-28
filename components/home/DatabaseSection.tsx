export default function DatabaseSection() {
  return (
    <section id="database" className="section">
      <div className="container center">
        <h2 className="hemp-underline-aurora">The database is our physics</h2>

        <p className="lede">
          A single source of truth keeps every galaxy in sync — from raw molecules to markets.
          Change something upstream and the ripple is visible everywhere.
        </p>

        {/* Visual pipeline */}
        <div className="hemp-panel" style={{ margin: '18px auto 0', maxWidth: 820 }}>
          <div className="pipeline" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <span>Molecules</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span>Materials</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span>Products</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span>Brands</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span>Markets</span>
          </div>
          <p className="muted" style={{ marginTop: 10 }}>
            One graph. Many views. Everyone builds on the same verified layers.
          </p>
        </div>

        {/* WETAS callout */}
        <div className="hemp-panel" style={{ margin: '14px auto 0', maxWidth: 820, textAlign: 'left' }}>
          <h3 style={{ marginTop: 0, marginBottom: 6 }}>WETAS — the ecological law</h3>
          <p className="muted" style={{ marginTop: 0 }}>
            <strong>Waste-to-Energy Tracking &amp; Assessment System:</strong> a regenerative ledger woven into the data.
            It measures lifecycle impact, turns waste into credits, and assigns regenerative scores across farms, brands,
            products, and events.
          </p>
          <div className="pipeline" style={{ marginTop: 10 }}>
            <span>Measure</span>
            <span>Score</span>
            <span>Credit</span>
          </div>
        </div>
      </div>
    </section>
  );
}