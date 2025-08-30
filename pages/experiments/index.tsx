// pages/experiments/index.tsx
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

type Card = { href: string; title: string; blurb: string; tag: string; soon?: boolean }

// ---------- Level 2 (built) ----------
const LEVEL2: Card[] = [
  {
    href: '/experiments/carbon-odyssey',
    title: 'Carbon Odyssey (L2)',
    blurb: 'Daily nudge a living planet. Balance biomass, emissions, and happiness.',
    tag: 'collective',
  },
]

// ---------- Level 1 (many built, some “coming soon”) ----------
const LEVEL1: Card[] = [
  {
    href: '/experiments/dao-simulator',
    title: 'Hemp DAO Simulator',
    blurb: 'Vote on proposals with a fake token balance and see outcomes live.',
    tag: 'game',
  },
  {
    href: '/experiments/green-planet',
    title: 'Regenerative World Pet',
    blurb: 'Care for a tiny planet: balance water, soil, and biodiversity.',
    tag: 'pet',
  },
  {
    href: '/experiments/carbon-lottery',
    title: 'Carbon Lottery',
    blurb: 'Press your luck to win offsets. Pure luck, zero crypto… for now.',
    tag: 'luck',
  },
  {
    href: '/experiments/supply-chain-race',
    title: 'Supply-Chain Tracker Race',
    blurb: 'Move hemp from fiber → yarn → fabric → product. How fast are you?',
    tag: 'race',
  },
  {
    href: '/experiments/carbon-blackjack',
    title: 'Carbon Blackjack',
    blurb: "Beat the dealer to win carbon credits. Don't bust your footprint!",
    tag: 'cards',
  },
  {
    href: '/experiments/lifestyle-wallet',
    title: 'Lifestyle CO₂ Wallet',
    blurb: 'Track and redeem lower-footprint choices across partners.',
    tag: 'wallet',
    soon: true,
  },
  {
    href: '/experiments/nft-closet',
    title: 'NFT Wardrobe Closet',
    blurb: 'Own digital garments backed by real hemp supply chains.',
    tag: 'nft',
    soon: true,
  },
  {
    href: '/experiments/web5-identity',
    title: 'Web5 Identity Capsule',
    blurb: 'Self-sovereign identity for buyers, brands, and events.',
    tag: 'identity',
    soon: true,
  },
  {
    href: '/experiments/meme-forge',
    title: 'Hemp Meme Forge',
    blurb: 'Co-create viral hemp memes and tip creators.',
    tag: 'social',
    soon: true,
  },
  {
    href: '/experiments/city-builder',
    title: 'Future Hemp City Builder',
    blurb: 'Design districts: farms, mills, labs—optimize for well-being.',
    tag: 'sim',
    soon: true,
  },
]

// ---------- Simple, dependency-free hero carousel ----------
const SLIDES = [
  {
    title: 'Nudge a Living Planet',
    blurb: 'Carbon Odyssey (Level 2): one action per day. Keep Earth thriving.',
    cta: 'Play now',
    href: '/experiments/carbon-odyssey',
  },
  {
    title: 'Win Offsets, Maybe 👀',
    blurb: 'Carbon Lottery: luck meets climate. Zero crypto, pure fun.',
    cta: 'Try your luck',
    href: '/experiments/carbon-lottery',
  },
  {
    title: 'Race the Hemp Chain',
    blurb: 'From fiber to fabric—how fast can you ship a product?',
    cta: 'Start the race',
    href: '/experiments/supply-chain-race',
  },
]

export default function LabIndex() {
  const [i, setI] = useState(0)
  const len = SLIDES.length

  // auto-advance
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % len), 5000)
    return () => clearInterval(t)
  }, [len])

  const slide = useMemo(() => SLIDES[i], [i])

  return (
    <>
      <Head>
        <title>HEMPIN Lab • Experiments</title>
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero Carousel */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-zinc-900/70 to-black/90 p-8">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative grid items-center gap-6 md:grid-cols-[1.1fr,1fr]">
            <div>
              <div className="text-xs uppercase tracking-wide text-emerald-300">HEMPIN Lab</div>
              <h1 className="mt-2 text-3xl font-extrabold">{slide.title}</h1>
              <p className="mt-2 max-w-xl text-sm opacity-80">{slide.blurb}</p>
              <Link
                href={slide.href}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 hover:bg-emerald-400/10"
              >
                {slide.cta} <span>→</span>
              </Link>
            </div>

            {/* dots */}
            <div className="mt-2 flex items-center justify-start gap-2 md:justify-end">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={[
                    'h-2.5 w-2.5 rounded-full ring-1 ring-white/20',
                    idx === i ? 'bg-emerald-400' : 'bg-white/20 hover:bg-white/30',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Level 2 */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Level 2 — Deeper, persistent demos</h2>
          <Grid cards={LEVEL2} />
        </section>

        {/* divider */}
        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Level 1 */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Level 1 — Toy prototypes</h2>
          <Grid cards={LEVEL1} />
        </section>

        <p className="mt-10 text-xs opacity-70">
          Vote with your clicks. If a card spikes in traffic, we’ll upgrade it to a real feature.
        </p>
      </div>
    </>
  )
}

function Grid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) =>
        c.soon ? (
          <div
            key={c.href}
            className="rounded-2xl border border-white/10 bg-white/[.03] p-5 opacity-80 ring-0"
          >
            <div className="mb-2 text-xs uppercase tracking-wide text-emerald-300">{c.tag}</div>
            <div className="mb-1 text-base font-semibold">{c.title}</div>
            <p className="text-sm opacity-80">{c.blurb}</p>
            <div className="mt-4 inline-flex items-center rounded-lg border border-white/10 px-3 py-1 text-xs opacity-80">
              Coming soon…
            </div>
          </div>
        ) : (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-white/10 bg-white/[.03] p-5 transition hover:bg-white/[.06]"
          >
            <div className="mb-2 text-xs uppercase tracking-wide text-emerald-300">{c.tag}</div>
            <div className="mb-1 text-base font-semibold">{c.title}</div>
            <p className="text-sm opacity-80">{c.blurb}</p>
            <div className="mt-4 text-xs text-emerald-300 opacity-80 group-hover:opacity-100">Play →</div>
          </Link>
        )
      )}
    </div>
  )
}