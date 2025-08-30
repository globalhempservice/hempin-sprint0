// pages/experiments/city-builder.tsx
import Head from 'next/head'
import { useMemo, useState } from 'react'

const SIZE = 6
type Cell = 'empty' | 'farm' | 'mill' | 'lab' | 'park'
const PALETTE: Record<Cell, string> = {
  empty: 'bg-white/5',
  farm: 'bg-emerald-600/40',
  mill: 'bg-amber-600/40',
  lab: 'bg-sky-600/40',
  park: 'bg-lime-500/40',
}

export default function CityBuilder() {
  const [grid, setGrid] = useState<Cell[]>(() => Array(SIZE * SIZE).fill('empty'))
  const [tool, setTool] = useState<Cell>('farm')

  const score = useMemo(() => {
    // simple scoring: farms next to parks +1, mills next to labs +1, each empty -0.1
    const idx = (r: number, c: number) => r * SIZE + c
    let s = 0
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = grid[idx(r, c)]
        if (cell === 'empty') { s -= 0.1; continue }
        const neighbors = [
          r > 0 ? grid[idx(r - 1, c)] : null,
          r < SIZE - 1 ? grid[idx(r + 1, c)] : null,
          c > 0 ? grid[idx(r, c - 1)] : null,
          c < SIZE - 1 ? grid[idx(r, c + 1)] : null,
        ]
        if (cell === 'farm' && neighbors.includes('park')) s += 1
        if (cell === 'mill' && neighbors.includes('lab')) s += 1
        if (cell === 'park') s += 0.2
        if (cell === 'lab') s += 0.3
      }
    }
    return Math.max(0, Math.round(s * 10) / 10)
  }, [grid])

  const place = (i: number) => {
    setGrid(g => g.map((v, idx) => (idx === i ? (v === tool ? 'empty' : tool) : v)))
  }

  const reset = () => setGrid(Array(SIZE * SIZE).fill('empty'))

  return (
    <>
      <Head><title>Future Hemp City Builder • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🏙️ Future Hemp City Builder</h1>
          <button className="btn btn-outline" onClick={reset}>Reset</button>
        </div>
        <p className="mt-2 text-zinc-400">Place farms, mills, labs, and parks. Optimize the <em>resilience score</em>.</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {(['farm','mill','lab','park'] as Cell[]).map(t => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={[
                'rounded-xl border px-3 py-2 text-sm capitalize',
                tool === t ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/10 bg-white/5'
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-6 gap-2">
          {grid.map((cell, i) => (
            <button
              key={i}
              onClick={() => place(i)}
              className={[
                'aspect-square rounded-lg border',
                PALETTE[cell],
                cell === 'empty' ? 'border-white/10' : 'border-white/20'
              ].join(' ')}
              title={cell}
            />
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 p-4">
          <div className="text-sm text-zinc-400">Resilience score</div>
          <div className="mt-1 text-3xl font-semibold">{score}</div>
          <p className="mt-2 text-xs text-zinc-500">Farms love nearby parks. Mills love nearby labs.</p>
        </div>
      </div>
    </>
  )
}