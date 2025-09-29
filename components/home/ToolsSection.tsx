type Tile = 'nada' | 'wallet' | 'modules' | 'wetas';

export default function ToolsSection() {
  return (
    <section id="tools" className="section alt tools-section">
      <div className="container">
        <h2 className="center hemp-underline-aurora">Navigation tools</h2>
        <p className="muted center" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Your spaceship runs on three instruments — energy, identity, and modules. Together they turn the map into motion.
        </p>

        <div className="tools-grid">
          <ToolTile kind="nada" />
          <ToolTile kind="wallet" />
          <ToolTile kind="modules" />
          <ToolTile kind="wetas" />
        </div>

        {/* Cockpit footer strip */}
        <div className="hemp-panel tools-strip">
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

/* ---------------- Tiles ---------------- */

function ToolTile({ kind }: { kind: Tile }) {
  return (
    <article className={`tool-tile ${kind}`}>
      <header className="tile-head">
        <h3>
          {kind === 'nada' && 'NADA'}
          {kind === 'wallet' && 'Wallet'}
          {kind === 'modules' && 'Modules'}
          {kind === 'wetas' && 'WETAS'}
        </h3>
        <p className="muted">
          {kind === 'nada' &&
            'Universal energy earned by exploring, learning, and contributing.'}
          {kind === 'wallet' &&
            'Portable identity, credentials, payments, privacy — all in your pocket.'}
          {kind === 'modules' &&
            'Swappable control panels for each world — learn, build, grow.'}
          {kind === 'wetas' &&
            'Waste-to-Energy Tracking & Assessment: make impact visible and rewarding.'}
        </p>
      </header>

      <PhoneFrame>
        {kind === 'nada' && <TileNADA />}
        {kind === 'wallet' && <TileWallet />}
        {kind === 'modules' && <TileModules />}
        {kind === 'wetas' && <TileWETAS />}
      </PhoneFrame>
    </article>
  );
}

/* ------------- Tiny “phone” UIs ------------- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone phone--tile" role="img" aria-label="App preview">
      {children}
    </div>
  );
}

function TileNADA() {
  return (
    <>
      <div className="phone-head">
        <span className="pill">NADA</span>
        <span aria-hidden>⚡️</span>
      </div>

      <div className="ring">
        <svg viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r="48" className="bg" />
          <circle cx="60" cy="60" r="48" className="fg fg-nada" />
        </svg>
        <div className="ring-label">
          <strong>Level 4 Explorer</strong>
          <span className="muted">2,340 NADA</span>
        </div>
      </div>

      <div className="phone-row">
        <div className="stat"><div className="stat-top">Streak</div><div className="stat-num">7 days</div></div>
        <div className="stat"><div className="stat-top">Quests</div><div className="stat-num">3</div></div>
      </div>

      <div className="phone-list">
        <div className="item"><span className="badge blue" /> Quiz: Hemp basics <b>+25</b></div>
        <div className="item"><span className="badge green" /> Review a product <b>+10</b></div>
        <div className="item"><span className="badge purple" /> Share a discovery <b>+8</b></div>
      </div>
    </>
  );
}

function TileWallet() {
  return (
    <>
      <div className="phone-head">
        <span className="pill">Wallet</span>
        <span aria-hidden>🔐</span>
      </div>

      <div className="wallet-balance">
        <div>
          <div className="muted tiny">NADA</div>
          <div className="big">2,340</div>
        </div>
        <div>
          <div className="muted tiny">WETAS credits</div>
          <div className="big">128</div>
        </div>
      </div>

      <div className="wallet-rows">
        <div className="wallet-row">
          <span className="badge green" /> Credentials
          <b>6</b>
        </div>
        <div className="wallet-row">
          <span className="badge blue" /> Payment methods
          <b>3</b>
        </div>
        <div className="wallet-row">
          <span className="badge purple" /> Medical vault
          <button className="tiny-btn">Manage privacy</button>
        </div>
      </div>

      <div className="wallet-actions">
        <button className="mini-btn">Send</button>
        <button className="mini-btn">Receive</button>
        <button className="mini-btn">Crowdfund</button>
      </div>
    </>
  );
}

function TileModules() {
  return (
    <>
      <div className="phone-head">
        <span className="pill">Modules</span>
        <span aria-hidden>🧩</span>
      </div>

      <div className="modules-grid">
        <button className="mod-card">Hemp Quiz</button>
        <button className="mod-card">Brand Manager</button>
        <button className="mod-card">Farm Activity</button>
        <button className="mod-card">Research Console</button>
      </div>

      <div className="muted tiny" style={{ marginTop: 8, textAlign: 'center' }}>
        Plug in the instruments you need for each world.
      </div>
    </>
  );
}

function TileWETAS() {
  return (
    <>
      <div className="phone-head">
        <span className="pill">WETAS</span>
        <span aria-hidden>🌍</span>
      </div>

      <div className="ring">
        <svg viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r="48" className="bg" />
          <circle cx="60" cy="60" r="48" className="fg fg-wetas" />
        </svg>
        <div className="ring-label">
          <strong>Regenerative score</strong>
          <span className="muted">74 / 100</span>
        </div>
      </div>

      <div className="phone-list">
        <div className="item"><span className="badge green" /> Invested in farm co-op <b>+35</b></div>
        <div className="item"><span className="badge blue" /> Bought hemp goods <b>+12</b></div>
        <div className="item"><span className="badge purple" /> Recycled textile <b>+6</b></div>
      </div>

      <div className="wallet-actions">
        <button className="mini-btn">Measure</button>
        <button className="mini-btn">Score</button>
        <button className="mini-btn">Credit</button>
      </div>
    </>
  );
}