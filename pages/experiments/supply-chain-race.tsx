// pages/experiments/supply-chain-race.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'

const STAGES = ['Fiber', 'Yarn', 'Fabric', 'Product'] as const
type Stage = typeof STAGES[number]

export default function SupplyChainRace() {
  const [stage, setStage] = useState<Stage>('Fiber')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const start = () => {
    setStage('Fiber')
    setSeconds(0)
    setRunning(true)
  }

  const advance = () => {
    const idx = STAGES.indexOf(stage)
    if (idx === STAGES.length - 1) {
      setRunning(false)
      return
    }
    setStage(STAGES[idx + 1])
  }

  return (
    <>
      <Head><title>Supply-Chain Tracker Race • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">🚚 Supply-Chain Tracker Race</h1>
        <p className="mt-2 text-zinc-400">Get hemp from field to fashion. How fast can you go (without cutting corners)?</p>

        <div className="mt-6 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-zinc-400">Timer</div>
              <div className="text-3xl font-semibold">{seconds}s</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={start}>Restart</button>
              <button className="btn btn-primary" onClick={advance} disabled={!running}>
                {stage === 'Product' ? 'Finish' : 'Advance'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            {STAGES.map(s => {
              const reached = STAGES.indexOf(s) <= STAGES.indexOf(stage)
              return (
                <div
                  key={s}
                  className={[
                    'rounded-xl border p-4 text-center',
                    reached ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-white/10 bg-white/5',
                  ].join(' ')}
                >
                  <div className="text-sm text-zinc-400">{s}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400/70 transition-all"
              style={{ width: `${(STAGES.indexOf(stage) / (STAGES.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Future: plug into real vendor checkpoints and on-chain attestations.
        </p>
      </div>
    </>
  )
}