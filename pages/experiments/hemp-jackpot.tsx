// pages/experiments/hemp-jackpot.tsx
import { useState } from 'react'

const SYMBOLS = ['🌿', '👕', '👜', '🧢', '🥗']

const PRIZES: Record<string, string> = {
  '🌿🌿🌿': 'Bundle of hemp leaves 🌿',
  '👕👕👕': 'Hemp T-shirt 👕',
  '👜👜👜': 'Hemp tote bag 👜',
  '🧢🧢🧢': 'Hemp cap 🧢',
  '🥗🥗🥗': 'Hemp salad coupon 🥗',
}

export default function HempJackpot() {
  const [reels, setReels] = useState(['🌿', '🌿', '🌿'])
  const [result, setResult] = useState<string | null>(null)

  const spin = () => {
    const r = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    ]
    setReels(r)
    const combo = r.join('')
    setResult(PRIZES[combo] || 'No luck this time 😢')
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12 space-y-8 text-center">
      <h1 className="text-3xl font-bold">🎰 Hemp Jackpot</h1>
      <p className="text-zinc-400">Spin and try to win hemp goodies!</p>

      <div className="flex justify-center gap-4 text-6xl font-bold">
        {reels.map((s, i) => (
          <span
            key={i}
            className="rounded-lg border border-white/10 bg-black/40 px-4 py-3"
          >
            {s}
          </span>
        ))}
      </div>

      <button
        onClick={spin}
        className="rounded-xl bg-emerald-500/20 px-5 py-3 text-lg text-emerald-300 hover:bg-emerald-500/30"
      >
        Spin 🎲
      </button>

      {result && (
        <div className="text-lg font-semibold text-emerald-300">
          {result}
        </div>
      )}
    </main>
  )
}