// pages/invest/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

// Simple local target; you can wire this to Supabase later.
const FUNDING_TARGET_CENTS = 5000 * 100

const TIERS = [
  { amount: 25,  label: 'Supporter',  perks: ['Investor badge', 'Thank-you in release notes'] },
  { amount: 50,  label: 'Backer',     perks: ['Badge + early feature access'] },
  { amount: 100, label: 'Champion',   perks: ['Badge + early access + limited merch'] },
  { amount: 250, label: 'Angel Ally', perks: ['All above + private product updates'] },
] as const

export default function InvestPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // TODO wire with real data (e.g., sum of successful PayPal orders)
  const [raisedCents, setRaisedCents] = useState(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!alive) return
      setSession(data.session ?? null)
      setLoading(false)
    })()
    // Optional: live updates
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null)
    })
    return () => {
      alive = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  const progressPct = useMemo(() => {
    const pct = (raisedCents / FUNDING_TARGET_CENTS) * 100
    return Math.max(0, Math.min(100, Math.round(pct)))
  }, [raisedCents])

  return (
    <>
      <Head>
        <title>Invest • HEMPIN</title>
        <meta name="description" content="Contribute to HEMPIN and unlock badges, perks, and early features." />
      </Head>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Hero */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">Invest in HEMPIN</h1>
          <p className="mt-2 max-w-2xl text-zinc-300">
            Friends & family round (target: <strong>$5,000</strong>). Your contribution helps us ship the
            consumer marketplace, pro tools, and climate-friendly rewards.
          </p>
        </header>

        {/* Progress */}
        <section className="card mb-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-wide opacity-70">Progress</div>
              <div className="text-2xl font-bold mt-1">
                ${(raisedCents / 100).toLocaleString()} <span className="text-sm opacity-70">of $5,000</span>
              </div>
            </div>
            <div className="text-sm opacity-70">Goal: Friday</div>
          </div>
          <div className="mt-4 h-3 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-[width] duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Gated contribution section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-3">Contribution tiers</h2>

          {!session ? (
            <div className="rounded-2xl border border-white/10 p-8 text-center">
              <div className="text-lg font-semibold">Sign in to contribute</div>
              <p className="mt-2 text-zinc-300">
                Create your account to unlock contribution tiers, badges, and private updates.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <Link
                  href={`/signin?next=${encodeURIComponent('/invest')}`}
                  className="btn btn-primary"
                >
                  Sign in / Create account
                </Link>
                <Link href="/" className="btn btn-outline">Back to homepage</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {TIERS.map((t) => (
                  <div key={t.amount} className="rounded-2xl border border-white/10 p-5 bg-white/[0.02]">
                    <div className="text-2xl font-bold">
                      ${t.amount.toLocaleString()}
                    </div>
                    <div className="text-zinc-300">{t.label}</div>
                    <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                      {t.perks.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" /> {p}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      {/* Replace this with your PayPal checkout flow later */}
                      <button
                        className="btn btn-primary w-full"
                        onClick={() => alert(`Stub: contribute $${t.amount}. Wire later to PayPal flow.`)}
                      >
                        Contribute ${t.amount}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                * Perks are delivered as account badges + email updates. We’ll wire payments to PayPal capture later.
              </p>
            </>
          )}
        </section>

        {/* Legal / SAFE section */}
        <section className="card">
          <div className="md:flex md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold">Looking for formal terms?</h3>
              <p className="mt-1 text-zinc-300">
                Review our investor page with roadmap, ambition, and a lightweight SAFE proposal you can edit and send.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/investor/safe" className="btn btn-outline">
                Open investor / SAFE page
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}