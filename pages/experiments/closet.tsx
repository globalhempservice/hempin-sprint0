// pages/experiments/closet.tsx
import { useEffect, useMemo, useState } from 'react'
const LS = 'exp.closet.state.v1'
const LS_V = 'exp.closet.votes.v1'

// very rough demo numbers vs. cotton equivalents
type Item = { id: string; label: string; waterL: number; co2kg: number }
const ITEMS: Item[] = [
  { id: 'tee',    label: 'Hemp Tee',    waterL: 2700, co2kg: 2.1 },
  { id: 'hoodie', label: 'Hemp Hoodie', waterL: 3900, co2kg: 3.2 },
  { id: 'jeans',  label: 'Hemp Jeans',  waterL: 7500, co2kg: 8.0 },
  { id: 'cap',    label: 'Hemp Cap',    waterL: 800,  co2kg: 0.6 },
]

export default function Closet() {
  const [owned, setOwned] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem(LS) || '[]') } catch { return [] }
  })
  const [votes, setVotes] = useState(() => {
    if (typeof window === 'undefined') return 0
    const v = localStorage.getItem(LS_V); return v ? Number(v) : 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(LS, JSON.stringify(owned))
  }, [owned])

  const toggle = (id: string) => {
    setOwned(arr => arr.includes(id) ? arr.filter(x => x!==id) : [...arr, id])
  }

  const totals = useMemo(() => {
    const picked = ITEMS.filter(i => owned.includes(i.id))
    const water = picked.reduce((a,b)=>a+b.waterL,0)
    const co2   = picked.reduce((a,b)=>a+b.co2kg,0)
    return { water, co2, count: picked.length }
  }, [owned])

  const vote = () => {
    const v = votes + 1
    setVotes(v)
    if (typeof window !== 'undefined') localStorage.setItem(LS_V, String(v))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-black to-emerald-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Hemp Closet</h1>
        <p className="mt-2 text-zinc-300">
          Dress your avatar with hemp items and see rough savings vs. conventional cotton.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px,1fr]">
          {/* Avatar */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid place-items-center">
              <div className="relative h-64 w-40 rounded-2xl bg-gradient-to-b from-emerald-700/30 to-black ring-1 ring-white/10">
                {/* head */}
                <div className="absolute left-1/2 top-6 -translate-x-1/2 h-14 w-14 rounded-full bg-emerald-50/80" />
                {/* body */}
                <div className="absolute left-1/2 top-24 -translate-x-1/2 h-28 w-28 rounded-xl bg-emerald-200/20 ring-1 ring-white/10" />
                {/* items as badges */}
                <div className="absolute inset-x-0 bottom-3 flex flex-wrap justify-center gap-2 text-xs">
                  {owned.map(id => (
                    <span key={id} className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-300 ring-1 ring-emerald-300/30">{id}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 text-sm text-zinc-300">
              Items worn: <b>{totals.count}</b>
            </div>
          </div>

          {/* Picker & stats */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {ITEMS.map(it => {
                const active = owned.includes(it.id)
                return (
                  <button
                    key={it.id}
                    onClick={() => toggle(it.id)}
                    className={[
                      'rounded-xl p-4 text-left ring-1 transition',
                      active
                        ? 'bg-emerald-500/15 text-emerald-200 ring-emerald-300/40'
                        : 'bg-black/50 text-zinc-200 ring-white/10 hover:bg-white/5',
                    ].join(' ')}
                  >
                    <div className="font-semibold">{it.label}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Saves approx. {it.waterL.toLocaleString()}L water, {it.co2kg}kg CO₂
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 rounded-xl bg-black/40 p-4 ring-1 ring-white/10">
              <div className="text-sm text-zinc-300">Estimated total savings (demo):</div>
              <div className="mt-2 text-emerald-200">
                Water: <b>{totals.water.toLocaleString()} L</b> &nbsp;•&nbsp;
                CO₂: <b>{totals.co2.toFixed(1)} kg</b>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={vote} className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300">
                👍 Vote ({votes})
              </button>
              <button
                onClick={()=>{ setOwned([]); if (typeof window!=='undefined') localStorage.removeItem(LS) }}
                className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5 text-zinc-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}