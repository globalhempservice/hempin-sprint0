// pages/impactverse.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactElement } from 'react'

type NodeDef = {
  id: string
  title: string
  href: string
  blurb: string
  hue: number
  x: number // 0..100 (%)
  y: number // 0..100 (%)
  icon: (props: { className?: string }) => ReactElement
}

// ---- minimal, inline icon set (no external deps) ----
const ICON = {
  cart: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h7.9a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  ),
  swap: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M7 7h12l-3-3M17 17H5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  book: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  file: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  beaker: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M9 3v5L4 20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2L15 8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  building: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 21h16V7l-8-4-8 4v14Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  leaf: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M20 4s-12 0-16 8c-2 4 1 8 5 8 8 0 11-12 11-16Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 21C10 13 14 8 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

// ---- nodes definition (positions are % of container) ----
const NODES: NodeDef[] = [
  { id: 'supermarket', title: 'Supermarket', href: '/supermarket', blurb: 'Consumer marketplace preview', hue: 150, x: 18, y: 40, icon: ICON.cart },
  { id: 'trade',       title: 'Trade',       href: '/trade',       blurb: 'B2B raw & inputs exchange', hue: 200, x: 34, y: 18, icon: ICON.swap },
  { id: 'research',    title: 'Research',    href: '/research',    blurb: 'Papers, datasets, findings', hue: 260, x: 60, y: 22, icon: ICON.book },
  { id: 'wiki',        title: 'Wiki',        href: '/wiki',        blurb: 'Legal & institutional hub', hue: 0,   x: 78, y: 40, icon: ICON.file },
  { id: 'experiments', title: 'Experiments', href: '/experiments', blurb: 'Arcade of prototypes',       hue: 40,  x: 68, y: 70, icon: ICON.beaker },
  { id: 'showroom',    title: 'Showroom BKK',href: '/bangkoklanding', blurb: 'Bangkok pop-up teaser',  hue: 320, x: 42, y: 78, icon: ICON.building },
  { id: 'lca',         title: 'LCA Lab',     href: '/lca-lab',     blurb: 'Lifecycle impact sandbox',  hue: 110, x: 26, y: 65, icon: ICON.leaf },
]

// localStorage helpers for upvotes (no auth required)
const getVotes = (): Record<string, number> => {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem('hempin:votes') || '{}') } catch { return {} }
}
const setVotes = (v: Record<string, number>) => {
  if (typeof window !== 'undefined') localStorage.setItem('hempin:votes', JSON.stringify(v))
}

export default function Impactverse() {
  const [votes, setVotesState] = useState<Record<string, number>>({})
  useEffect(() => { setVotesState(getVotes()) }, [])
  const upvote = (id: string) => {
    const next = { ...votes, [id]: (votes[id] || 0) + 1 }
    setVotes(next); setVotesState(next)
  }

  const sorted = useMemo(
    () => [...NODES].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)),
    [votes]
  )

  return (
    <>
      <Head>
        <title>Impactverse • HEMPIN</title>
        <meta name="description" content="Explore the Hemp Impactverse — a living map of features and prototypes." />
      </Head>

      <main className="relative min-h-screen overflow-hidden bg-[#06070a] text-white">
        {/* background layers */}
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_50%_30%,rgba(32,128,64,.35),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(64,64,128,.35),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:radial-gradient(1px_1px_at_1px_1px,rgba(255,255,255,.8),transparent_0)] [background-size:20px_20px]" />

        {/* hero */}
        <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            live prototype • vote what ships next
          </div>

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Welcome to the <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">Hemp Impactverse</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            A unified map of everything we’re building: marketplace, trade, research, wiki, labs, and the Bangkok showroom.
            Click a node, explore, and upvote your favorites.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/experiments" className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
              Open Experiments Arcade
            </Link>
            <Link href="/account" className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/90 hover:bg-white/10">
              Go to Account
            </Link>
          </div>
        </section>

        {/* map */}
        <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-20 md:grid-cols-[1.1fr_.9fr]">
          {/* left: orbital map */}
          <div className="relative h-[520px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur">
            <div className="relative h-full w-full rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,.4),transparent_70%)]">
              {/* orbit rings */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

              {/* center core */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-gradient-to-b from-emerald-400/30 to-sky-400/20" />

              {/* floating nodes */}
              {NODES.map(n => (
                <Link
                  key={n.id}
                  href={n.href}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div
                    className="rounded-2xl border border-white/10 bg-black/40 p-3 shadow-lg backdrop-blur transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-white/20"
                    style={{ boxShadow: `0 0 0 1px hsla(${n.hue},80%,60%,.15)` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-xl text-white"
                        style={{ background: `linear-gradient(135deg, hsla(${n.hue},80%,45%,.35), hsla(${n.hue},80%,60%,.2))` }}
                      >
                        <n.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="text-xs text-white/70">{n.blurb}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); const next = { ...votes, [n.id]: (votes[n.id] || 0) + 1 }; setVotes(next); setVotesState(next) }}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                      aria-label={`Upvote ${n.title}`}
                    >
                      ▲ {votes[n.id] || 0}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* right: ranked list */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Trending Nodes</h2>
            <ul className="space-y-3">
              {[...NODES].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)).map(n => (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-9 w-9 place-items-center rounded-lg"
                        style={{ background: `linear-gradient(135deg, hsla(${n.hue},80%,45%,.35), hsla(${n.hue},80%,60%,.2))` }}
                      >
                        <n.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{n.title}</div>
                        <div className="text-xs text-white/70">{n.blurb}</div>
                      </div>
                    </div>
                    <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-white/80">
                      ▲ {votes[n.id] || 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-sky-400/10 p-4">
              <div className="text-sm font-semibold">What is this?</div>
              <p className="mt-1 text-sm text-white/80">
                The Impactverse is a unified hub for HEMPIN prototypes. Vote to help us choose what becomes a full feature next.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href="/experiments" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90">
                  Explore Experiments
                </Link>
                <Link href="/" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* subtle animated haze */}
        <div className="pointer-events-none absolute -left-40 top-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-1/4 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </main>

      {/* small CSS helpers for float */}
      <style jsx global>{`
        @keyframes floaty { 0% { transform: translateY(0px) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0px) } }
        a.group { animation: floaty 6s ease-in-out infinite; }
      `}</style>
    </>
  )
}