import { useEffect, useRef, useState } from 'react';
import EmailCTA from '@/components/EmailCTA';

type Mode = 'LIFE' | 'WORK';

export default function DimensionSection() {
  const [mode, setMode] = useState<Mode>('LIFE');
  const [warping, setWarping] = useState(false);

  // start a warp and swap mode midway through the animation
  const triggerWarp = (next: Mode) => {
    if (warping || next === mode) return;
    setWarping(true);
    // swap halfway so the warp covers the change
    setTimeout(() => setMode(next), 320);
  };

  // stop warp overlay
  useEffect(() => {
    if (!warping) return;
    const t = setTimeout(() => setWarping(false), 900);
    return () => clearTimeout(t);
  }, [warping]);

  return (
    <section id="dimensions" className="section dim-section">
      <div className="container center">
        <h2 className="display-title hemp-underline-aurora">Two dimensions. One identity.</h2>
        <p className="lede">
          In Hemp’in, you can travel as a citizen of <strong>LIFE</strong> or as a builder in <strong>WORK</strong> —
          the same wallet and identity, just a different suit for the journey.
        </p>

        {/* Dramatic visor switch */}
        <div className="dim-toggle" role="tablist" aria-label="Choose dimension">
          <button
            role="tab"
            aria-selected={mode === 'LIFE'}
            className={`dim-tab ${mode === 'LIFE' ? 'is-active' : ''}`}
            onClick={() => triggerWarp('LIFE')}
            disabled={warping}
          >
            LIFE
          </button>

          <div
            className={`dim-switch ${mode.toLowerCase()} ${warping ? 'warping' : ''}`}
            aria-hidden
          >
            <span className="nub" />
            <span className="glow" />
          </div>

          <button
            role="tab"
            aria-selected={mode === 'WORK'}
            className={`dim-tab ${mode === 'WORK' ? 'is-active' : ''}`}
            onClick={() => triggerWarp('WORK')}
            disabled={warping}
          >
            WORK
          </button>
        </div>

        {/* Spaceship outfit line sits between the switch and the previews */}
        <p className="muted dim-quip">
          Switching dimensions is like changing your spaceship outfit — same vessel, new instruments.
        </p>

        {/* Warp overlay (cone + streaks) plays while swapping */}
        <div className={`warp-overlay ${warping ? 'on' : ''}`} aria-hidden>
          <div className="warp-cone" />
          <div className="warp-stars" />
        </div>

        {/* Preview stage */}
        <div className="dim-stage" aria-live="polite">
          <PanelLife  active={mode === 'LIFE'} />
          <PanelWork  active={mode === 'WORK'} />
        </div>

        {/* CTA */}
       
<div className="cta-row" style={{ marginTop: 20 }}>
  <div className="muted" style={{ marginBottom: 10 }}>
    Be the first to know about the Hemp’in mobile app release.
  </div>
  <EmailCTA role={mode.toLowerCase()} />
</div>

      </div>
    </section>
  );
}

/* ---------------- Mini “app” previews (unchanged visuals) ---------------- */

function PanelLife({ active }: { active: boolean }) {
  return (
    <article className={`dim-panel life ${active ? 'in' : 'out'}`} aria-hidden={!active} aria-label="LIFE preview">
      <Header title="Hemp’in Playground" rightIcons={['📬', '⚙️']} />
      <div className="dim-grid">
        <aside className="pane">
          <h4>Universes</h4>
          <List
            items={[
              ['MK','Market','#facc15'],
              ['KL','Knowledge','#fb7185'],
              ['DY','Directory','#86efac'],
              ['PL','Place','#60a5fa'],
              ['FD','Fund','#c084fc'],
              ['EV','Event','#f472b6'],
            ]}
            plus
          />
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
    <article className={`dim-panel work ${active ? 'in' : 'out'}`} aria-hidden={!active} aria-label="WORK preview">
      <Header title="Hemp’in Console" rightIcons={['📊', '🔒']} />
      <div className="dim-grid">
        <aside className="pane">
          <h4>Operations</h4>
          <List
            items={[
              ['FM','Farms','#22c55e'],
              ['BR','Brands','#93c5fd'],
              ['SC','Supply','#fca5a5'],
              ['QA','Quality','#fcd34d'],
            ]}
          />
        </aside>
        <main className="pane">
          <h4>Dashboards</h4>
          <Charts />
        </main>
      </div>
    </article>
  );
}

/* ------------- tiny building blocks ------------- */
function Header({ title, rightIcons }: { title: string; rightIcons: string[] }) {
  return (
    <div className="ui-header">
      <div className="brand">{title}</div>
      <div className="actions">
        {rightIcons.map((i, idx) => <span key={idx} aria-hidden>{i}</span>)}
      </div>
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
  return (
    <div className={`ui-cards ${variant}`}>
      {labels.map(l => <div className="ui-card" key={l}>{l}</div>)}
    </div>
  );
}

function Charts() {
  return (
    <div className="ui-charts">
      <div className="bar"><span style={{width:'62%'}} /></div>
      <div className="bar"><span style={{width:'38%'}} /></div>
      <div className="bar"><span style={{width:'78%'}} /></div>
      <div className="grid">
        {Array.from({length:8}).map((_,i)=> <div className="cell" key={i} />)}
      </div>
    </div>
  );
}