// pages/invest.tsx
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser'

type Tier = { amount: number; label: string; badge: string; perks: string[] }

const GOAL_CENTS = 5000 * 100
const TIERS: Tier[] = [
  { amount: 100,  label: 'Seed Supporter',  badge: '🌱 Seed',  perks: ['Investor badge', 'Name on Supporters Wall (opt-in)'] },
  { amount: 500,  label: 'Early Ally',      badge: '🌿 Sprout', perks: ['Badge + private updates group', 'Early access to betas'] },
  { amount: 1000, label: 'Founding Friend', badge: '🌳 Tree',   perks: ['Badge + VIP showroom invite', 'Personalized certificate'] },
]

type Row = {
  total_cents: number | null
  status: string | null
  paypal_order_id: string | null
}

export default function InvestPage() {
  const { user, session } = useUser()
  const [sumCents, setSumCents] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [lastThanks, setLastThanks] = useState<string | null>(null)

  // load progress from Supabase orders where we tagged INVEST-
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('total_cents,status,paypal_order_id')
          .ilike('paypal_order_id', 'INVEST-%') // safe tag filter
          .eq('status', 'captured')

        if (error) throw error
        const total = (data as Row[] | null)?.reduce((acc, r) => acc + (r.total_cents || 0), 0) ?? 0
        if (alive) setSumCents(total)
      } catch (e: any) {
        if (alive) setError('Could not load progress')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const pct = useMemo(() => Math.min(100, Math.round((sumCents / GOAL_CENTS) * 100)), [sumCents])

  async function contribute(amount: number) {
    if (!user) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/invest/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Contribution failed')
      }
      // optimistic add to progress
      setSumCents(c => c + amount * 100)
      setLastThanks(`Thank you! We recorded your ${amount.toFixed(0)} USD contribution 💚`)
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Head><title>Invest • HEMPIN</title></Head>

      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
            Friends & Family Round
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Fuel the Hempin vision</h1>
          <p className="mt-3 text-zinc-300">
            We’re raising <span className="font-semibold text-white">$5,000</span> to accelerate our next milestones.
            Contribute, get a badge, and join our private updates.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10 rounded-2xl border border-white/10 p-5 bg-gradient-to-b from-emerald-500/10 via-zinc-900/50 to-black/60">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-zinc-400">Progress</div>
              <div className="mt-1 text-2xl font-semibold">
                ${(sumCents / 100).toLocaleString()} <span className="text-base font-normal text-zinc-400">of $5,000</span>
              </div>
            </div>
            <div className="text-emerald-300 text-sm">{pct}%</div>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
              style={{ width: `${pct}%` }}
            />
          </div>
          {loading && <div className="mt-2 text-xs text-zinc-400">Loading progress…</div>}
          {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          {lastThanks && <div className="mt-2 text-sm text-emerald-300">{lastThanks}</div>}
        </div>

        {/* Gated section */}
        {!session ? (
          <div className="rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-lg font-semibold">Sign in to contribute</div>
            <p className="mt-2 text-zinc-300">
              Create your account to unlock contribution tiers, badges, and private updates.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/signin" className="btn btn-primary">Sign in / Create account</Link>
              <Link href="/" className="btn btn-outline">Back to homepage</Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-xl font-bold">Choose a contribution</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {TIERS.map((t) => (
                <div key={t.amount} className="rounded-2xl border border-white/10 p-5 bg-white/5">
                  <div className="text-2xl font-bold">${t.amount.toLocaleString()}</div>
                  <div className="mt-1 text-zinc-300">{t.label}</div>
                  <div className="mt-2 text-emerald-300">{t.badge}</div>
                  <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                    {t.perks.map((p) => <li key={p}>• {p}</li>)}
                  </ul>
                  <button
                    disabled={submitting}
                    onClick={() => contribute(t.amount)}
                    className="btn btn-primary mt-4 w-full"
                  >
                    {submitting ? 'Processing…' : `Contribute $${t.amount}`}
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-zinc-400">
              Note: this friends & family round issues **perks and badges**. If you’d like a formal
              SAFE, ping us and we’ll handle it directly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}