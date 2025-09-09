import Head from 'next/head';
import { useState } from 'react';

type NodeDef = {
  id: string;
  title: string;
  kind: 'core' | 'tool' | 'universe' | 'field';
  gem: string;
  blurb: string;
  orbit?: 1 | 2 | 3;
  angle?: number;
  accent?: string;
};

const NODES: NodeDef[] = [
  { id: 'core', title: 'Account (You)', kind: 'core', gem: 'Diamond',
    blurb: 'Private dashboard + settings. Public profile is a layer above that you control.',
    accent: 'from-white/70 to-white/30' },
  { id: 'wallet', title: 'Wallet', kind: 'tool', gem: 'Gold',
    blurb: 'Your balance, receipts, and perks. Energy for the journey.', orbit: 1, angle: 20,
    accent: 'from-yellow-300/70 to-amber-400/40' },
  { id: 'architect', title: 'Architect', kind: 'tool', gem: 'Silver',
    blurb: 'Edit visibility, customize profile, link universes.', orbit: 1, angle: 160,
    accent: 'from-slate-200/70 to-zinc-300/40' },
  { id: 'comms', title: 'Comms', kind: 'tool', gem: 'Mercury',
    blurb: 'Messages & notifications across your hemp universes.', orbit: 1, angle: 280,
    accent: 'from-sky-200/70 to-cyan-200/40' },

  { id: 'fund', title: 'Fund', kind: 'universe', gem: 'Rose Quartz / Pink Sapphire',
    blurb: 'Crowdfunding & finance to fuel projects.', orbit: 2, angle: 15,
    accent: 'from-pink-400/70 to-fuchsia-400/40' },
  { id: 'market', title: 'Market', kind: 'universe', gem: 'Sapphire',
    blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.', orbit: 2, angle: 120,
    accent: 'from-blue-500/70 to-cyan-400/40' },
  { id: 'places', title: 'Places', kind: 'universe', gem: 'Jade',
    blurb: 'Farms, factories, stores — the physical network.', orbit: 2, angle: 220,
    accent: 'from-emerald-400/70 to-teal-400/40' },
  { id: 'orgs', title: 'Organizations', kind: 'universe', gem: 'Lapis / Turquoise',
    blurb: 'Brands, associations, labs, co-ops.', orbit: 2, angle: 300,
    accent: 'from-indigo-400/70 to-sky-400/40' },

  { id: 'events', title: 'Events', kind: 'field', gem: 'Amber / Citrine',
    blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.',
    orbit: 3, angle: 40, accent: 'from-amber-400/70 to-orange-500/40' },
  { id: 'research', title: 'Research', kind: 'field', gem: 'Emerald',
    blurb: 'Data & science flowing through all universes.', orbit: 3, angle: 160,
    accent: 'from-emerald-400/70 to-teal-400/40' },
  { id: 'governance', title: 'Governance (DAO)', kind: 'field', gem: 'Platinum / Diamond',
    blurb: 'Rules & coordination. A cosmic law that aligns everything.',
    orbit: 3, angle: 280, accent: 'from-zinc-200/70 to-white/30' },
];

const RADII = { 1: 120, 2: 200, 3: 280 };

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Hempin — The Universes Map</title>
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-zinc-200">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="
              h-[60vh] w-[60vh] md:h-[72vh] md:w-[72vh]
              rounded-full blur-3xl opacity-50
              bg-[radial-gradient(closest-side_at_58%_42%,rgba(255,180,220,.9)_0%,rgba(145,110,255,.6)_35%,rgba(10,8,20,0)_70%)]
              animate-[pulseOrb_12s_ease-in-out_infinite]
            "
          />
        </div>

        <header className="relative z-10 mx-auto max-w-4xl px-6 pt-10 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Hempin — The Universes Map</h1>
          <p className="mt-3 opacity-75">
            Hover planets to learn more. Your account is the nucleus. Tools orbit close. Universes live in the middle
            ring. Cross-cutting fields flow on the outer ring.
          </p>
        </header>

        <section className="relative z-10 mx-auto mt-12 grid place-items-center">
          <div className="relative h-[760px] w-[760px] max-w-[92vw] max-h-[92vh]">
            <OrbitRing radius={RADII[1]} speed="60s" />
            <OrbitRing radius={RADII[2]} speed="90s" />
            <OrbitRing radius={RADII[3]} speed="120s" dashed />

            {NODES.map((n) =>
              n.kind === 'core' ? (
                <CorePlanet key={n.id} node={n} setHovered={setHovered} />
              ) : (
                <OrbitingPlanet key={n.id} node={n} setHovered={setHovered} />
              )
            )}

            <Tooltip hoveredId={hovered} />
          </div>
        </section>

        <p className="relative z-10 mt-10 text-center text-xs opacity-50 pb-8">HEMPIN — experimental overview</p>

        <style>{`
          @keyframes slowSpin { 0% {transform: rotate(0deg)} 100% {transform: rotate(360deg)} }
          @keyframes pulseOrb { 0%,100% {transform: scale(1); filter: brightness(1)}
                                50% {transform: scale(1.03); filter: brightness(1.08)} }
          @media (prefers-reduced-motion: reduce) {
            .spin { animation: none !important; } .pulse { animation: none !important; }
          }
        `}</style>
      </main>
    </>
  );
}

function OrbitRing({ radius, speed, dashed = false }: { radius: number; speed: string; dashed?: boolean }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 spin" style={{ animation: `slowSpin ${speed} linear infinite` }} aria-hidden>
      <div className={`rounded-full border ${dashed ? 'border-white/15 border-dashed' : 'border-white/10'}`} style={{ width: radius * 2, height: radius * 2 }} />
    </div>
  );
}

function CorePlanet({ node, setHovered }: { node: NodeDef; setHovered: (id: string | null) => void }) {
  return (
    <button
      onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(node.id)} onBlur={() => setHovered(null)}
      className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center outline-none"
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative">
        <div className="absolute -inset-8 blur-2xl opacity-40 bg-gradient-to-br from-white/40 to-sky-200/30 rounded-full" />
        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-white/60 to-zinc-200/30 ring-1 ring-white/20 shadow-2xl transition group-hover:scale-[1.03]" />
      </div>
      <span className="mt-3 text-xs opacity-80">{node.title}</span>
    </button>
  );
}

function OrbitingPlanet({ node, setHovered }: { node: NodeDef; setHovered: (id: string | null) => void }) {
  if (!node.orbit) return null;
  const r = { 1: 120, 2: 200, 3: 280 }[node.orbit];
  const angle = node.angle ?? 0;

  return (
    <button
      onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(node.id)} onBlur={() => setHovered(null)}
      className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${r}px)` }}
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative grid place-items-center">
        <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full ring-1 ring-white/20 bg-gradient-to-br ${node.accent ?? 'from-slate-400/60 to-slate-500/30'} shadow-xl transition-transform group-hover:scale-110`} />
        <span className="mt-2 text-[11px] md:text-xs opacity-75">{node.title}</span>
      </div>
    </button>
  );
}

function Tooltip({ hoveredId }: { hoveredId: string | null }) {
  if (!hoveredId) return null;
  const node = NODES.find((n) => n.id === hoveredId);
  if (!node) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-[88%] -translate-x-1/2 w-[min(560px,92vw)]">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <div className="text-sm font-medium">
            {node.title}{' '}
            <span className="ml-2 text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-0.5">{node.gem}</span>
          </div>
          <p className="mt-1 text-xs opacity-80">{node.blurb}</p>
        </div>
      </div>
    </div>
  );
}