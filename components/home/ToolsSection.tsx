export default function ToolsSection() {
  return (
    <section id="tools" className="section alt">
      <div className="container">
        <h2 className="center hemp-underline-aurora">Navigation tools</h2>
        <p className="muted center" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Your spaceship runs on three instruments — energy, identity, and modules. Together they turn the map into motion.
        </p>

        <div className="cards">
          {/* NADA */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>NADA</h3>
            <p>
              Universal energy earned by exploring, learning, and contributing. Use it to unlock experiences and power science modules.
            </p>
            <ul className="muted" style={{ marginTop: 10, paddingLeft: 18 }}>
              <li>Earn: discovery, quests, contributions</li>
              <li>Spend: collectibles, learning modules, eco-perks</li>
              <li>Signal: your resonance in the cosmos</li>
            </ul>
          </div>

          {/* Wallet */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Wallet</h3>
            <p>
              Your portable identity and proofs — entitlements, credits, contributions — carried across every galaxy.
            </p>
            <ul className="muted" style={{ marginTop: 10, paddingLeft: 18 }}>
              <li>Identity & credentials</li>
              <li>WETAS credits & carbon proofs</li>
              <li>NADA balance & history</li>
            </ul>
          </div>

          {/* Modules */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Modules</h3>
            <p>
              Swappable control panels per planet/system — bring the right instruments for the world you’re visiting.
            </p>
            <ul className="muted" style={{ marginTop: 10, paddingLeft: 18 }}>
              <li>Brand Manager (Market)</li>
              <li>Campaign Explorer (Fund)</li>
              <li>Farm API (Place)</li>
              <li>Research Console (Knowledge)</li>
            </ul>
          </div>
        </div>

        {/* Compact status strip — reads like a cockpit footer */}
        <div className="hemp-panel" style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          <div className="row" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="pill">Energy: NADA</span>
            <span className="pill">Identity: Wallet</span>
            <span className="pill">Instruments: Modules</span>
          </div>
        </div>
      </div>
    </section>
  );
}