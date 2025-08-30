// pages/experiments/dao-simulator.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

type Proposal = {
  id: string
  title: string
  description: string
}

export default function DaoSimulator() {
  const proposals: Proposal[] = useMemo(
    () => [
      { id: 'p1', title: 'Fund soil-health microgrants', description: 'Direct 5% of treasury to soil testing and farmer trainings.' },
      { id: 'p2', title: 'Back a hemp denim pilot',       description: 'Prototype hemp/cotton blend with open-source spec.' },
      { id: 'p3', title: 'Offset HEMPIN event travel',    description: 'Buy high-quality offsets for our next meetup.' },
    ],
    []
  )

  const [balance, setBalance] = useState<number>(0)
  const [votes, setVotes] = useState<Record<string, number>>({})

  // fake token balance persisted to localStorage
  useEffect(() => {
    const k = 'lab.dao.balance'
    const existing = localStorage.getItem(k)
    if (existing) setBalance(parseInt(existing, 10))
    else {
      const b = 100 + Math.floor(Math.random() * 400) // 100–499
      setBalance(b)
      localStorage.setItem(k, String(b))
    }
  }, [])

  useEffect(() => {
    const k = 'lab.dao.votes'
    const raw = localStorage.getItem(k)
    if (raw) setVotes(JSON.parse(raw))
  }, [])

  useEffect(() => {
    localStorage.setItem('lab.dao.votes', JSON.stringify(votes))
  }, [votes])

  const used = Object.values(votes).reduce((a, b) => a + (b || 0), 0)
  const remaining = Math.max(0, balance - used)

  const cast = (id: string, delta: number) => {
    setVotes(v => {
      const next = { ...v, [id]: Math.max(0, (v[id] || 0) + delta) }
      const total = Object.values(next).reduce((a, b) => a + b, 0)
      if (total > balance) return v // prevent exceeding balance
      return next
    })
  }

  return (
    <>
      <Head><title>Hemp DAO Simulator • HEMPIN Lab</title></Head>

      <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">🗳️ Hemp DAO Simulator</h1>
        <p className="mt-2 text-zinc-400">Allocate your fake tokens across proposals. Nothing on-chain—just vibes.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">Your balance</div>
            <div className="mt-1 text-3xl font-semibold">{balance} HEMP</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">Remaining</div>
            <div className="mt-1 text-3xl font-semibold">{remaining} HEMP</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {proposals.map(p => {
            const v = votes[p.id] || 0
            const pct = balance ? Math.round((v / balance) * 100) : 0
            return (
              <section key={p.id} className="rounded-2xl border border-white/10 p-5">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">{p.description}</p>

                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400/60" style={{ width: `${pct}%` }} />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => cast(p.id, -5)} className="btn btn-outline">−5</button>
                  <button onClick={() => cast(p.id, -1)} className="btn btn-outline">−1</button>
                  <span className="mx-2 text-sm text-zinc-300">Allocated: <strong>{v}</strong></span>
                  <button onClick={() => cast(p.id, +1)} className="btn btn-primary">+1</button>
                  <button onClick={() => cast(p.id, +5)} className="btn btn-primary">+5</button>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}