// pages/experiments/tamagotchi.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'

type Stats = {
  water: number
  soil: number
  biodiversity: number
}

export default function Tamagotchi() {
  const [stats, setStats] = useState<Stats>({ water: 60, soil: 60, biodiversity: 60 })
  const [tick, setTick] = useState(0)

  // gentle decay + random events
  useEffect(() => {
    const id = setInterval(() => {
      setStats(s => {
        const drift = () => (Math.random() < 0.33 ? -1 : 0)
        return {
          water: Math.max(0, Math.min(100, s.water - 1 + drift())),
          soil: Math.max(0, Math.min(100, s.soil - 1 + drift())),
          biodiversity: Math.max(0, Math.min(100, s.biodiversity - 1 + drift())),
        }
      })
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const happiness = Math.round((stats.water + stats.soil + stats.biodiversity) / 3)

  const act = (kind: keyof Stats, delta: number) => {
    setStats(s => ({ ...s, [kind]: Math.max(0, Math.min(100, s[kind] + delta)) }))
  }

  return (
    <>
      <Head><title>Regenerative World Pet • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">🌍 Regenerative World Pet</h1>
        <p className="mt-2 text-zinc-400">Keep water, soil, and biodiversity in balance. Your planet reacts in real time.</p>

        {/* Planet */}
        <div className="mt-6 grid gap-6 md:grid-cols-[320px,1fr]">
          <div className="flex items-center justify-center">
            <div
              className="relative grid h-64 w-64 place-items-center rounded-full"
              style={{
                background:
                  'radial-gradient(120px at 40% 35%, rgba(16,185,129,.35), transparent), radial-gradient(120px at 65% 60%, rgba(59,130,246,.25), transparent), radial-gradient(150px at 50% 50%, rgba(34,197,94,.25), rgba(0,0,0,.5))',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,.4), 0 10px 40px rgba(0,0,0,.6)',
              }}
            >
              <div className="text-center">
                <div className="text-sm text-zinc-300">Happiness</div>
                <div className="text-4xl font-bold">{happiness}%</div>
                <div className="mt-1 text-xs text-zinc-400">tick #{tick}</div>
              </div>
              <div className="absolute -bottom-3 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-black/60 blur-md" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <StatBar label="Water" value={stats.water} hint="Restore wetlands, collect rainwater" />
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => act('water', -5)}>Use water</button>
              <button className="btn btn-primary" onClick={() => act('water', +8)}>Replenish</button>
            </div>

            <StatBar label="Soil" value={stats.soil} hint="Compost, cover crop, reduce tillage" />
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => act('soil', -5)}>Extract</button>
              <button className="btn btn-primary" onClick={() => act('soil', +8)}>Regenerate</button>
            </div>

            <StatBar label="Biodiversity" value={stats.biodiversity} hint="Rewild edges, plant polycultures" />
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => act('biodiversity', -5)}>Monocrop</button>
              <button className="btn btn-primary" onClick={() => act('biodiversity', +8)}>Rewild</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatBar({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-zinc-400">{hint}</div>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400/70" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}