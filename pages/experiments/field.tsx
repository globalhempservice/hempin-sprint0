// pages/experiments/field.tsx
import { useEffect, useState } from 'react'
const GRID_W = 8
const GRID_H = 6
const LS_STATE = 'exp.field.grid.v1'
const LS_STATS = 'exp.field.stats.v1'
const LS_VOTES = 'exp.field.votes.v1'

// cell stages: 0 empty, 1 seed, 2 growing, 3 ready
type Stats = { fiber: number; seed: number; hurd: number }

function loadJSON<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : def
  } catch { return def }
}
function saveJSON(key: string, v: any) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(v))
}

export default function Field() {
  const [grid, setGrid] = useState<number[]>(() =>
    loadJSON(LS_STATE, Array(GRID_W*GRID_H).fill(0))
  )
  const [stats, setStats] = useState<Stats>(() =>
    loadJSON<Stats>(LS_STATS, { fiber: 0, seed: 0, hurd: 0 })
  )
  const [votes, setVotes] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const v = localStorage.getItem(LS_VOTES)
    return v ? Number(v) : 0
  })

  useEffect(() => saveJSON(LS_STATE, grid), [grid])
  useEffect(() => saveJSON(LS_STATS, stats), [stats])

  const plantAll = () => setGrid(g => g.map(x => (x === 0 ? 1 : x)))
  const grow = () => setGrid(g => g.map(x => (x>0 && x<3 ? x+1 : x)))
  const harvest = () => {
    let ready = 0
    grid.forEach(x => { if (x === 3) ready++ })
    if (!ready) return

    // super simple yields per ready plant:
    const add: Stats = {
      fiber: ready * 0.8,
      seed:  ready * 0.4,
      hurd:  ready * 1.2,
    }
    setStats(s => ({
      fiber: Number((s.fiber + add.fiber).toFixed(1)),
      seed:  Number((s.seed  + add.seed ).toFixed(1)),
      hurd:  Number((s.hurd  + add.hurd ).toFixed(1)),
    }))
    setGrid(g => g.map(x => (x === 3 ? 0 : x)))
  }

  const toggle = (i: number) => {
    setGrid(g => {
      const next = g.slice()
      next[i] = (next[i] + 1) % 4
      return next
    })
  }

  const vote = () => {
    const v = votes + 1
    setVotes(v)
    if (typeof window !== 'undefined') localStorage.setItem(LS_VOTES, String(v))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-zinc-900 to-black text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-extrabold">Grow Your Hemp Field</h1>
        <p className="mt-2 text-zinc-300">
          Plant, grow, harvest. See rough output of fiber/seed/hurd (educational demo only).
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={plantAll} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black">Plant all</button>
          <button onClick={grow} className="rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5">Grow</button>
          <button onClick={harvest} className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300">Harvest</button>
          <button onClick={vote} className="ml-auto rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-emerald-300">👍 Vote ({votes})</button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-[1fr,360px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${GRID_W}, minmax(0,1fr))` }}
            >
              {grid.map((v, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={[
                    'aspect-square border border-white/10 transition',
                    v === 0 && 'bg-zinc-900 hover:bg-zinc-800',
                    v === 1 && 'bg-emerald-900/60 hover:bg-emerald-800/60',
                    v === 2 && 'bg-emerald-700/60 hover:bg-emerald-600/60',
                    v === 3 && 'bg-emerald-500/60 hover:bg-emerald-500/70',
                  ].join(' ')}
                  aria-label="toggle cell"
                  title={v===0?'Empty':v===1?'Seed':v===2?'Growing':'Ready'}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-zinc-300">Outputs (demo):</div>
            <div className="mt-2 space-y-2 text-emerald-200">
              <div>Fiber: <b>{stats.fiber.toFixed(1)}</b> units</div>
              <div>Seed: <b>{stats.seed.toFixed(1)}</b> units</div>
              <div>Hurd: <b>{stats.hurd.toFixed(1)}</b> units</div>
            </div>
            <div className="mt-4 text-xs text-zinc-400">
              Tip: click individual squares to cycle Empty → Seed → Growing → Ready → Empty.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}