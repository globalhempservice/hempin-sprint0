import { useState } from 'react';

type Mode = 'LIFE' | 'WORK';

export default function DimensionSection() {
  const [mode, setMode] = useState<Mode>('LIFE');

  return (
    <section id="dimensions" className="section dim-section">
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Two dimensions. One identity.</h2>
        <p className="lede">
          In Hemp’in, you can travel as a citizen of <strong>LIFE</strong> or as a builder in <strong>WORK</strong> —
          the same wallet and identity, just a different suit for the journey.
        </p>

        {/* simple toggle (no warp for now) */}
        <div className="dim-toggle" role="tablist" aria-label="Choose dimension">
          <button
            role="tab"
            aria-selected={mode === 'LIFE'}
            className={`dim-pill ${mode === 'LIFE' ? 'is-active' : ''}`}
            onClick={() => setMode('LIFE')}
          >LIFE</button>
          <button
            role="tab"
            aria-selected={mode === 'WORK'}
            className={`dim-pill ${mode === 'WORK' ? 'is-active' : ''}`}
            onClick={() => setMode('WORK')}
          >WORK</button>
          <span className={`dim-indicator ${mode.toLowerCase()}`} aria-hidden />
        </div>

        {/* outfit sentence BETWEEN switch and previews */}
        <p className="muted" style={{ margin: '8px 0 8px' }}>
          Switching dimensions is like changing your spaceship outfit — same vessel, new instruments.
        </p>

        {/* stage — simple crossfade */}
        <div className="dim-stage" aria-live="polite">
          <PanelLife active={mode === 'LIFE'} />
          <PanelWork active={mode === 'WORK'} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Mini “app” previews ---------------- */

function PanelLife({ active }: { active: boolean }) {
  return (
    <article className={`dim-panel ${active ? 'in' : 'out'}`} aria-hidden={!active} aria-label="Hemp’in Life">
      <Header title="Hemp’in Life" rightIcons={['📬', '⚙️']} />
      <div className="dim-grid">
        <aside className="pane">
          <h4>Universes</h4>
          <List items={[
            ['MK','Market','#facc15'],
            ['KL','Knowledge','#fb7185'],
            ['DY','Directory','#86efac'],
            ['PL','Place','#60a5fa'],
            ['FD','Fund','#c084fc'],
            ['EV','Event','#f472b6'],
          ]} plus />
        </aside>
        <main className="pane">
          <h4>Discover</h4>
          <Cards variant="life" labels={['Products','Campaigns','Learn','Play']} />
        </main>
      </div>
    </article>
  );
}

function PanelWork({ active }: { active: boolean }) {
  return (
    <article className={`dim-panel ${active ? 'in' : 'out'}`} aria-hidden={!active} aria-label="Hemp’in Work">
      <Header title="Hemp’in Work" rightIcons={['📊', '🔒']} />
      <div className="dim-grid">
        <aside className="pane">
          <h4>Operations</h4>
          <List items={[
            ['FM','Farms','#22c55e'],
            ['BR','Brands','#93c5fd'],
            ['SC','Supply','#fca5a5'],
            ['QA','Quality','#fcd34d'],
          ]} />
        </aside>
        <main className="pane">
          <h4>Dashboards</h4>
          <Charts />
        </main>
      </div>
    </article>
  );
}

/* small building blocks kept the same */
function Header({ title, rightIcons }: { title: string; rightIcons: string[] }) {
  return (
    <div className="ui-header">
      <div className="brand">{title}</div>
      <div className="actions">{rightIcons.map((i, idx) => <span key={idx} aria-hidden>{i}</span>)}</div>
    </div>
  );
}
function List({ items, plus }: { items: [string,string,string][]; plus?: boolean }) {
  return (
    <ul className="ui-list">
      {items.map(([abbr, name, color]) => (
        <li key={name}>
          <span className="badge" style={{ background: color }}>{abbr}</span>
          <span className="name">{name}</span>
          {plus && <span className="plus">+</span>}
        </li>
      ))}
    </ul>
  );
}
function Cards({ labels, variant }: { labels: string[]; variant: 'life'|'work' }) {
  return <div className={`ui-cards ${variant}`}>{labels.map(l => <div className="ui-card" key={l}>{l}</div>)}</div>;
}
function Charts() {
  return (
    <div className="ui-charts">
      <div className="bar"><span style={{width:'62%'}} /></div>
      <div className="bar"><span style={{width:'38%'}} /></div>
      <div className="bar"><span style={{width:'78%'}} /></div>
      <div className="grid">{Array.from({length:8}).map((_,i)=> <div className="cell" key={i} />)}</div>
    </div>
  );
}