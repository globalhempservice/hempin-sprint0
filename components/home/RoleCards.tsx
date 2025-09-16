// components/home/RoleCards.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

type Card = {
  title: string;
  description: string;
  href: string;
  accent: string;   // hex color for aura + button
  slug: string;     // for analytics hooks if you add them later
};

const cards: Card[] = [
  {
    title: 'FUND',
    description: 'Back the build and fuel the network — access campaigns, perks, and Leaf XP.',
    href: 'https://fund.hempin.org',
    accent: '#EC4899', // pink
    slug: 'fund',
  },
  {
    title: 'MARKET',
    description: 'Marketplace for hemp brands & products — storefronts and listings.',
    href: 'https://market.hempin.org',
    accent: '#6B5CF6', // violet
    slug: 'market',
  },
  {
    title: 'PLACES',
    description: 'Map of farms, factories, labs & shops — the physical supply chain.',
    href: 'https://place.hempin.org',
    accent: '#38E2B5', // mint/teal
    slug: 'place',
  },
  {
    title: 'DIRECTORY',
    description: 'Profiles of brands, suppliers & associations — the organizational layer.',
    href: 'https://directory.hempin.org',
    accent: '#C9A66B', // gold
    slug: 'directory',
  },
  {
    title: 'KNOWLEDGE',
    description: 'Hemp Atlas — laws, research, and standards by country.',
    href: 'https://knowledge.hempin.org',
    accent: '#38BDF8', // sky/cyan
    slug: 'knowledge',
  },
  {
    title: 'EVENT',
    description: 'Expos, pop-ups, and community activations — connect in real time.',
    href: 'https://event.hempin.org',
    accent: '#F59E0B', // amber
    slug: 'event',
  },
];

export default function RoleCards() {
  // subtle auto-nudge on mobile to hint horizontal scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const start = el.scrollLeft;
    const target = start + 24;
    el.scrollTo({ left: target, behavior: 'smooth' });
    const id = setTimeout(() => el.scrollTo({ left: start, behavior: 'smooth' }), 450);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 md:pb-14">
      <div className="text-center mb-6">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">How can you participate?</h3>
        <p className="mt-2 text-sm opacity-75">Explore the universes we’re opening.</p>
      </div>

      {/* Desktop/tablet: 2 x 3 grid */}
      <div className="hidden md:grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.title}
            className="flex flex-col rounded-2xl bg-white/5 p-5 backdrop-blur-sm"
            style={{
              boxShadow: `0 0 0 1px ${c.accent}22 inset, 0 0 24px ${c.accent}1a inset`,
            }}
          >
            <div className="text-base md:text-lg font-medium">{c.title}</div>
            <p className="mt-2 text-sm opacity-75">{c.description}</p>
            <div className="mt-4">
              <Link
                href={`${c.href}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${c.title} (new tab)`}
                className="rounded-md px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ backgroundColor: c.accent }}
              >
                Visit
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile: horizontal snap scroll with edge fades */}
      <div className="md:hidden relative -mx-4 px-4">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0b0b0d] to-transparent" />
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-1"
        >
          {cards.map((c) => (
            <article
              key={c.title}
              className="snap-start shrink-0 w-[82%] rounded-2xl bg-white/5 p-5 backdrop-blur-sm"
              style={{
                boxShadow: `0 0 0 1px ${c.accent}22 inset, 0 0 24px ${c.accent}1a inset`,
              }}
            >
              <div className="text-base font-medium">{c.title}</div>
              <p className="mt-2 text-sm opacity-75">{c.description}</p>
              <div className="mt-4">
                <Link
                  href={`${c.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${c.title} (new tab)`}
                  className="rounded-md px-4 py-2 text-sm font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                  style={{ backgroundColor: c.accent }}
                >
                  Visit
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}