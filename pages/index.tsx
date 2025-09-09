// pages/overview/index.tsx
import Head from 'next/head';
import { useMemo, useState } from 'react';

type NodeKind = 'core' | 'tool' | 'universe' | 'field';

type MoonDef = { id: string; title: string; accent: string; angle?: number };
type NodeDef = {
  id: string;
  title: string;
  kind: NodeKind;
  gem: string;
  blurb: string;
  orbit?: 1 | 2 | 3;
  angle?: number;
  accent?: string;
  moons?: MoonDef[];
};

/* ----------------------------- DATA (unchanged) ---------------------------- */

const NODES: NodeDef[] = [
  { id: 'core', title: 'Account (You)', kind: 'core', gem: 'Diamond',
    blurb: 'Private dashboard + settings. Public profile is a layer above that you control.',
  },

  // Orbit 1 (tools)
  { id: 'wallet',    title: 'Wallet',    kind: 'tool', gem: 'Gold',
    blurb: 'Your balance, receipts, and perks. Energy for the journey.',
    orbit: 1, angle: 25,  accent: 'from-yellow-300/80 to-amber-400/50' },
  { id: 'architect', title: 'Architect', kind: 'tool', gem: 'Silver',
    blurb: 'Edit visibility, customize profile, link universes.',
    orbit: 1, angle: 160, accent: 'from-slate-200/80 to-zinc-300/50' },
  { id: 'comms',     title: 'Comms',     kind: 'tool', gem: 'Mercury',
    blurb: 'Messages & notifications across your hemp universes.',
    orbit: 1, angle: 290, accent: 'from-sky-200/80 to-cyan-200/50' },

  // Orbit 2 (universes)
  { id: 'fund',   title: 'Fund',   kind: 'universe', gem: 'Rose Quartz / Pink Sapphire',
    blurb: 'Crowdfunding & finance to fuel projects.',
    orbit: 2, angle: 20,  accent: 'from-pink-400/80 to-fuchsia-400/50' },
  { id: 'market', title: 'Market', kind: 'universe', gem: 'Sapphire',
    blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.',
    orbit: 2, angle: 120, accent: 'from-blue-500/80 to-cyan-400/50',
    moons: [
      { id: 'trade', title: 'Trade (B2B)', accent: 'from-sky-400/80 to-cyan-300/60', angle: 35 },
      { id: 'shop',  title: 'Shop (B2C)',  accent: 'from-indigo-400/80 to-violet-400/60', angle: 215 },
    ]},
  { id: 'places', title: 'Places', kind: 'universe', gem: 'Jade',
    blurb: 'Farms, factories, stores — the physical network.',
    orbit: 2, angle: 225, accent: 'from-emerald-400/80 to-teal-400/50' },
  { id: 'orgs',   title: 'Organizations', kind: 'universe', gem: 'Lapis / Turquoise',
    blurb: 'Brands, associations, labs, co-ops.',
    orbit: 2, angle: 300, accent: 'from-indigo-400/80 to-sky-400/50' },

  // Orbit 3 (fields)
  { id: 'events', title: 'Events', kind: 'field', gem: 'Amber / Citrine',
    blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.',
    orbit: 3, angle: 50,  accent: 'from-amber-400/80 to-orange-500/50' },
  { id: 'research', title: 'Research', kind: 'field', gem: 'Emerald',
    blurb: 'Data & science flowing through all universes.',
    orbit: 3, angle: 165, accent: 'from-emerald-400/80 to-teal-400/50' },
  { id: 'governance', title: 'Governance (DAO)', kind: 'field', gem: 'Platinum / Diamond',
    blurb: 'Rules & coordination. A cosmic law that aligns everything.',
    orbit: 3, angle: 285, accent: 'from-zinc-200/80 to-white/50' },
];

/* ------------------------------- CONSTANTS -------------------------------- */

const SIZE = 880;             // SVG square in CSS px (will be clamped by vmin below)
const CORE = 120;             // core diameter
const PLANET = 22;            // planet diameter
const LABEL_GUTTER = 36;      // space for text so nothing clips
const STROKE = 1;             // orbit stroke

// radii computed to always fit within the square including labels:
const RADII = {
  3: (SIZE/2) - LABEL_GUTTER,
  2: (SIZE/2) - LABEL_GUTTER - 110,
  1: (SIZE/2) - LABEL_GUTTER - 190,
} as const;

const SPEEDS: Record<1|2|3,string> = { 1:'70s', 2:'105s', 3:'150s' };

/* ----------------------------- PAGE COMPONENT ----------------------------- */

export default function Overview() {
  const [hovered, setHovered] = useState<string|null>(null);

  const groups = useMemo(() => ({
    core: NODES.find(n=>n.kind==='core')!,
    r1: NODES.filter(n=>n.orbit===1),
    r2: NODES.filter(n=>n.orbit===2),
    r3: NODES.filter(n=>n.orbit===3),
    info: Object.fromEntries([
      ...NODES.map(n=>[n.id,{title:n.title,gem:n.gem,blurb:n.blurb}]),
      ['trade',{title:'Trade (B2B)',gem:'Sapphire',blurb:'Wholesale marketplace for operators.'}],
      ['shop',{title:'Shop (B2C)',gem:'Violet',blurb:'Consumer storefronts and drop-ins.'}],
    ] as const)
  }), []);

  const hue = useMemo(()=>Math.floor(Math.random()*360),[]);

  return (
    <>
      <Head><title>Hempin — The Universes Map</title></Head>

      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-zinc-200">
        {/* Centered nebula that fades at edges */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className="relative rounded-full mix-blend-screen"
            style={{
              width: 'min(92vmin, 900px)',
              height: 'min(92vmin, 900px)',
              filter: `hue-rotate(${hue}deg)`,
            }}
          >
            {/* soft radial base (bigger blur → feathered edge) */}
            <div
              className="absolute inset-0 rounded-full blur-[120px] opacity-60"
              style={{
                background:
                  'radial-gradient(closest-side at 50% 50%, rgba(255,255,255,.18) 0%, rgba(150,130,255,.14) 36%, rgba(12,10,20,0) 72%)',
              }}
            />
            {/* conic rainbow skin with slow hue spin */}
            <div
              className="absolute inset-0 rounded-full blur-[80px] opacity-35 animate-[nebHue_24s_linear_infinite]"
              style={{
                background:
                  'conic-gradient(from 0deg, #ff8ad7, #ffd36a, #8cff9a, #86e7ff, #a995ff, #ff8ad7)',
              }}
            />
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10 mx-auto max-w-4xl px-6 pt-10 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Hempin — The Universes Map
          </h1>
          <p className="mt-3 opacity-75">
            Hover planets to learn more. Your account is the nucleus. Tools orbit close.
            Universes live in the middle ring. Cross-cutting fields flow on the outer ring.
          </p>
        </header>

        {/* SVG cosmos — perfectly concentric and centered */}
        <section className="relative z-10 mx-auto mt-8 grid place-items-center">
          <div
            className="relative"
            style={{ width: 'min(92vmin, 900px)', height: 'min(92vmin, 900px)' }}
          >
            <svg
              width="100%" height="100%"
              viewBox={`${-SIZE/2} ${-SIZE/2} ${SIZE} ${SIZE}`}
              className="[transform-style:preserve-3d]"
            >
              {/* Outer ring group (spins) */}
              <g className="spin" style={{ animation: `spin360 ${SPEEDS[3]} linear infinite` }}>
                <circle cx="0" cy="0" r={RADII[3]} fill="none"
                        stroke="rgba(255,255,255,.15)" strokeWidth={STROKE}
                        strokeDasharray="3 6" />
                {groups.r3.map(p => <Planet key={p.id} node={p} r={RADII[3]} onHover={setHovered} />)}
              </g>

              {/* Middle ring */}
              <g className="spin" style={{ animation: `spin360 ${SPEEDS[2]} linear infinite` }}>
                <circle cx="0" cy="0" r={RADII[2]} fill="none"
                        stroke="rgba(255,255,255,.12)" strokeWidth={STROKE}
                        strokeDasharray="3 6" />
                {groups.r2.map(p => <Planet key={p.id} node={p} r={RADII[2]} onHover={setHovered} />)}
              </g>

              {/* Inner ring */}
              <g className="spin" style={{ animation: `spin360 ${SPEEDS[1]} linear infinite` }}>
                <circle cx="0" cy="0" r={RADII[1]} fill="none"
                        stroke="rgba(255,255,255,.10)" strokeWidth={STROKE} />
                {groups.r1.map(p => <Planet key={p.id} node={p} r={RADII[1]} onHover={setHovered} />)}
              </g>

              {/* Core (sun) — stays fixed */}
              <g>
                <defs>
                  <radialGradient id="coreGrad" cx="50%" cy="50%">
                    <stop offset="0%"  stopColor="rgba(255,255,255,.85)"/>
                    <stop offset="60%" stopColor="rgba(210,220,255,.28)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,.06)"/>
                  </radialGradient>
                </defs>
                <circle cx="0" cy="0" r={CORE/2} fill="url(#coreGrad)" stroke="rgba(255,255,255,.25)" />
                <circle cx="-22" cy="-22" r="18" fill="rgba(255,255,255,.55)" filter="url(#blur)" />
              </g>
            </svg>

            {/* Core label (HTML so it never rotates) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[calc(#{CORE/2}px+10px)] text-xs opacity-85">
              Account (You)
            </div>

            {/* Tooltip */}
            <Tooltip hoveredId={hovered} info={groups.info} />
          </div>
        </section>

        <p className="relative z-10 mt-8 text-center text-xs opacity-50 pb-8">
          HEMPIN — experimental overview
        </p>

        <style>{`
          @keyframes spin360 { from { transform: rotate(0) } to { transform: rotate(360deg) } }
          @keyframes nebHue { from { filter: hue-rotate(0deg) } to { filter: hue-rotate(360deg) } }
          .spin .label { animation: spin360 var(--speed) linear infinite reverse; }
          @media (prefers-reduced-motion: reduce) {
            .spin, .label { animation: none !important; }
          }
        `}</style>
      </main>
    </>
  );
}

/* ------------------------------- PLANET SVG ------------------------------- */

function Planet({
  node, r, onHover
}: { node: NodeDef; r: number; onHover: (id: string|null)=>void }) {

  // A planet is a rotated group: rotate(angle) translate(r,0)
  // Inside it, we draw the sphere and an HTML label that counter-spins.
  const angle = node.angle ?? 0;
  const speed = node.orbit ? ({1:'70s',2:'105s',3:'150s'} as const)[node.orbit] : '100s';

  return (
    <g transform={`rotate(${angle}) translate(${r},0)`}>
      {/* sphere */}
      <defs>
        <radialGradient id={`grad-${node.id}`} cx="35%" cy="35%">
          <stop offset="0%"  stopColor="rgba(255,255,255,.45)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,.2)"/>
        </radialGradient>
      </defs>
      <circle r={PLANET/2} fill={`url(#grad-${node.id})`} stroke="rgba(255,255,255,.25)" />

      {/* glossy highlight + color wash */}
      <circle r={PLANET/2} fill="none" stroke="rgba(255,255,255,.15)" />
      <foreignObject x={-PLANET/2} y={-PLANET/2} width={PLANET} height={PLANET}>
        <div
          className={`w-full h-full rounded-full bg-gradient-to-br ${node.accent}`}
          style={{ mixBlendMode:'screen', borderRadius:'9999px' }}
          onMouseEnter={()=>onHover(node.id)}
          onMouseLeave={()=>onHover(null)}
        />
      </foreignObject>

      {/* moons (if any) */}
      {node.moons?.length ? <Moons moons={node.moons} /> : null}

      {/* label (HTML, counter-spins so it stays horizontal) */}
      <foreignObject x={-80} y={PLANET/2 + 6} width={160} height={20}>
        <div
          className="label pointer-events-none text-center text-[11px] md:text-xs opacity-85"
          style={{ ['--speed' as any]: speed }}
        >
          {node.title}
        </div>
      </foreignObject>
    </g>
  );
}

/* --------------------------------- MOONS ---------------------------------- */

function Moons({ moons }: { moons: MoonDef[] }) {
  const R = 42;
  return (
    <g>
      <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={1} />
      {moons.map(m => (
        <g key={m.id} transform={`rotate(${m.angle ?? 0}) translate(${R},0)`}>
          <circle r={9} fill="rgba(0,0,0,.2)" />
          <foreignObject x={-9} y={-9} width={18} height={18}>
            <div className={`w-[18px] h-[18px] rounded-full ring-1 ring-white/20 bg-gradient-to-br ${m.accent}`} />
          </foreignObject>
        </g>
      ))}
    </g>
  );
}

/* -------------------------------- TOOLTIP --------------------------------- */

function Tooltip({
  hoveredId, info
}: { hoveredId: string|null; info: Record<string,{title:string;gem:string;blurb:string}> }) {
  if (!hoveredId) return null;
  const it = info[hoveredId];
  if (!it) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-[88%] -translate-x-1/2 w-[min(560px,92vw)]">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <div className="text-sm font-medium">
            {it.title}{' '}
            <span className="ml-2 text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
              {it.gem}
            </span>
          </div>
          <p className="mt-1 text-xs opacity-80">{it.blurb}</p>
        </div>
      </div>
    </div>
  );
}