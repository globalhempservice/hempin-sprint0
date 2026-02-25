// components/home/DatabaseSection.tsx
import NebulaDivider from '@/components/dividers/NebulaDivider';
import * as React from 'react';

const STAGES = ['Molecules', 'Materials', 'Components', 'Products', 'Brands', 'Markets'];

/* ---------- tiny inline icons ---------- */
function IconCO2() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" opacity=".9" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="700">CO₂</text>
    </svg>
  );
}
function IconWater() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0c0-4-6-11-6-11z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconEnergy() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
      <path d="M13 2L6 13h5l-1 9 7-11h-5l1-9z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconTrend({ dir = 'down' as 'down'|'up' }) {
  return dir === 'down' ? (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 10l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ) : (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/* ---------- metric pill (accessible) ---------- */
function MetricPill({
  kind, trend = 'down',
  label, aria,
}: { kind: 'co2'|'water'|'energy'; trend?: 'down'|'up'; label: string; aria: string }) {
  const Icon = kind === 'co2' ? IconCO2 : kind === 'water' ? IconWater : IconEnergy;
  const intent = trend === 'down' ? 'good' : 'bad';
  return (
    <span className={`metric-pill is-${intent}`} aria-label={aria}>
      <span aria-hidden><Icon /></span>
      <span className="txt">{label}</span>
      <span aria-hidden><IconTrend dir={trend} /></span>
    </span>
  );
}

/* ---------- per-step glass glyphs (collision-proof ids) ---------- */
function LifecycleGlyph({ kind }: { kind: 'seed'|'grow'|'harvest'|'process'|'make'|'share' }) {
  const uid = React.useId();
  const gid = `grad-${kind}-${uid}`;
  const [c1, c2] =
    kind === 'seed'    ? ['#34d399', '#a3e635'] :      // emerald → lime
    kind === 'grow'    ? ['#34d399', '#22d3ee'] :      // emerald → aqua
    kind === 'harvest' ? ['#f59e0b', '#fbbf24'] :      // gold → amber
    kind === 'process' ? ['#60a5fa', '#a78bfa'] :      // sky → violet
    kind === 'make'    ? ['#22d3ee', '#f472b6'] :      // cyan → magenta
                         ['#f472b6', '#60a5fa'];       // pink → sky

  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="glyph-svg" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>

      <rect x="1" y="1" width="42" height="42" rx="10"
        fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.10)" />

      {kind === 'seed' && (
        <>
          <path d="M22 28c4 0 7-3 7-7 0-5-5-8-7-8-3 0-7 3-7 8 0 4 3 7 7 7z" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M22 13c0 5-2 9-6 11" fill="none" stroke={`url(#${gid})`} strokeWidth="2" opacity=".7" />
        </>
      )}
      {kind === 'grow' && (
        <>
          <path d="M22 31c0-7 4-12 10-12-2 6-6 8-10 8" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M22 31c0-7-4-12-10-12 2 6 6 8 10 8" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M22 31v-8" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
        </>
      )}
      {kind === 'harvest' && (
        <>
          <path d="M28 16c0 6-4 12-12 12" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <circle cx="28" cy="16" r="4" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M14 28l-2 4" stroke={`url(#${gid})`} strokeWidth="2" />
        </>
      )}
      {kind === 'process' && (
        <>
          <circle cx="22" cy="22" r="7" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M22 13v4M22 27v4M13 22h4M27 22h4" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M17 17l3 3M24 24l3 3M27 17l-3 3M20 24l-3 3" stroke={`url(#${gid})`} strokeWidth="2" />
        </>
      )}
      {kind === 'make' && (
        <>
          <path d="M15 18l7-4 7 4-7 4-7-4z" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M15 18v8l7 4 7-4v-8" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M22 22v8" stroke={`url(#${gid})`} strokeWidth="2" />
        </>
      )}
      {kind === 'share' && (
        <>
          <circle cx="15" cy="22" r="3" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <circle cx="29" cy="16" r="3" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <circle cx="29" cy="28" r="3" fill="none" stroke={`url(#${gid})`} strokeWidth="2" />
          <path d="M18 21l8-4M18 23l8 4" stroke={`url(#${gid})`} strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

/* ---------- small utils ---------- */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

export default function DatabaseSection() {
  // detect Reduced Motion safely
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(!!mq?.matches);
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);

  // animate when visible
  const [railRef, inView] = useInView<HTMLDivElement>(0.25);
  const shouldAnimate = inView && !reduceMotion;

  const lifecycle: Array<{
    key: 'seed'|'grow'|'harvest'|'process'|'make'|'share';
    title: string;
    sub: string;
    metrics: Array<{ kind: 'co2'|'water'|'energy'; trend?: 'down'|'up'; label: string; aria: string }>;
  }> = [
    { key: 'seed',    title: 'Seed',    sub: 'Genetics, soil & weather',
      metrics: [
        { kind: 'co2',    trend: 'down', label: 'CO₂e',  aria: 'CO₂ reduced' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'down', label: 'Energy', aria: 'Energy reduced' },
      ]},
    { key: 'grow',    title: 'Grow',    sub: 'Field data & regen practices',
      metrics: [
        { kind: 'co2',    trend: 'down', label: 'CO₂e',  aria: 'CO₂ reduced' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'up',   label: 'Energy', aria: 'Energy increased' },
      ]},
    { key: 'harvest', title: 'Harvest', sub: 'Moisture, yield, quality',
      metrics: [
        { kind: 'co2',    trend: 'up',   label: 'CO₂e',  aria: 'CO₂ increased' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'up',   label: 'Energy', aria: 'Energy increased' },
      ]},
    { key: 'process', title: 'Process', sub: 'Fiber / hurd / extract',
      metrics: [
        { kind: 'co2',    trend: 'up',   label: 'CO₂e',  aria: 'CO₂ increased' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'up',   label: 'Energy', aria: 'Energy increased' },
      ]},
    { key: 'make',    title: 'Make',    sub: 'BOM & LCA evidence',
      metrics: [
        { kind: 'co2',    trend: 'up',   label: 'CO₂e',  aria: 'CO₂ increased' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'up',   label: 'Energy', aria: 'Energy increased' },
      ]},
    { key: 'share',   title: 'Share',   sub: 'Markets, reviews & reuse',
      metrics: [
        { kind: 'co2',    trend: 'down', label: 'CO₂e',  aria: 'CO₂ reduced' },
        { kind: 'water',  trend: 'down', label: 'Water', aria: 'Water reduced' },
        { kind: 'energy', trend: 'down', label: 'Energy', aria: 'Energy reduced' },
      ]},
  ];

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

        {/* One Graph — Nebula ribbon + marquee stages */}
        <div
          className="db-rail hemp-panel"
          aria-label="One graph pipeline"
          ref={railRef}
          data-animate={shouldAnimate ? 'on' : 'off'}
        >
          <div className="db-aurora">
            <NebulaDivider
              label="Molecules→Materials→Components→Products→Brands→Markets"
              compact
              animate={shouldAnimate}
            />
          </div>

          <div className="db-marquee" aria-hidden={false} data-animate={shouldAnimate ? 'on' : 'off'}>
            <div className="track">
              {[...STAGES, ...STAGES].map((label, i) => (
                <span className="db-chip" key={`${label}-${i}`}>{label}</span>
              ))}
            </div>
          </div>

          <ol className="db-stages">
            {STAGES.map((label) => (
              <li className="stage" key={label}>
                <span className="db-chip">{label}</span>
              </li>
            ))}
          </ol>

          <p className="muted center" style={{ marginTop: 10 }}>
            One graph. Many views. Everyone builds on the same verified layers.
          </p>
        </div>

        {/* Lifecycle storyboard */}
        <div className="db-grid">
          <article className="db-panel">
            <header className="db-head">
              <h3>From plant to people</h3>
              <p className="muted">
                Every step is modeled in the graph with linked evidence — agronomy, processing, manufacturing,
                logistics, and use.
              </p>
            </header>

            <ul className="db-cards">
              {lifecycle.map(({ key, title, sub, metrics }) => (
                <li className="db-card" key={key}>
                  <div className="glyph" aria-hidden>
                    <LifecycleGlyph kind={key} />
                  </div>

                  <div className="text">
                    <strong>{title}</strong>
                    <span className="muted">{sub}</span>
                  </div>

                  <div className="metrics" aria-label="Indicative metrics">
                    {metrics.map((m, i) => (
                      <MetricPill key={i} kind={m.kind} trend={m.trend} label={m.label} aria={m.aria} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}