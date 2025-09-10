// lib/cosmos.ts
export type Kind = 'core' | 'tool' | 'universe' | 'field';

export type Moon = {
  id: string;
  title: string;
  angle: number;        // degrees around the local moon orbit
  accent?: string;      // tailwind gradient bits
  blurb?: string;       // optional tooltip copy (we'll wire moons tooltips next)
};

export type Node = {
  id: string;
  title: string;
  kind: Kind;
  orbit?: 1 | 2 | 3;    // undefined for core
  angle?: number;       // degrees around its orbit
  accent?: string;      // tailwind gradient bits
  gem?: string;
  blurb?: string;       // tooltip copy
  moons?: Moon[];       // optional satellites
};

export type SystemConfig = {
  size: number;                 // SVG square in px
  radii: { 1: number; 2: number; 3: number };
  speeds: { 1: number; 2: number; 3: number }; // seconds per revolution

  // Global mild 3D perspective (kept for compatibility)
  tiltDeg: number;

  // Optional per-orbit visual tilt (degrees)
  orbitTilts?: { 1: number; 2: number; 3: number };

  show: {
    nebula: boolean;
    rings: boolean;
    labels: boolean;
    moons: boolean;
    tooltips: boolean;
    orbits: { 1: boolean; 2: boolean; 3: boolean };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// NODES (with full tooltip copy + moons)
// ─────────────────────────────────────────────────────────────────────────────

export const defaultNodes: Node[] = [
  {
    id: 'core',
    title: 'Your Account',
    kind: 'core',
    gem: 'Diamond',
    blurb:
      'Private dashboard and settings. Your public profile is a layer you control — switch visibility, connect universes, and manage identity.',
  },

  // ORBIT 1 — Tools
  {
    id: 'wallet',
    title: 'Wallet',
    kind: 'tool',
    orbit: 1,
    angle: 315,
    gem: 'Gold',
    accent: 'from-yellow-300 to-amber-400',
    blurb:
      'Balance, receipts, memberships and perks. Powers activity across Hempin (gas, fees, rewards).',
  },
  {
    id: 'architect',
    title: 'Architect',
    kind: 'tool',
    orbit: 1,
    angle: 45,
    gem: 'Silver',
    accent: 'from-zinc-200 to-slate-300',
    blurb:
      'Edit visibility, customize your profile, and link universes. Think “creative control room.”',
  },
  {
    id: 'comms',
    title: 'Comms',
    kind: 'tool',
    orbit: 1,
    angle: 190,
    gem: 'Mercury',
    accent: 'from-sky-200 to-cyan-300',
    blurb:
      'Messages and notifications across your hemp universes. Threads, alerts, invites.',
  },

  // ORBIT 2 — Universes
  {
    id: 'fund',
    title: 'Fund',
    kind: 'universe',
    orbit: 2,
    angle: 335,
    gem: 'Rose Quartz / Pink Sapphire',
    accent: 'from-pink-400 to-fuchsia-400',
    blurb:
      'Finance layer for projects and operations — crowdfunding, pooled funds, insurance, grants.',
    moons: [
      {
        id: 'crowdfunding',
        title: 'Crowdfunding',
        angle: 25,
        accent: 'from-pink-400 to-rose-400',
        blurb: 'Campaigns to fuel new ideas, products, and initiatives.',
      },
      {
        id: 'crop-insurance',
        title: 'Crop Insurance',
        angle: 165,
        accent: 'from-amber-300 to-yellow-400',
        blurb: 'Risk coverage products tailored for hemp growers and processors.',
      },
      {
        id: 'foundation',
        title: 'Foundation',
        angle: 265,
        accent: 'from-zinc-200 to-slate-200',
        blurb: 'Nonprofit & grants layer supporting research and public-good efforts.',
      },
    ],
  },
  {
    id: 'market',
    title: 'Market',
    kind: 'universe',
    orbit: 2,
    angle: 260,
    gem: 'Sapphire',
    accent: 'from-blue-500 to-cyan-400',
    blurb:
      'The commerce layer: B2B Trade for operators and B2C Shop for citizens — listings, pricing, orders.',
    moons: [
      {
        id: 'trade',
        title: 'Trade (B2B)',
        angle: 35,
        accent: 'from-sky-400 to-cyan-300',
        blurb: 'Wholesale marketplace for operators: supply, bulk orders, contracts.',
      },
      {
        id: 'shop',
        title: 'Shop (B2C)',
        angle: 215,
        accent: 'from-indigo-400 to-violet-400',
        blurb: 'Consumer storefronts and drops — retail experiences built on the same rails.',
      },
    ],
  },
  {
    id: 'places',
    title: 'Places',
    kind: 'universe',
    orbit: 2,
    angle: 60,
    gem: 'Jade',
    accent: 'from-emerald-400 to-teal-400',
    blurb:
      'Physical network of farms, factories, labs, and stores. Real-world locations, capacity, and logistics.',
    moons: [
      {
        id: 'farm',
        title: 'Farm',
        angle: 20,
        accent: 'from-emerald-400 to-lime-400',
        blurb: 'Growers, fields, and cultivation operations.',
      },
      {
        id: 'factory',
        title: 'Factory',
        angle: 155,
        accent: 'from-teal-400 to-cyan-400',
        blurb: 'Processing, decortication, fiber lines, and manufacturing.',
      },
      {
        id: 'store',
        title: 'Store',
        angle: 260,
        accent: 'from-green-400 to-sky-400',
        blurb: 'Retail endpoints: shops, showrooms, and point-of-sale nodes.',
      },
    ],
  },
  {
    id: 'orgs',
    title: 'Organizations',
    kind: 'universe',
    orbit: 2,
    angle: 150,
    gem: 'Lapis / Turquoise',
    accent: 'from-indigo-400 to-sky-400',
    blurb:
      'Brands, associations, labs, and co-ops. Teams, charters, governance, and collaboration spaces.',
  },

  // ORBIT 3 — Cross-cutting fields
  {
    id: 'events',
    title: 'Events',
    kind: 'field',
    orbit: 3,
    angle: 15,
    gem: 'Amber / Citrine',
    accent: 'from-amber-400 to-orange-500',
    blurb:
      'Farm tours, conferences, launches. Events can attach to Places or Organizations.',
  },
  {
    id: 'research',
    title: 'Research',
    kind: 'field',
    orbit: 3,
    angle: 205,
    gem: 'Emerald',
    accent: 'from-emerald-400 to-teal-400',
    blurb:
      'Data and science flowing through all universes — trials, standards, methods, results.',
  },
  {
    id: 'governance',
    title: 'Governance',
    kind: 'field',
    orbit: 3,
    angle: 120,
    gem: 'Platinum / Diamond',
    accent: 'from-zinc-200 to-white',
    blurb:
      'Rules and coordination aligning everything — permissions, votes, and policy frameworks.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export const defaultConfig: SystemConfig = {
  size: 820,
  radii: { 1: 140, 2: 230, 3: 320 },
  speeds: { 1: 70, 2: 105, 3: 150 }, // seconds
  tiltDeg: 10, // gentle default

  // Optional per-orbit tilts (UI may ignore or expose)
  orbitTilts: { 1: 8, 2: 16, 3: 24 },

  show: {
    nebula: true,
    rings: true,
    labels: true,
    moons: true,
    tooltips: true,
    orbits: { 1: true, 2: true, 3: true },
  },
};