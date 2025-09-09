// src/app/overview/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type Kind = 'core' | 'tool' | 'universe' | 'field';
type Node = {
  id: string;
  title: string;
  kind: Kind;
  gem: string;
  blurb: string;
  orbit?: 1 | 2 | 3;
  angle?: number;
  accent?: string;
};

/* ----------------------- Data ----------------------- */

const NODES: Node[] = [
  // core
  {
    id: 'core',
    title: 'Account (You)',
    kind: 'core',
    gem: 'Diamond',
    blurb:
      'Private dashboard + settings. Public profile is a layer above that you control.',
  },

  // orbit 1 — tools
  { id: 'wallet',     title: 'Wallet',     kind: 'tool',     gem: 'Gold',                blurb: 'Your balance, receipts, and perks.',                 orbit: 1, angle: 315, accent: 'from-yellow-300/80 to-amber-400/50' },
  { id: 'architect',  title: 'Architect',  kind: 'tool',     gem: 'Silver',              blurb: 'Edit visibility, customize profile, link universes.', orbit: 1, angle:  45, accent: 'from-zinc-200/80 to-slate-300/50'  },
  { id: 'comms',      title: 'Comms',      kind: 'tool',     gem: 'Mercury',             blurb: 'Messages & notifications across your hemp universes.', orbit: 1, angle: 190, accent: 'from-sky-200/80 to-cyan-200/50'  },

  // orbit 2 — universes
  { id: 'fund',       title: 'Fund',       kind: 'universe', gem: 'Rose Quartz / Pink Sapphire', blurb: 'Crowdfunding & finance to fuel projects.',         orbit: 2, angle: 335, accent: 'from-pink-400/80 to-fuchsia-400/50' },
  { id: 'market',     title: 'Market',     kind: 'universe', gem: 'Sapphire',            blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.',            orbit: 2, angle: 260, accent: 'from-blue-500/80 to-cyan-400/50' },
  { id: 'places',     title: 'Places',     kind: 'universe', gem: 'Jade',                blurb: 'Farms, factories, stores — the physical network.',   orbit: 2, angle:  60, accent: 'from-emerald-400/80 to-teal-400/50' },
  { id: 'orgs',       title: 'Organizations', kind: 'universe', gem: 'Lapis / Turquoise', blurb: 'Brands, associations, labs, co-ops.',               orbit: 2, angle: 150, accent: 'from-indigo-400/80 to-sky-400/50' },

  // orbit 3 — fields
  { id: 'events',     title: 'Events',     kind: 'field',    gem: 'Amber / Citrine',     blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.', orbit: 3, angle:  15, accent: 'from-amber-400/80 to-orange-500/50' },
  { id: 'research',   title: 'Research',   kind: 'field',    gem: 'Emerald',             blurb: 'Data & science flowing through all universes.',             orbit: 3, angle: 205, accent: 'from-emerald-400/80 to-teal-400/50' },
  { id: 'governance', title: 'Governance (DAO)', kind: 'field', gem: 'Platinum / Diamond', blurb: 'Rules & coordination aligning everything.',              orbit: 3, angle: 120, accent: 'from-zinc-200/80 to-white/50' },
];

/* ----------------------- Responsive canvas sizing ----------------------- */

function useCanvasSize() {
  const [size, setSize] = useState(760);

  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const header = 140; // room for title/strap
      const footer = 56;  // room for footer
      const base = Math.min(vw, vh - header - footer);
      const next = Math.max(520, Math.min(base * 0.92, 980));
      setSize(Math.round(next));
    };
    compute();
    window.addEventListener('resize', compute, { passive: true });
    return () => window.removeEventListener('resize', compute);
  }, []);

  return size;
}

/* ----------------------- Page ----------------------- */

export default function OverviewOrbits() {
  const [hovered, setHovered] = useState<string | null>(null);

  const byOrbit = useMemo(
    () => ({
      core: NODES.find((n) => n.kind === 'core')!,
      o1: NODES.filter((n) => n.orbit === 1),
      o2: NODES.filter((n) => n.orbit === 2),
      o3: NODES.filter((n) => n.orbit === 3),
    }),
    []
  );

  // responsive canvas & derived dimensions
  const canvas = useCanvasSize();
  const RADII: Record<1 | 2 | 3, number> = {
    1: canvas * 0.26,
    2: canvas * 0.40,
    3: canvas * 0.54,
  };
  const SIZE_CORE = Math.round(canvas * 0.14);
  const SIZE_PLANET = Math.round(canvas * 0.028);

  // slow ring speeds (bigger ring => slower vibe)
  const SPEED: Record<1 | 2 | 3, string> = { 1: '80s', 2: '115s', 3: '160s' };

  // subtle hue randomization for the nebula
  const hue = useMemo(() => Math.floor(Math.random() * 360), []);

  return (
    <main className="relative min-h-screen bg-[#0b0b0d] text-zinc-200 overflow-hidden">
      {/* Nebula, centered & proportional to canvas */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
        <div
          className="relative rounded-full blur-3xl"
          style={{
            width: canvas * 1.1,
            height: canvas * 1.1,
            filter: `hue-rotate(${hue}deg)`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-60 animate-[pulseOrb_12s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(closest-side at 48% 52%, rgba(255,255,255,.16) 0%, rgba(160,150,255,.14) 36%, rgba(10,8,20,0) 70%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full opacity-45 mix-blend-screen animate-[hueSpin_22s_linear_infinite]"
            style={{
              background:
                'conic-gradient(from 0deg, #ff8ad7, #ffd16c, #8bff8a, #7fe4ff, #a490ff, #ff8ad7)',
            }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-4xl px-6 pt-8 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Hempin — The Universes Map
        </h1>
        <p className="mt-3 opacity-75">
          Hover planets to learn more. Your account is the nucleus. Tools orbit close. Universes in
          the middle ring. Cross-cutting fields on the outer ring.
        </p>
      </header>

      {/* Canvas */}
      <section className="relative z-10 mx-auto mt-8 grid place-items-center overflow-hidden">
        <div className="relative" style={{ width: canvas, height: canvas }}>
          {/* rings as spinning containers; orbit lines behind planets */}
          <Ring radius={RADII[3]} speed={SPEED[3]} dashed>
            {byOrbit.o3.map((n) => (
              <Planet
                key={n.id}
                node={n}
                radius={RADII[3]}
                onHover={setHovered}
                size={SIZE_PLANET}
              />
            ))}
          </Ring>

          <Ring radius={RADII[2]} speed={SPEED[2]} dashed>
            {byOrbit.o2.map((n) => (
              <Planet
                key={n.id}
                node={n}
                radius={RADII[2]}
                onHover={setHovered}
                size={SIZE_PLANET}
              />
            ))}
          </Ring>

          <Ring radius={RADII[1]} speed={SPEED[1]}>
            {byOrbit.o1.map((n) => (
              <Planet
                key={n.id}
                node={n}
                radius={RADII[1]}
                onHover={setHovered}
                size={SIZE_PLANET}
              />
            ))}
          </Ring>

          {/* core in the center */}
          <Core node={byOrbit.core} onHover={setHovered} size={SIZE_CORE} />

          {/* tooltip */}
          <Tooltip hoveredId={hovered} />
        </div>
      </section>

      <p className="relative z-10 mt-8 text-center text-xs opacity-50 pb-8">
        HEMPIN — experimental overview
      </p>

      <style>{`
        @keyframes spin360 { from { transform: rotate(0) } to { transform: rotate(360deg) } }
        @keyframes pulseOrb { 0%,100% { transform: scale(1); filter: brightness(1) }
                              50%     { transform: scale(1.03); filter: brightness(1.08) } }
        @keyframes hueSpin { from { filter: hue-rotate(0deg) } to { filter: hue-rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) {
          .spin { animation: none !important; }
        }
      `}</style>
    </main>
  );
}

/* ----------------------- Components ----------------------- */

function Ring({
  radius,
  speed,
  dashed = false,
  children,
}: {
  radius: number;
  speed: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 spin"
      style={{ width: radius * 2, height: radius * 2, animation: `spin360 ${speed} linear infinite` }}
      aria-hidden
    >
      <div
        className={`absolute inset-0 z-0 rounded-full ${
          dashed ? 'border border-white/15 border-dashed' : 'border border-white/10'
        }`}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

function Core({
  node,
  onHover,
  size,
}: {
  node: Node;
  onHover: (id: string | null) => void;
  size: number;
}) {
  return (
    <button
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center outline-none"
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative">
        <div className="absolute -inset-8 rounded-full blur-2xl opacity-40 bg-white/20" />
        <div
          className="rounded-full ring-1 ring-white/25 shadow-2xl transition group-hover:scale-[1.03]"
          style={{
            width: size,
            height: size,
            background:
              'radial-gradient(closest-side at 48% 52%, rgba(255,255,255,.82) 0%, rgba(210,220,255,.28) 58%, rgba(255,255,255,.06) 100%)',
          }}
        />
      </div>
      <span className="mt-3 text-xs opacity-85">{node.title}</span>
    </button>
  );
}

function Planet({
  node,
  radius,
  onHover,
  size,
}: {
  node: Node;
  radius: number;
  onHover: (id: string | null) => void;
  size: number;
}) {
  const a = node.angle ?? 0;

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(-50%,-50%) rotate(${a}deg) translateX(${radius}px)` }}
    >
      <button
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(node.id)}
        onBlur={() => onHover(null)}
        className="group grid place-items-center outline-none"
        aria-label={`${node.title}. ${node.blurb}`}
      >
        <div
          className={`rounded-full ring-1 ring-white/25 shadow-xl transition-transform group-hover:scale-110 bg-gradient-to-br ${
            node.accent ?? 'from-slate-400/70 to-slate-500/40'
          }`}
          style={{
            width: size,
            height: size,
            boxShadow:
              '0 0 14px rgba(255,255,255,.08), inset -6px -6px 12px rgba(0,0,0,.25), inset 8px 8px 14px rgba(255,255,255,.22)',
          }}
        />
        {/* keep label upright (counter the polar rotate) */}
        <span
          className="mt-2 text-[11px] md:text-xs opacity-80"
          style={{ transform: `rotate(${-a}deg)` }}
        >
          {node.title}
        </span>
      </button>
    </div>
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
            <span className="ml-2 text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
              {node.gem}
            </span>
          </div>
          <p className="mt-1 text-xs opacity-80">{node.blurb}</p>
        </div>
      </div>
    </div>
  );
}