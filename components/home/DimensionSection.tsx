'use client';
import { useEffect, useRef, useState } from 'react';

type App = 'mag' | 'places' | 'swap' | 'terpene';

const APPS: { id: App; label: string }[] = [
  { id: 'mag',     label: 'MAG'     },
  { id: 'places',  label: 'PLACES'  },
  { id: 'swap',    label: 'SWAP'    },
  { id: 'terpene', label: 'TERPENE' },
];

/* ---------- Tiny brand-styled icons (monotone) ---------- */
const ic = {
  cart:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M3 5h2l2.2 9H18l2-6H7" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>),
  book:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M5 4h10a3 3 0 013 3v13H8a3 3 0 00-3 3V4z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M5 7h13" stroke="currentColor" strokeWidth="2"/></svg>),
  list:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M8 6h12M8 12h12M8 18h12" stroke="currentColor" strokeWidth="2"/><circle cx="4" cy="6" r="1.2"/><circle cx="4" cy="12" r="1.2"/><circle cx="4" cy="18" r="1.2"/></svg>),
  pin:   (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M12 21s7-6.4 7-11a7 7 0 10-14 0c0 4.6 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="2.5"/></svg>),
  coin:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="7" ry="3.5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M5 8v8c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5V8" stroke="currentColor" strokeWidth="2" fill="none"/></svg>),
  leaf:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M20 4C12 4 6 7 4 13c2 1 6 1 9-2 1 5-3 8-7 9" fill="none" stroke="currentColor" strokeWidth="2"/></svg>),
  inbox: (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M4 6h16l-2 12H6L4 6z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8l-2 3h-4l-2-3z"/></svg>),
  cog:   (p:any)=>(<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 01-.2 1.6l2.1 1.6-2 3.4-2.5-1a7 7 0 01-2.3 1.3l-.3 2.7H10l-.3-2.7a7 7 0 01-2.3-1.3l-2.5 1-2-3.4 2.1-1.6A7 7 0 015 12c0-.6.1-1.1.2-1.6L3 8.8l2-3.4 2.5 1A7 7 0 0110 5.1L10.3 2h3.4l.3 3.1a7 7 0 012.3 1.3l2.5-1 2 3.4-2.1 1.6c.1.5.2 1 .2 1.6z"/></svg>),
  bell:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><path d="M6 10a6 6 0 1112 0v5l2 2H4l2-2v-5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="19" r="1.6"/></svg>),
  user:  (p:any)=>(<svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M4 20c0-4.2 3.6-6 8-6s8 1.8 8 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>),
  wallet:(p:any)=>(<svg {...p} viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M15 12h5" stroke="currentColor" strokeWidth="2"/></svg>),
  cal:   (p:any)=>(<svg {...p} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>),
};

/* ---------- Orb ---------- */
function Orb({ hue, icon }: { hue: number; icon: keyof typeof ic }) {
  const Icon = ic[icon];
  return (
    <span className="orb" style={{ ['--h' as any]: hue }}>
      <span className="orb-bg" />
      <Icon className="orb-ico" />
    </span>
  );
}

/* ---------- Phone shell ---------- */
function PhoneShell({
  title, right, children,
}: { title: string; right: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="phone-shell" role="img" aria-label="App preview">
      <div className="phone-head">
        <div className="brand">{title}</div>
        <div className="head-icons">{right}</div>
      </div>
      <div className="phone-body">{children}</div>
      <div className="phone-bottom">
        <button className="bb-item" aria-label="Profile"><ic.user /></button>
        <button className="bb-item" aria-label="Notifications"><ic.bell /></button>
        <button className="bb-item" aria-label="Wallet"><ic.wallet /></button>
      </div>
    </div>
  );
}

/* ================================================================ */

export default function DimensionSection() {
  const [app, setApp] = useState<App>('mag');
  const tabsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const order: App[] = ['mag', 'places', 'swap', 'terpene'];
    const onKey = (e: KeyboardEvent) => {
      const idx = order.indexOf(app);
      let next = app;
      if (e.key === 'ArrowRight') next = order[(idx + 1) % order.length];
      if (e.key === 'ArrowLeft')  next = order[(idx - 1 + order.length) % order.length];
      if (e.key === 'Home')       next = order[0];
      if (e.key === 'End')        next = order[order.length - 1];
      if (next !== app) {
        e.preventDefault();
        setApp(next);
        el.querySelector<HTMLButtonElement>(`#dim-tab-${next}`)?.focus();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [app]);

  return (
    <section id="dimensions" className="section dim-section" aria-labelledby="dimensions-title">
      <div className="container center">
        <h2 id="dimensions-title" className="display-title hemp-underline-aurora">
          DEWII &mdash; 8 universes, one app
        </h2>

        <p className="lede" style={{ maxWidth: 720, margin: '8px auto 6px' }}>
          Built on INOS, DEWII brings the hemp cosmos to your pocket. Explore, earn, trade, and connect &mdash; across 8 mini-apps designed for hemp professionals and enthusiasts.
        </p>

        <div ref={tabsRef} className="dim-toggle" role="tablist" aria-label="Choose mini-app">
          {APPS.map((a) => (
            <button
              key={a.id}
              id={`dim-tab-${a.id}`}
              role="tab"
              aria-selected={app === a.id}
              aria-controls={`dim-panel-${a.id}`}
              tabIndex={app === a.id ? 0 : -1}
              className={`dim-pill ${app === a.id ? 'is-active' : ''}`}
              onClick={() => setApp(a.id)}
              type="button"
            >
              {a.label}
            </button>
          ))}
          <span className={`dim-indicator x4 ${app}`} aria-hidden />
        </div>

        <div className="dim-stage">
          <PanelMAG     active={app === 'mag'}     id="dim-panel-mag"     labelledBy="dim-tab-mag"     />
          <PanelPLACES  active={app === 'places'}  id="dim-panel-places"  labelledBy="dim-tab-places"  />
          <PanelSWAP    active={app === 'swap'}    id="dim-panel-swap"    labelledBy="dim-tab-swap"    />
          <PanelTERPENE active={app === 'terpene'} id="dim-panel-terpene" labelledBy="dim-tab-terpene" />
        </div>

        <div className="mt-6">
          <a
            href="https://dewii.hempin.org"
            className="btn primary thruster"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try DEWII free
          </a>
        </div>
      </div>
    </section>
  );
}

/* ========================= MAG ========================= */

function PanelMAG({ active, id, labelledBy }: { active: boolean; id: string; labelledBy: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => { if (ref.current) (ref.current as any).inert = !active; }, [active]);
  return (
    <article ref={ref as any} id={id} role="tabpanel" aria-labelledby={labelledBy}
      className={`dim-panel mag ${active ? 'in' : 'out'}`} hidden={!active}>
      <PhoneShell title="HEMP MAG" right={<><ic.inbox /><ic.cog /></>}>
        <div className="rail">
          <button className="rail-item active" aria-label="Feed"><Orb hue={275} icon="book" /></button>
          <button className="rail-item" aria-label="Discover"><Orb hue={275} icon="list" /></button>
          <button className="rail-item" aria-label="Saved"><Orb hue={275} icon="bell" /></button>
          <button className="rail-item" aria-label="Earn"><Orb hue={275} icon="coin" /></button>
        </div>
        <div className="pane">
          <h4 className="panel-title">Latest Articles</h4>
          <div className="phone-list">
            <div className="item"><span className="badge purple" /> Hemp fiber breakthroughs in 2025 <span className="muted tiny">4 min</span></div>
            <div className="item"><span className="badge blue" /> WETAS certification guide <span className="muted tiny">6 min</span></div>
            <div className="item"><span className="badge green" /> EU hemp market update <span className="muted tiny">3 min</span></div>
          </div>
        </div>
      </PhoneShell>
    </article>
  );
}

/* ========================= PLACES ========================= */

function PanelPLACES({ active, id, labelledBy }: { active: boolean; id: string; labelledBy: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => { if (ref.current) (ref.current as any).inert = !active; }, [active]);
  return (
    <article ref={ref as any} id={id} role="tabpanel" aria-labelledby={labelledBy}
      className={`dim-panel places ${active ? 'in' : 'out'}`} hidden={!active}>
      <PhoneShell title="HEMP PLACES" right={<><ic.pin /><ic.list /></>}>
        <div className="rail">
          <button className="rail-item active" aria-label="Map"><Orb hue={160} icon="pin" /></button>
          <button className="rail-item" aria-label="Directory"><Orb hue={160} icon="list" /></button>
          <button className="rail-item" aria-label="Farms"><Orb hue={160} icon="leaf" /></button>
          <button className="rail-item" aria-label="People"><Orb hue={160} icon="user" /></button>
        </div>
        <div className="pane">
          <h4 className="panel-title">Nearby</h4>
          <div className="phone-list">
            <div className="item"><span className="badge green" /> GreenFarm Co-op <span className="muted tiny">1.2 km</span></div>
            <div className="item"><span className="badge blue" /> HempShop Lyon <span className="muted tiny">3.4 km</span></div>
            <div className="item"><span className="badge purple" /> Bio Textiles Lab <span className="muted tiny">8 km</span></div>
          </div>
        </div>
      </PhoneShell>
    </article>
  );
}

/* ========================= SWAP ========================= */

function PanelSWAP({ active, id, labelledBy }: { active: boolean; id: string; labelledBy: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => { if (ref.current) (ref.current as any).inert = !active; }, [active]);
  return (
    <article ref={ref as any} id={id} role="tabpanel" aria-labelledby={labelledBy}
      className={`dim-panel swap ${active ? 'in' : 'out'}`} hidden={!active}>
      <PhoneShell title="HEMP SWAP" right={<><ic.inbox /><ic.coin /></>}>
        <div className="rail">
          <button className="rail-item active" aria-label="Browse"><Orb hue={190} icon="cart" /></button>
          <button className="rail-item" aria-label="Offers"><Orb hue={190} icon="list" /></button>
          <button className="rail-item" aria-label="My Items"><Orb hue={190} icon="inbox" /></button>
          <button className="rail-item" aria-label="Earn"><Orb hue={190} icon="coin" /></button>
        </div>
        <div className="pane">
          <h4 className="panel-title">Swap Offers</h4>
          <div className="phone-list">
            <div className="item"><span className="badge blue" /> Hemp rope (5m) for linen cloth <span className="muted tiny">New</span></div>
            <div className="item"><span className="badge green" /> Seeds x100g for CBD balm <span className="muted tiny">2h</span></div>
            <div className="item"><span className="badge purple" /> Hurd bale for soil amendment <span className="muted tiny">5h</span></div>
          </div>
        </div>
      </PhoneShell>
    </article>
  );
}

/* ========================= TERPENE ========================= */

function PanelTERPENE({ active, id, labelledBy }: { active: boolean; id: string; labelledBy: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => { if (ref.current) (ref.current as any).inert = !active; }, [active]);
  return (
    <article ref={ref as any} id={id} role="tabpanel" aria-labelledby={labelledBy}
      className={`dim-panel terpene ${active ? 'in' : 'out'}`} hidden={!active}>
      <PhoneShell title="HEMP TERPENE" right={<><ic.list /><ic.bell /></>}>
        <div className="rail">
          <button className="rail-item active" aria-label="Collection"><Orb hue={30} icon="list" /></button>
          <button className="rail-item" aria-label="Hunt"><Orb hue={30} icon="pin" /></button>
          <button className="rail-item" aria-label="Earn"><Orb hue={30} icon="coin" /></button>
          <button className="rail-item" aria-label="Events"><Orb hue={30} icon="cal" /></button>
        </div>
        <div className="pane">
          <h4 className="panel-title">Collection</h4>
          <div className="phone-list">
            <div className="item"><span className="badge green" /> Myrcene <span className="muted tiny">Found x3</span></div>
            <div className="item"><span className="badge blue" /> Limonene <span className="muted tiny">Found x1</span></div>
            <div className="item"><span className="badge purple" /> Linalool <span className="muted tiny">Not found</span></div>
          </div>
          <div className="muted tiny" style={{ textAlign: 'center', marginTop: 6 }}>Scan QR codes to catch terpenes in the wild</div>
        </div>
      </PhoneShell>
    </article>
  );
}
