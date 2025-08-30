// pages/experiments/lifestyle-wallet.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'

type Tx = { id: string; partner: string; note: string; delta: number; ts: number }

const PARTNERS = ['Hemp Cafe', 'BikeShare', 'Refill Store', 'Farmers Market', 'Train Ticket'] as const

export default function LifestyleWallet() {
  const [balance, setBalance] = useState(5) // kg CO₂e saved
  const [txs, setTxs] = useState<Tx[]>([])
  const [partner, setPartner] = useState<typeof PARTNERS[number]>('Hemp Cafe')
  const [note, setNote] = useState('')
  const [delta, setDelta] = useState(1)

  // load/save
  useEffect(() => {
    const b = localStorage.getItem('lab.wallet.balance')
    const t = localStorage.getItem('lab.wallet.txs')
    if (b) setBalance(parseFloat(b))
    if (t) setTxs(JSON.parse(t))
  }, [])
  useEffect(() => localStorage.setItem('lab.wallet.balance', String(balance)), [balance])
  useEffect(() => localStorage.setItem('lab.wallet.txs', JSON.stringify(txs)), [txs])

  const add = () => {
    const tx: Tx = { id: Math.random().toString(36).slice(2), partner, note, delta, ts: Date.now() }
    setTxs([tx, ...txs])
    setBalance(b => Math.max(0, b + delta))
    setNote('')
    setDelta(1)
  }

  const redeemable = useMemo(() => Math.floor(balance / 10), [balance]) // 1 reward per 10 kg
  const redeem = () => {
    if (redeemable <= 0) return
    setBalance(b => b - 10)
    alert('Redeemed: 1 Green Perk (demo)')
  }

  return (
    <>
      <Head><title>Lifestyle CO₂ Wallet • HEMPIN Lab</title></Head>
      <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
        <h1 className="text-2xl font-bold">💳 Lifestyle CO₂ Wallet</h1>
        <p className="mt-2 text-zinc-400">Track small actions and redeem perks every 10 kg saved (demo only).</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">Balance</div>
            <div className="mt-1 text-3xl font-semibold">{balance.toFixed(1)} kg</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <div className="text-sm text-zinc-400">Redeemable</div>
            <div className="mt-1 text-3xl font-semibold">{redeemable}</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <button className="btn btn-primary w-full" onClick={redeem} disabled={redeemable <= 0}>
              Redeem perk
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 p-5">
          <div className="grid gap-3 sm:grid-cols-[200px,1fr,140px,120px]">
            <select className="rounded-md bg-white/5 px-3 py-2" value={partner} onChange={e => setPartner(e.target.value as any)}>
              {PARTNERS.map(p => <option key={p}>{p}</option>)}
            </select>
            <input className="rounded-md bg-white/5 px-3 py-2" placeholder="note (optional)" value={note} onChange={e => setNote(e.target.value)} />
            <input type="number" className="rounded-md bg-white/5 px-3 py-2" value={delta} onChange={e => setDelta(parseFloat(e.target.value || '0'))} />
            <button className="btn btn-primary" onClick={add}>Add</button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {txs.length === 0 && <div className="text-zinc-500">No activity yet.</div>}
          {txs.map(tx => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div>
                <div className="font-medium">{tx.partner}</div>
                <div className="text-zinc-400">{tx.note || '—'}</div>
              </div>
              <div className={tx.delta >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {tx.delta >= 0 ? '+' : ''}{tx.delta} kg
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}