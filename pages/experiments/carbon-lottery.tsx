// pages/experiments/carbon-lottery.tsx
import Head from 'next/head'
import { useMemo, useState } from 'react'

type Prize = { label: string; kg: number; odds: number } // odds: 0..1

export default function CarbonLottery() {
  const prizes: Prize[] = useMemo(
    () => [
      { label: 'No win this time', kg: 0, odds: 0.65 },
      { label: 'Small win',        kg: 1, odds: 0.20 },
      { label: 'Nice win',         kg: 3, odds: 0.10 },
      { label: 'Jackpot!',         kg: 10, odds: 0.05 },
    ],
    []
  )

  const [last, setLast] = useState<Prize | null>(null)
  const [total, setTotal] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const roll = () => {
    if (spinning) return
    setSpinning(true)
    setTimeout(() => {
      const r = Math.random()
      let acc = 0
      let win = prizes[0]
      for (const p of prizes) {
        acc += p.odds
        if (r <= acc) { win = p; break }
      }
      setLast(win)
      setTotal(t => t + win.kg)
      setSpinning(false)
    }, 800)
  }

  return (
    <>
      <Head><title>Carbon Lottery • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-xl px-4 py-10 lg:px-6 text-center">
        <h1 className="text-2xl font-bold">🎰 Carbon Lottery</h1>
        <p className="mt-2 text-zinc-400">Press your luck to “win” carbon offsets (demo only).</p>

        <div className="mx-auto mt-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm text-zinc-400">Total demo offsets</div>
          <div className="mt-1 text-4xl font-semibold">{total} kg CO₂e</div>

          <div className="mt-6">
            <button
              onClick={roll}
              disabled={spinning}
              className="btn btn-primary w-full"
            >
              {spinning ? 'Rolling…' : 'Roll'}
            </button>
          </div>

          <div className="mt-6 h-16 rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="grid h-full place-items-center text-lg">
              {last ? (
                <span className={last.kg > 0 ? 'text-emerald-300' : 'text-zinc-300'}>
                  {last.label} {last.kg > 0 ? `(+${last.kg} kg)` : ''}
                </span>
              ) : (
                <span className="text-zinc-400">No result yet</span>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Demo probabilities: 65% none, 20% +1kg, 10% +3kg, 5% +10kg.
          </p>
        </div>
      </div>
    </>
  )
}