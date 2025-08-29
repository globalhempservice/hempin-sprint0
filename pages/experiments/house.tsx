// pages/experiments/house.tsx
import { useMemo, useState } from 'react'
const LS = 'exp.house.state.v1'
const LS_V = 'exp.house.votes.v1'

type Mod = { id: string; label: string; co2: number; energy: number }
const MODS: Mod[] = [
  { id: 'walls',      label: 'Hempcrete Walls',          co2: -120, energy: 10 },
  { id: 'insulation', label: 'Hemp Fiber Insulation',    co2: -35,  energy: 15 },
  { id: 'plaster',    label: 'Lime Plaster',             co2: -10,  energy: 2  },
  { id: 'floor',      label: 'Hemp Board Flooring',      co2: -18,  energy: 3  },
  { id: 'panels',     label: 'Prefab Hemp Panels',       co2: -60,  energy: 8  },
]

function loadSaved(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(LS) || '[]') } catch { return [] }
}

export default function House() {
  const [mods, setMods] = useState<string[]>(loadSaved)
  const [votes, setVotes] = useState(() => {
    if (typeof window === 'undefined') return 0
    const v = localStorage.getItem(LS_V); return v ? Number(v) : 0
  })

  const toggle = (id: string) => {
    setMods(prev => {
      const next = prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]
      if (typeof window !== 'undefined') localStorage.setItem(LS, JSON.stringify(next))
      return next
    })
  }

  const totals = useMemo(() => {
    const picked = MODS.filter(m => mods.includes(m.id))
    const co2 = picked.reduce((a,b)=>a+b.co2,0) // negative = sequestration
    const energy = picked.reduce((a,b)=>a+b.energy,0) // % annual saving (demo)
    return { co2, energy, count: picked.length }
  }, [mods])

  const vote = () => {
    const v = votes + 1
    setVotes(v)
    if (typeof window !== 'undefined') localStorage.setItem(LS_V, String(v))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-emerald-900 to-zinc-900 text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Build a Hemp House</h1>
        <p className="mt-2 text-zinc-300">
          Toggle building components. See rough carbon and energy outcomes (educational demo).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,380px]">
          {/* Blueprint-ish card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {MODS.map(m => {
                const on = mods.includes(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={[
                      'rounded-xl p-4 text-left ring-1 transition',
                      on
                        ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/40'
                        : 'bg-black/50 text-zinc-200 ring-white/10 hover:bg-white/5',
                    ].join(' ')}
                  >
                    <div className="font-semibold">{m.label}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      CO₂: {m.co2} kg (negative = captured) • Energy: {m.energy}%/yr
                    </div>
                  </button>
                )
              })}
            </div>

            {/* cute blueprint */}
            <div className="mt-6 grid grid-cols-6 gap-1 rounded-xl bg-black/40 p-3 ring-1 ring-white/10">
              {Array.from({ length: 36 }).map((_, i) => {
                const active = (mods.length + i) % 7 === 0 // decorative highlight
                return (
                  <div
                    key={i}
                    className={[
                      'aspect-square rounded-sm',
                      active ? 'bg-emerald-500/20' : 'bg-white/5'
                    ].join(' ')}
                  />
                )
              })}
            </div>
          </div>

          {/* Totals */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-300">Selected modules: <b>{totals.count}</b></div>
            <div className="mt-3 space-y-2 text-emerald-200">
              <div>Estimated carbon: <b>{totals.co2} kg CO₂</b> (negative = net captured)</div>
              <div>Estimated energy savings: <b>{totals.energy}% / year</b></div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={vote} className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300">
                👍 Vote ({votes})
              </button>
              <button
                onClick={() => { setMods([]); if (typeof window!=='undefined') localStorage.removeItem(LS) }}
                className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5 text-zinc-200"
              >
                Reset
              </button>
            </div>
            <div className="mt-3 text-xs text-zinc-400">
              Demo math only; real outcomes vary with area, climate, materials, and build specs.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}