// pages/experiments/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useMemo } from 'react'

type Card = {
  slug: string
  title: string
  emoji: string
  blurb: string
  built: boolean
}

export default function ExperimentsIndex() {
  const cards: Card[] = useMemo(
    () => [
      // BUILT (5)
      { slug: 'dao-simulator',      title: 'Hemp DAO Simulator',       emoji: '🗳️', blurb: 'Vote on proposals with a fake token balance and see outcomes live.', built: true },
      { slug: 'tamagotchi',         title: 'Regenerative World Pet',   emoji: '🌍', blurb: 'Care for a tiny planet: balance water, soil, and biodiversity.',       built: true },
      { slug: 'carbon-lottery',     title: 'Carbon Lottery',           emoji: '🎰', blurb: 'Press your luck to win offsets. Pure luck, zero crypto… for now.', built: true },
      { slug: 'supply-chain-race',  title: 'Supply-Chain Tracker Race',emoji: '🚚', blurb: 'Move hemp from fiber → yarn → fabric → product. How fast are you?', built: true },
      { slug: 'blackjack-carbon',   title: 'Carbon Blackjack',         emoji: '🃏', blurb: 'Beat the dealer to win carbon credits. Don’t bust your footprint!',   built: true },

      // COMING SOON (5)
      { slug: 'lifestyle-wallet',   title: 'Lifestyle CO₂ Wallet',     emoji: '💳', blurb: 'Track and redeem lower-footprint choices across partners.',         built: false },
      { slug: 'nft-closet',         title: 'NFT Wardrobe Closet',      emoji: '👕', blurb: 'Own digital garments backed by real hemp supply chains.',           built: false },
      { slug: 'web5-identity',      title: 'Web5 Identity Capsule',    emoji: '🔐', blurb: 'Self-sovereign identity for buyers, brands, and events.',            built: false },
      { slug: 'meme-forge',         title: 'Hemp Meme Forge',          emoji: '😂', blurb: 'Co-create viral hemp memes and tip creators.',                      built: false },
      { slug: 'city-builder',       title: 'Future Hemp City Builder',  emoji: '🏙️', blurb: 'Design districts: farms, mills, labs—optimize for well-being.',    built: false },
    ],
    []
  )

  return (
    <>
      <Head><title>HEMPIN Lab • Experiments</title></Head>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">HEMPIN Lab</h1>
          <p className="mt-2 text-zinc-400">Play with ideas for hemp, climate, and community. Vote, break, repeat.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(card => (
            <article
              key={card.slug}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-black/40 p-5 shadow-[0_0_0_1px_rgba(255,255,255,.04),0_10px_30px_-10px_rgba(0,0,0,.6)]"
            >
              <div className="mb-3 text-3xl">{card.emoji}</div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{card.blurb}</p>

              <div className="mt-5">
                {card.built ? (
                  <Link
                    href={`/experiments/${card.slug}`}
                    className="inline-flex items-center rounded-xl bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/30"
                  >
                    Play
                    <span className="ml-2">→</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-400">
                    Coming soon…
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}