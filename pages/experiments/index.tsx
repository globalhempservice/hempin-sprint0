// pages/experiments/index.tsx
import Link from 'next/link'
import { useState } from 'react'

type Exp = {
  id: string
  title: string
  emoji: string
  desc: string
  href: string
}

const EXPS: Exp[] = [
  {
    id: 'brand-preview',
    title: 'Brand Preview',
    emoji: '🏷️',
    desc: 'Early peek at your Hemp’in brand page.',
    href: '/experiments/brand-preview',
  },
  {
    id: 'earth-tamagotchi',
    title: 'Earth Tamagotchi',
    emoji: '🌍',
    desc: 'Keep Earth happy by balancing diet, mood, and skin.',
    href: '/experiments/earth-tamagotchi',
  },
  {
    id: 'hemp-jackpot',
    title: 'Hemp Jackpot',
    emoji: '🎰',
    desc: 'Spin the reels and try to win hemp goodies!',
    href: '/experiments/hemp-jackpot',
  },
]

export default function ExperimentsIndex() {
  const [votes, setVotes] = useState<Record<string, number>>({})

  const upvote = (id: string) => {
    setVotes(v => ({ ...v, [id]: (v[id] || 0) + 1 }))
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      <h1 className="text-3xl font-bold">🧪 Hemp’in Lab</h1>
      <p className="text-zinc-400">Prototype features. Play, vote, suggest!</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {EXPS.map(e => (
          <div
            key={e.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg"
          >
            <div className="text-3xl">{e.emoji}</div>
            <h2 className="mt-3 text-xl font-semibold">{e.title}</h2>
            <p className="text-sm text-zinc-400">{e.desc}</p>

            <div className="mt-4 flex items-center gap-3">
              <Link
                href={e.href}
                className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-500/30"
              >
                Try it
              </Link>
              <button
                onClick={() => upvote(e.id)}
                className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400 hover:bg-white/5"
              >
                👍 {votes[e.id] || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}