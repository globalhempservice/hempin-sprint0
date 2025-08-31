// pages/events/index.tsx
import Link from 'next/link'
import Head from 'next/head'
import PublicShell from '../../components/PublicShell'

export default function EventsHub() {
  return (
    <PublicShell>
      <Head><title>Events • HEMP’IN</title></Head>

      {/* Hero – Bangkok spotlight */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-cyan-600/10 to-fuchsia-600/10 p-8 ring-1 ring-white/5">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white">HEMP’IN Showroom • Bangkok</h1>
          <p className="mt-3 text-zinc-300">
            Join our pop-up showroom: brands, buyers, creators — one room, high signal. Limited slots.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/events/bangkoklanding" className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500/90">
              Explore the Bangkok Showroom
            </Link>
            <Link href="/supermarket" className="rounded-lg border border-emerald-400/30 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/10">
              Buy the showroom kit
            </Link>
          </div>
        </div>
      </section>

      {/* Calendar/DB placeholder */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Global hemp & cannabis events</h2>
          <span className="text-xs text-zinc-400">Coming soon — live calendar & submissions</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {['Berlin Expo', 'Oregon Cultivation Summit', 'Bangkok Innovation Week', 'Barcelona Hemp Week', 'NYC Materials Forum', 'Global Sustainability Congress'].map(
            (name, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{name}</h3>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-zinc-300">TBA</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                  Placeholder entry. The hub will aggregate dates, locations, partners, and ticket links.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </PublicShell>
  )
}