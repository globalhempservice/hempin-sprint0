export default function ToolsSection() {
  return (
    <section id="tools" className="section alt">
      <div className="container">
        <h2 className="display-title center hemp-underline-aurora">Navigation tools</h2>
        <p className="muted center" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Your spaceship runs on three instruments — energy, identity, and modules. Together they turn the map into motion.
        </p>

        <div className="tools-grid">
          {/* NADA */}
          <article className="card tool">
            <h3 className="tool-title">NADA</h3>
            <p>Universal energy earned by exploring, learning, and contributing. Use it to unlock experiences and power science modules.</p>
            <div className="tool-meters">
              <div className="meter"><span style={{ width:'62%' }} /></div>
              <div className="meter"><span style={{ width:'38%' }} /></div>
              <div className="meter"><span style={{ width:'78%' }} /></div>
            </div>
            <ul className="muted bullets">
              <li>Earn: discovery, quests, contributions</li>
              <li>Spend: collectibles, learning modules, eco-perks</li>
              <li>Signal: your resonance in the cosmos</li>
            </ul>
          </article>

          {/* Wallet */}
          <article className="card tool">
            <h3 className="tool-title">Wallet</h3>
            <p>Your portable identity and proofs — entitlements, credits, contributions — carried across every galaxy.</p>
            <ul className="muted bullets">
              <li>Identity & credentials</li>
              <li>WETAS credits & carbon proofs</li>
              <li>NADA balance & history</li>
            </ul>
          </article>

          {/* Modules */}
          <article className="card tool">
            <h3 className="tool-title">Modules</h3>
            <p>Swappable control panels per planet/system — bring the right instruments for the world you’re visiting.</p>
            <ul className="muted bullets">
              <li>Brand Manager (Market)</li>
              <li>Campaign Explorer (Fund)</li>
              <li>Farm API (Place)</li>
              <li>Research Console (Knowledge)</li>
            </ul>
          </article>

          {/* WETAS */}
          <article className="card tool">
            <h3 className="tool-title">WETAS</h3>
            <p>A regenerative ledger that measures lifecycle impact, turns waste into credits, and assigns regenerative scores.</p>
            <ul className="muted bullets">
              <li>Measure • Score • Credit</li>
              <li>Water • Energy • CO₂</li>
              <li>Project-level & network-level views</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}