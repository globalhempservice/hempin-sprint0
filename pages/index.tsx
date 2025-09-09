import Head from 'next/head';
import { useMemo, useState } from 'react';

type NodeKind = 'core' | 'tool' | 'universe' | 'field';

type MoonDef = {
  id: string;
  title: string;
  accent: string;     // tailwind gradient bits
  angle?: number;     // starting angle
};

type NodeDef = {
  id: string;
  title: string;
  kind: NodeKind;
  gem: string;
  blurb: string;
  orbit?: 1 | 2 | 3;  // which ring (undefined for core)
  angle?: number;     // initial polar angle
  accent?: string;
  moons?: MoonDef[];  // optional sub-orbiting moons
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
    angle: 20,
    accent: 'from-yellow-300/70 to-amber-400/40',
  },
  {
    id: 'architect',
    title: 'Architect',
    kind: 'tool',
    gem: 'Silver',
    blurb: 'Edit visibility, customize profile, link universes.',
    orbit: 1,
    angle: 160,
    accent: 'from-slate-200/70 to-zinc-300/40',
  },
  {
    id: 'comms',
    title: 'Comms',
    kind: 'tool',
    gem: 'Mercury',
    blurb: 'Messages & notifications across your hemp universes.',
    orbit: 1,
    angle: 280,
    accent: 'from-sky-200/70 to-cyan-200/40',
  },

  // Orbit 2 (universes)
  {
    id: 'fund',
    title: 'Fund',
    kind: 'universe',
    gem: 'Rose Quartz / Pink Sapphire',
    blurb: 'Crowdfunding & finance to fuel projects.',
    orbit: 2,
    angle: 15,
    accent: 'from-pink-400/70 to-fuchsia-400/40',
  },
  {
    id: 'market',
    title: 'Market',
    kind: 'universe',
    gem: 'Sapphire',
    blurb: 'Trade (B2B) & Shop (B2C) for hemp goods.',
    orbit: 2,
    angle: 120,
    accent: 'from-blue-500/70 to-cyan-400/40',
    moons: [
      { id: 'trade', title: 'Trade (B2B)', accent: 'from-sky-400/70 to-cyan-300/40', angle: 30 },
      { id: 'shop',  title: 'Shop (B2C)',  accent: 'from-indigo-400/70 to-violet-400/40', angle: 210 },
    ],
  },
  {
    id: 'places',
    title: 'Places',
    kind: 'universe',
    gem: 'Jade',
    blurb: 'Farms, factories, stores — the physical network.',
    orbit: 2,
    angle: 220,
    accent: 'from-emerald-400/70 to-teal-400/40',
  },
  {
    id: 'orgs',
    title: 'Organizations',
    kind: 'universe',
    gem: 'Lapis / Turquoise',
    blurb: 'Brands, associations, labs, co-ops.',
    orbit: 2,
    angle: 300,
    accent: 'from-indigo-400/70 to-sky-400/40',
  },

  // Orbit 3 (fields)
  {
    id: 'events',
    title: 'Events',
    kind: 'field',
    gem: 'Amber / Citrine',
    blurb: 'Farm tours, conferences, launches. Attach to Places or Orgs.',
    orbit: 3,
    angle: 40,
    accent: 'from-amber-400/70 to-orange-500/40',
  },
  {
    id: 'research',
    title: 'Research',
    kind: 'field',
    gem: 'Emerald',
    blurb: 'Data & science flowing through all universes.',
    orbit: 3,
    angle: 160,
    accent: 'from-emerald-400/70 to-teal-400/40',
  },
  {
    id: 'governance',
    title: 'Governance (DAO)',
    kind: 'field',
    gem: 'Platinum / Diamond',
    blurb: 'Rules & coordination. A cosmic law that aligns everything.',
    orbit: 3,
    angle: 280,
    accent: 'from-zinc-200/70 to-white/30',
  },
];

const RADII: Record<1 | 2 | 3, number> = { 1: 130, 2: 210, 3: 290 };
const SPEEDS: Record<1 | 2 | 3, string> = { 1: '70s', 2: '100s', 3: '140s' }; // slower = grander

// Tooltip lookup also covers moons
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

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);
  const ringGroups = useMemo(
    () => ({
      ring1: NODES.filter((n) => n.orbit === 1),
      ring2: NODES.filter((n) => n.orbit === 2),
      ring3: NODES.filter((n) => n.orbit === 3),
      core: NODES.find((n) => n.kind === 'core')!,
    }),
    []
  );

  return (
    <>
      <Head><title>Hempin — The Universes Map</title></Head>

      <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] text-zinc-200">
        {/* breathing background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[62vh] w-[62vh] md:h-[74vh] md:w-[74vh] rounded-full blur-3xl opacity-50
                          bg-[radial-gradient(closest-side_at_58%_42%,rgba(255,180,220,.9)_0%,rgba(145,110,255,.6)_35%,rgba(10,8,20,0)_70%)]
                          animate-[pulseOrb_12s_ease-in-out_infinite]" />
        </div>

        {/* header */}
        <header className="relative z-10 mx-auto max-w-4xl px-6 pt-10 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Hempin — The Universes Map</h1>
          <p className="mt-3 opacity-75">
            Hover planets to learn more. Your account is the nucleus. Tools orbit close. Universes live in the middle
            ring. Cross-cutting fields flow on the outer ring.
          </p>
        </header>

        {/* cosmos */}
        <section className="relative z-10 mx-auto mt-10 grid place-items-center">
          <div className="relative h-[780px] w-[780px] max-w-[92vw] max-h-[92vh]">

            {/* concentric rings that spin; each ring is a rotating container */}
            <Ring radius={RADII[1]} speed={SPEEDS[1]}>
              {ringGroups.ring1.map((n) => (
                <Planet key={n.id} node={n} radius={RADII[1]} onHover={setHovered} />
              ))}
            </Ring>

            <Ring radius={RADII[2]} speed={SPEEDS[2]} dashed>
              {ringGroups.ring2.map((n) => (
                <Planet key={n.id} node={n} radius={RADII[2]} onHover={setHovered} />
              ))}
            </Ring>

            <Ring radius={RADII[3]} speed={SPEEDS[3]} dashed>
              {ringGroups.ring3.map((n) => (
                <Planet key={n.id} node={n} radius={RADII[3]} onHover={setHovered} />
              ))}
            </Ring>

            {/* nucleus stays fixed */}
            <Core node={ringGroups.core} onHover={setHovered} />

            {/* tooltip */}
            <Tooltip hoveredId={hovered} />
          </div>
        </section>

        <p className="relative z-10 mt-10 text-center text-xs opacity-50 pb-8">HEMPIN — experimental overview</p>

        <style>{`
          @keyframes spin360 { from{transform:rotate(0)} to{transform:rotate(360deg)} }
          @keyframes pulseOrb { 0%,100% {transform: scale(1); filter: brightness(1)}
                                50%     {transform: scale(1.03); filter: brightness(1.08)} }
          @media (prefers-reduced-motion: reduce) {
            .spin { animation: none !important; }
            .pulse { animation: none !important; }
          }
        `}</style>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RING (rotating container)
// ─────────────────────────────────────────────────────────────────────────────

function Ring({
  radius,
  speed,
  dashed,
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
      style={{ animation: `spin360 ${speed} linear infinite` }}
      aria-hidden={false}
    >
      <div
        className={`mx-auto rounded-full border ${dashed ? 'border-white/15 border-dashed' : 'border-white/10'}`}
        style={{ width: radius * 2, height: radius * 2 }}
      />
      {/* children revolve with the ring */}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANETS
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
      <div className="relative">
        <div className="absolute -inset-10 blur-2xl opacity-35 bg-gradient-to-br from-white/40 to-sky-200/30 rounded-full" />
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-white/60 to-zinc-200/30 ring-1 ring-white/20 shadow-2xl transition group-hover:scale-[1.03]" />
      </div>
      <span className="mt-3 text-xs opacity-80">{node.title}</span>
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
      // place the planet at given angle along its parent ring
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
        <div
          className={`
            h-9 w-9 md:h-11 md:w-11 rounded-full ring-1 ring-white/20
            bg-gradient-to-br ${node.accent ?? 'from-slate-400/60 to-slate-500/30'}
            shadow-xl transition-transform group-hover:scale-110
          `}
        />
        <span className="mt-2 text-[11px] md:text-xs opacity-80 rotate-[-${angle}deg]">{node.title}</span>
      </button>

      {/* Optional moon system (example: Market) */}
      {node.moons && node.moons.length > 0 && (
        <MoonSystem moons={node.moons} onHover={onHover} />
      )}
    </div>
  );
}

// Small sub-orbit around a planet
function MoonSystem({ moons, onHover }: { moons: MoonDef[]; onHover: (id: string | null) => void }) {
  const MOON_RADIUS = 42;
  const SPEED = '28s';

  return (
    <div
      className="relative pointer-events-none"
      // local spinner so moons orbit their parent
      style={{ animation: `spin360 ${SPEED} linear infinite` }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        style={{ width: MOON_RADIUS * 2, height: MOON_RADIUS * 2 }}
      />
      {moons.map((m) => (
        <div
          key={m.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
          style={{ transform: `translate(-50%, -50%) rotate(${m.angle ?? 0}deg) translateX(${MOON_RADIUS}px)` }}
        >
          <button
            onMouseEnter={() => onHover(m.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(m.id)}
            onBlur={() => onHover(null)}
            className="group grid place-items-center"
            aria-label={m.title}
          >
            <div
              className={`
                h-4.5 w-4.5 md:h-5 md:w-5 rounded-full ring-1 ring-white/20
                bg-gradient-to-br ${m.accent}
                shadow-md transition-transform group-hover:scale-110
              `}
              style={{ width: 18, height: 18 }}
            />
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