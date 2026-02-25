// components/home/ToolsSection.tsx
import * as React from 'react';

type Tile = 'nada' | 'wallet' | 'modules' | 'wetas';

export default function ToolsSection() {
  return (
    <section id="tools" className="section tools-section">
      <div className="container">
        <h2 className="center display-title hemp-underline-aurora">Navigation tools</h2>
        <p className="muted center" style={{ maxWidth: 720, margin: '8px auto 18px' }}>
          Your spaceship runs on multiple instruments &mdash; exploration, identity, energy and modules. Together they turn your map into motion.
        </p>

        <div className="tools-grid">
          <ToolTile kind="nada" />
          <ToolTile kind="wallet" />
          <ToolTile kind="modules" />
          <ToolTile kind="wetas" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Icons ------------------------- */

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M13 2L6 13h5l-1 9 7-11h-5l1-9z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="10" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconEarth() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".8" />
    </svg>
  );
}

/* ----------------------------- Tiles ----------------------------- */

function ToolTile({ kind }: { kind: Tile }) {
  return (
    <article className={`tool-tile ${kind}`}>
      <header className="tile-head">
        <h3>
          {kind === 'nada' && 'NADA'}
          {kind === 'wallet' && 'Wallet'}
          {kind === 'modules' && 'Mini-Apps'}
          {kind === 'wetas' && 'WETAS'}
        </h3>
        <p className="muted">
          {kind === 'nada' &&
            'Amazing rewards earned by exploring, learning, and contributing to the Hemp community.'}
          {kind === 'wallet' &&
            'Portable digital identity, safe credentials, universal payments, crypted privacy \u2014 all in your pocket.'}
          {kind === 'modules' &&
            '8 self-contained universes in one app \u2014 MAG, SWIPE, PLACES, SWAP, FORUM, TERPENE, GLOBE, SWAG.'}
          {kind === 'wetas' &&
            'Waste-to-Energy Tracking & Assessment: make impact visible and rewarding.'}
        </p>
      </header>

      <PhoneFrame>
        {kind === 'nada' && <TileNADA />}
        {kind === 'wallet' && <TileWallet />}
        {kind === 'modules' && <TileMiniApps />}
        {kind === 'wetas' && <TileWETAS />}
      </PhoneFrame>
    </article>
  );
}

/* ---------------------- Tiny "phone" UIs ---------------------- */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone phone--tile" role="img" aria-label="App preview">
      {children}
    </div>
  );
}

function TileNADA() {
  const gradId = React.useId();
  return (
    <>
      <div className="phone-head">
        <span className="pill">NADA</span>
        <span className="icon" aria-hidden><IconBolt /></span>
      </div>

      <div className="ring">
        <svg viewBox="0 0 120 120" aria-hidden style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`ringGradNADA-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#34d399" />
              <stop offset="55%"  stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="48" className="bg" fill="none" />
          <circle cx="60" cy="60" r="48" className="fg fg-nada" fill="none" stroke={`url(#ringGradNADA-${gradId})`} />
        </svg>
        <div className="ring-label">
          <div className="ring-title">Level 4 Explorer</div>
          <div className="ring-value muted">2,340 NADA</div>
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
        <span className="icon" aria-hidden><IconLock /></span>
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

function TileMiniApps() {
  const apps = ['MAG', 'SWIPE', 'PLACES', 'SWAP', 'FORUM', 'TERPENE', 'GLOBE', 'SWAG'];
  return (
    <>
      <div className="phone-head">
        <span className="pill">Mini-Apps</span>
        <span className="icon" aria-hidden><IconGrid /></span>
      </div>

      <div className="modules-grid">
        {apps.map((name) => (
          <button key={name} className="mod-card">{name}</button>
        ))}
      </div>

      <div className="muted tiny" style={{ marginTop: 8, textAlign: 'center' }}>
        8 self-contained universes in one app
      </div>
    </>
  );
}

function TileWETAS() {
  const gradId = React.useId();
  return (
    <>
      <div className="phone-head">
        <span className="pill">WETAS</span>
        <span className="icon" aria-hidden><IconEarth /></span>
      </div>

      <div className="ring">
        <svg viewBox="0 0 120 120" aria-hidden style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`ringGradWETAS-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#34d399" />
              <stop offset="55%"  stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="48" className="bg" fill="none" />
          <circle cx="60" cy="60" r="48" className="fg fg-wetas" fill="none" stroke={`url(#ringGradWETAS-${gradId})`} />
        </svg>
        <div className="ring-label">
          <div className="ring-title">Regenerative score</div>
          <div className="ring-value muted">74 / 100</div>
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
