// pages/overview/index.tsx  (Pages Router)
// ─ or ─
// src/app/overview/page.tsx (App Router: remove <Head> and export `metadata` instead)

import Head from 'next/head';
import { useMemo, useState } from 'react';

type NodeKind = 'core' | 'tool' | 'universe' | 'field';

type MoonDef = {
  id: string;
  title: string;
  accent: string;
  angle?: number;
};

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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const NODES: NodeDef[] = [
  // Nucleus
  {
    id: 'core',
    title: 'Account (You)',
    kind: 'core',
    gem: 'Diamond',
    blurb: 'Private dashboard + settings. Public profile is a layer above that you control.',
    accent: 'from-white/70 to-white/30',
  },

  // Orbit 1 (tools)
  {
    id: 'wallet',
    title: 'Wallet',
    kind: 'tool',
    gem: 'Gold',
    blurb: 'Your balance, receipts, and perks. Energy for the journey.',
    orbit: 1,
    angle: 25,
    accent: 'from-yellow-300/80 to-amber-400/50',
  },
  {
    id: 'architect',
    title: 'Architect',
    kind: 'tool',
    gem: 'Silver',
    blurb: 'Edit visibility, customize profile, link universes.',
    orbit: 1,
    angle: 160,
    accent: 'from-slate-200/80 to-zinc-300/50',
  },
  {
    id: 'comms',
    title: 'Comms',
    kind: 'tool',
    gem: 'Mercury',
    blurb: 'Messages & notifications across your hemp universes.',
    orbit: 1,
    angle: 290,
    accent: 'from-sky-200/80 to-cyan-200/50',
  },

  // Orbit 2 (universes)
  {
    id: 'fund',
    title: 'Fund',
    kind: 'universe',
    gem: 'Rose Quartz / Pink Sapphire',
    blurb: 'Crowdfunding & finance to fuel projects.',
    orbit: 2,
    angle: 20,
    accent: 'from-pink-400/80 to-fuchsia-400/50',
  },
  {
    id: 'market',
    title: 'Market',
    kind: 'universe',
    gem: 'Sapphire',
    blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.',
    orbit: 2,
    angle: 120,
    accent: 'from-blue-500/80 to-cyan-400/50',
    moons: [
      { id: 'trade', title: 'Trade (B2B)', accent: 'from-sky-400/80 to-cyan-300/60', angle: 35 },
      { id: 'shop',  title: 'Shop (B2C)',  accent: 'from-indigo-400/80 to-violet-400/60', angle: 215 },
    ],
  },
  {
    id: 'places',
    title: 'Places',
    kind: 'universe',
    gem: 'Jade',
    blurb: 'Farms, factories, stores — the physical network.',
    orbit: 2,
    angle: 225,
    accent: 'from-emerald-400/80 to-teal-400/50',
  },
  {
    id: 'orgs',
    title: 'Organizations',
    kind: 'universe',
    gem: 'Lapis / Turquoise',
    blurb: 'Brands, associations, labs, co-ops.',
    orbit: 2,
    angle: 300,
    accent: 'from-indigo-400/80 to-sky-400/50',
  },

  // Orbit 3 (fields)
  {
    id: 'events',
    title: 'Events',
    kind: 'field',
    gem: 'Amber / Citrine',
    blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.',
    orbit: 3,
    angle: 50,
    accent: 'from-amber-400/80 to-orange-500/50',
  },
  {
    id: 'research',
    title: 'Research',
    kind: 'field',
    gem: 'Emerald',
    blurb: 'Data & science flowing through all universes.',
    orbit: 3,
    angle: 165,
    accent: 'from-emerald-400/80 to-teal-400/50',
  },
  {
    id: 'governance',
    title: 'Governance (DAO)',
    kind: 'field',
    gem: 'Platinum / Diamond',
    blurb: 'Rules & coordination. A cosmic law that aligns everything.',
    orbit: 3,
    angle: 285,
    accent: 'from-zinc-200/80 to-white/50',
  },
];

// Radii + speeds (bigger & slower as we go out)
const RADII: Record<1 | 2 | 3, number> = { 1: 140, 2: 230, 3: 320 };
const SPEEDS: Record<1 | 2 | 3, string> = { 1: '70s', 2: '105s', 3: '150s' };

// Tooltip info (also for moons)
const INFO = Object.fromEntries(
  [
    ...NODES.map((n) => [n.id, { title: n.title, gem: n.gem, blurb: n.blurb }]),
    ['trade', { title: 'Trade (B2B)', gem: 'Sapphire', blurb: 'Wholesale marketplace for operators.' }],
    ['shop',  { title: 'Shop (B2C)',  gem: 'Violet',   blurb: 'Consumer storefronts and drop-ins.' }],
  ] as const
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function Overview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const groups = useMemo(
    () => ({
      core: NODES.find((n) => n.kind === 'core')!,
      r1: NODES.filter((n) => n.orbit === 1),
      r2: NODES.filter((n) => n.orbit === 2),
      r3: NODES.filter((n) => n.orbit === 3),
    }),
    []
  );

  return (
    <>
      <Head><title>Hempin — The Universes Map</title></Head>

      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-zinc-200">
        {/* Subtle nebula w/ noise */}
        <Nebula />

        {/* Header */}
        <header className="relative z-10 mx-auto max-w-4xl px-6 pt-10 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Hempin — The Universes Map
          </h1>
          <p className="mt-3 opacity-75">
            Hover planets to learn more. Your account is the nucleus. Tools orbit close. Universes live in the
            middle ring. Cross-cutting fields flow on the outer ring.
          </p>
        </header>

        {/* Solar system */}
        <section className="relative z-10 mx-auto mt-10 grid place-items-center">
          <div
            className="
              relative h-[820px] w-[820px] max-w-[92vw] max-h-[92vh]
              [transform-style:preserve-3d] [perspective:1200px]
            "
          >
            {/* container tilt for mild perspective */}
            <div className="absolute inset-0 [transform:rotateX(12deg)] [transform-style:preserve-3d]">
              {/* Rings that carry planets */}
              <Ring radius={RADII[1]} speed={SPEEDS[1]}>
                {groups.r1.map((n) => (
                  <Planet key={n.id} node={n} radius={RADII[1]} onHover={setHovered} />
                ))}
              </Ring>

              <Ring radius={RADII[2]} speed={SPEEDS[2]} dashed>
                {groups.r2.map((n) => (
                  <Planet key={n.id} node={n} radius={RADII[2]} onHover={setHovered} />
                ))}
              </Ring>

              <Ring radius={RADII[3]} speed={SPEEDS[3]} dashed faint>
                {groups.r3.map((n) => (
                  <Planet key={n.id} node={n} radius={RADII[3]} onHover={setHovered} />
                ))}
              </Ring>

              {/* Nucleus sits above (no tilt on label) */}
              <Core node={groups.core} onHover={setHovered} />
            </div>

            {/* Tooltip */}
            <Tooltip hoveredId={hovered} />
          </div>
        </section>

        <p className="relative z-10 mt-10 text-center text-xs opacity-50 pb-8">
          HEMPIN — experimental overview
        </p>

        <style>{`
          @keyframes spin360 { from { transform: rotate(0) } to { transform: rotate(360deg) } }
          @keyframes floaty  { 0%,100% { transform: translateY(-4px) } 50% { transform: translateY(4px) } }
          @media (prefers-reduced-motion: reduce) {
            .spin { animation: none !important; }
            .floaty { animation: none !important; }
          }
        `}</style>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND NEBULA
// ─────────────────────────────────────────────────────────────────────────────

function Nebula() {
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      {/* layered radial gradients */}
      <div
        className="
          relative h-[78vh] w-[78vh] max-w-[92vw] max-h-[92vh] rounded-full
          opacity-55 blur-3xl mix-blend-screen
        "
        style={{
          background:
            'radial-gradient(closest-side at 50% 55%, rgba(180,140,255,0.55), rgba(20,16,32,0) 68%),' +
            'radial-gradient(closest-side at 62% 42%, rgba(255,140,200,0.35), rgba(20,16,32,0) 65%),' +
            'radial-gradient(closest-side at 38% 58%, rgba(120,200,255,0.28), rgba(20,16,32,0) 60%)',
        }}
      />
      {/* super faint noise to break banding */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%272%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.25%27/></svg>")',
          backgroundSize: '320px 320px',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RING
// ─────────────────────────────────────────────────────────────────────────────

function Ring({
  radius,
  speed,
  dashed,
  faint,
  children,
}: {
  radius: number;
  speed: string;
  dashed?: boolean;
  faint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 spin"
      style={{ animation: `spin360 ${speed} linear infinite` }}
      aria-hidden={false}
    >
      <div
        className={`mx-auto rounded-full ${
          dashed ? 'border-white/15 border-dashed' : 'border-white/12'
        } ${faint ? 'opacity-60' : ''}`}
        style={{ width: radius * 2, height: radius * 2, borderWidth: 1 }}
      />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE + PLANETS
// ─────────────────────────────────────────────────────────────────────────────

function Core({ node, onHover }: { node: NodeDef; onHover: (id: string | null) => void }) {
  return (
    <button
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center outline-none"
      aria-label={`${node.title}. ${node.blurb}`}
    >
      <div className="relative floaty" style={{ animation: 'floaty 10s ease-in-out infinite' }}>
        {/* glow */}
        <div className="absolute -inset-12 rounded-full blur-3xl opacity-35 bg-white/25" />
        {/* sphere */}
        <div className="relative h-32 w-32 rounded-full ring-1 ring-white/20 shadow-2xl bg-gradient-to-br from-white/65 to-white/20">
          {/* glossy highlight */}
          <div className="absolute left-4 top-4 h-10 w-10 rounded-full bg-white/55 blur-lg" />
        </div>
      </div>
      <span className="mt-3 text-xs opacity-85">Account (You)</span>
    </button>
  );
}

function Planet({
  node,
  radius,
  onHover,
}: {
  node: NodeDef;
  radius: number;
  onHover: (id: string | null) => void;
}) {
  const angle = node.angle ?? 0;

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)` }}
    >
      <button
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(node.id)}
        onBlur={() => onHover(null)}
        className="group grid place-items-center outline-none"
        aria-label={`${node.title}. ${node.blurb}`}
      >
        {/* planet */}
        <div
          className={`relative h-10 w-10 md:h-12 md:w-12 rounded-full ring-1 ring-white/15 shadow-xl bg-gradient-to-br ${node.accent}`}
        >
          {/* highlight + terminator */}
          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/40 blur-[6px]" />
          <div className="absolute inset-0 rounded-full bg-black/20 translate-x-1 translate-y-1 blur-[2px] opacity-30" />
        </div>

        {/* label (counter-rotate so it reads upright) */}
        <span
          className="mt-2 text-[11px] md:text-xs opacity-85 block"
          style={{ transform: `rotate(${-angle}deg)` }}
        >
          {node.title}
        </span>
      </button>

      {/* Moons (e.g., Market) */}
      {node.moons && node.moons.length > 0 && <MoonSystem moons={node.moons} onHover={onHover} />}
    </div>
  );
}

function MoonSystem({ moons, onHover }: { moons: MoonDef[]; onHover: (id: string | null) => void }) {
  const R = 46;
  const SPEED = '28s';

  return (
    <div className="relative pointer-events-none" style={{ animation: `spin360 ${SPEED} linear infinite` }}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12"
        style={{ width: R * 2, height: R * 2 }}
      />
      {moons.map((m) => (
        <div
          key={m.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{ transform: `translate(-50%, -50%) rotate(${m.angle ?? 0}deg) translateX(${R}px)` }}
        >
          <button
            onMouseEnter={() => onHover(m.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(m.id)}
            onBlur={() => onHover(null)}
            className="group grid place-items-center"
            aria-label={m.title}
          >
            <div className={`relative h-[18px] w-[18px] rounded-full ring-1 ring-white/20 shadow-md bg-gradient-to-br ${m.accent}`}>
              <div className="absolute left-0.5 top-0.5 h-2 w-2 rounded-full bg-white/50 blur-[3px]" />
            </div>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────

function Tooltip({ hoveredId }: { hoveredId: string | null }) {
  if (!hoveredId) return null;
  const info = INFO[hoveredId];
  if (!info) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-[88%] -translate-x-1/2 w-[min(560px,92vw)]">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <div className="text-sm font-medium">
            {info.title}{' '}
            <span className="ml-2 text-[11px] rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
              {info.gem}
            </span>
          </div>
          <p className="mt-1 text-xs opacity-80">{info.blurb}</p>
        </div>
      </div>
    </div>
  );
}