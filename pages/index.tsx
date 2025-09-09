// src/app/overview/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const NODES: NodeDef[] = [
  // CORE
  {
    id: 'core',
    title: 'Account (You)',
    kind: 'core',
    gem: 'Diamond',
    blurb:
      'Private dashboard + settings. Public profile is a layer above that you control.',
    accent: 'from-white/70 to-white/30',
  },

  // ORBIT 1 — tools
  {
    id: 'wallet',
    title: 'Wallet',
    kind: 'tool',
    gem: 'Gold',
    blurb: 'Your balance, receipts, and perks.',
    orbit: 1,
    angle: 315,
    accent: 'from-yellow-300/70 to-amber-400/40',
  },
  {
    id: 'architect',
    title: 'Architect',
    kind: 'tool',
    gem: 'Silver',
    blurb: 'Edit visibility, customize profile, link universes.',
    orbit: 1,
    angle: 45,
    accent: 'from-slate-200/70 to-zinc-300/40',
  },
  {
    id: 'comms',
    title: 'Comms',
    kind: 'tool',
    gem: 'Mercury',
    blurb: 'Messages & notifications across your hemp universes.',
    orbit: 1,
    angle: 190,
    accent: 'from-sky-200/70 to-cyan-200/40',
  },

  // ORBIT 2 — universes
  {
    id: 'fund',
    title: 'Fund',
    kind: 'universe',
    gem: 'Rose Quartz / Pink Sapphire',
    blurb: 'Crowdfunding & finance to fuel projects.',
    orbit: 2,
    angle: 335,
    accent: 'from-pink-400/70 to-fuchsia-400/40',
  },
  {
    id: 'market',
    title: 'Market',
    kind: 'universe',
    gem: 'Sapphire',
    blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.',
    orbit: 2,
    angle: 260,
    accent: 'from-blue-500/70 to-cyan-400/40',
  },
  {
    id: 'places',
    title: 'Places',
    kind: 'universe',
    gem: 'Jade',
    blurb: 'Farms, factories, stores — the physical network.',
    orbit: 2,
    angle: 60,
    accent: 'from-emerald-400/70 to-teal-400/40',
  },
  {
    id: 'orgs',
    title: 'Organizations',
    kind: 'universe',
    gem: 'Lapis / Turquoise',
    blurb: 'Brands, associations, labs, co-ops.',
    orbit: 2,
    angle: 150,
    accent: 'from-indigo-400/70 to-sky-400/40',
  },

  // ORBIT 3 — cross-cutting fields
  {
    id: 'events',
    title: 'Events',
    kind: 'field',
    gem: 'Amber / Citrine',
    blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.',
    orbit: 3,
    angle: 15,
    accent: 'from-amber-400/70 to-orange-500/40',
  },
  {
    id: 'research',
    title: 'Research',
    kind: 'field',
    gem: 'Emerald',
    blurb: 'Data & science flowing through all universes.',
    orbit: 3,
    angle: 205,
    accent: 'from-emerald-400/70 to-teal-400/40',
  },
  {
    id: 'governance',
    title: 'Governance (DAO)',
    kind: 'field',
    gem: 'Platinum / Diamond',
    blurb: 'Rules & coordination aligning everything.',
    orbit: 3,
    angle: 120,
    accent: 'from-zinc-200/70 to-white/30',
  },
];

// Concentric ring radii (px) — widened
const RADII: Record<1 | 2 | 3, number> = {
  1: 180,
  2: 300,
  3: 420,
};

// Planet sizes
const DOT = { core: 120, orbit: 22 };

// ─────────────────────────────────────────────────────────────────────────────

export default function OverviewOrbits() {
  const [hovered, setHovered] = useState<string | null>(null);

  // randomize initial hue so the rainbow orb starts unique each load
  const initialHue = useMemo(() => Math.floor(Math.random() * 360), []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-zinc-200">
      {/* Rainbow background orb centered on the core */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{ width: 880, height: 880, filter: `hue-rotate(${initialHue}deg)` }}
        >
          {/* soft radial base */}
          <div
            className="
              absolute inset-0 rounded-full blur-3xl opacity-70
              animate-[pulseOrb_12s_ease-in-out_infinite]
            "
            style={{
              background:
                'radial-gradient(closest-side at 48% 52%, rgba(255,255,255,.18) 0%, rgba(155,145,255,.15) 35%, rgba(10,8,20,0) 70%)',
            }}
          />
          {/* conic rainbow glow, slow hue spin */}
          <div
            className="
              absolute inset-0 rounded-full blur-2xl opacity-55
              mix-blend-screen
              animate-[hueSpin_22s_linear_infinite]
            "
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
          Hover planets to learn more. Your account is the nucleus. Tools orbit close. Universes
          live in the middle ring. Cross-cutting fields flow on the outer ring.
        </p>
      </header>

      {/* Canvas */}
      <section className="relative z-10 mx-auto mt-10 grid place-items-center">
        <div className="relative h-[900px] w-[900px] max-w-[92vw] max-h-[92vh]">
          {/* RINGS (pure concentric) */}
          <Ring radius={RADII[1]} speed="80s" />
          <Ring radius={RADII[2]} speed="110s" />
          <Ring radius={RADII[3]} speed="140s" dashed />

          {/* CORE */}
          <CorePlanet node={NODES[0]} setHovered={setHovered} />

          {/* ORBITING PLANETS */}
          {NODES.filter((n) => n.kind !== 'core').map((n) => (
            <OrbitingPlanet key={n.id} node={n} setHovered={setHovered} />
          ))}

          {/* Tooltip */}
          <Tooltip hoveredId={hovered} />
        </div>
      </section>

      <p className="relative z-10 mt-10 text-center text-xs opacity-50 pb-8">
        HEMPIN — experimental overview
      </p>

      {/* Animations */}
      <style>{`
        @keyframes slowSpin { 0%{ transform: rotate(0deg) } 100%{ transform: rotate(360deg) } }
        @keyframes pulseOrb { 0%,100%{ transform: scale(1); filter: brightness(1) } 50%{ transform: scale(1.03); filter: brightness(1.08) } }
        @keyframes hueSpin { 0%{ filter: hue-rotate(0deg) } 100%{ filter: hue-rotate(360deg) } }
        @media (prefers-reduced-motion: reduce) {
          .spin { animation: none !important; }
          .pulse { animation: none !important; }
        }
      `}</style>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RINGS
// ─────────────────────────────────────────────────────────────────────────────

function Ring({ radius, speed, dashed = false }: { radius: number; speed: string; dashed?: boolean }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 spin"
      style={{ width: radius * 2, height: radius * 2, animation: `slowSpin ${speed} linear infinite` }}
      aria-hidden
    >
      <div
        className={`w-full h-full rounded-full border ${
          dashed ? 'border-white/15 border-dashed' : 'border-white/10'
        }`}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANETS
// ─────────────────────────────────────────────────────────────────────────────

function CorePlanet({ node, setHovered }: { node: NodeDef; setHovered: (id: string | null) => void }) {
  const S = DOT.core;
  return (
    <button
      onMouseEnter={() => setHovered(node.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(node.id)}
      onBlur={() => setHovered(null)}
      className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center outline-none"
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative">
        <div className="absolute -inset-8 blur-2xl opacity-40 bg-gradient-to-br from-white/40 to-sky-200/30 rounded-full" />
        <div
          className="rounded-full ring-1 ring-white/25 shadow-2xl transition group-hover:scale-[1.03]"
          style={{
            width: S,
            height: S,
            background:
              'radial-gradient(closest-side at 48% 52%, rgba(255,255,255,.7) 0%, rgba(200,210,255,.25) 60%, rgba(255,255,255,.08) 100%)',
          }}
        />
      </div>
      <span className="mt-3 text-xs opacity-85">{node.title}</span>
    </button>
  );
}

function OrbitingPlanet({
  node,
  setHovered,
}: {
  node: NodeDef;
  setHovered: (id: string | null) => void;
}) {
  if (!node.orbit) return null;
  const r = RADII[node.orbit];
  const angle = node.angle ?? 0;
  const S = DOT.orbit;

  return (
    <button
      onMouseEnter={() => setHovered(node.id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(node.id)}
      onBlur={() => setHovered(null)}
      className="group absolute left-1/2 top-1/2 outline-none"
      // place dot at angle on ring (keep label upright with counter-rotate)
      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${r}px)` }}
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative grid place-items-center" style={{ transform: `rotate(${-angle}deg)` }}>
        <div
          className={`
            rounded-full ring-1 ring-white/20 shadow-xl transition-transform group-hover:scale-110
            bg-gradient-to-br ${node.accent ?? 'from-slate-400/60 to-slate-500/30'}
          `}
          style={{ width: S, height: S }}
        />
        <span className="mt-2 text-[11px] md:text-xs opacity-75">{node.title}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────

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