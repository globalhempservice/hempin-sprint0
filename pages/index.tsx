// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Teaser = { key: string; title: string; blurb: string; href: string; emoji: string }

const TEASERS: Teaser[] = [
  { key: 'supermarket', title: 'Supermarket', blurb: 'Browse hemp brands, gear, and materials.', href: '/supermarket', emoji: '🛒' },
  { key: 'trade',       title: 'Trade',       blurb: 'RFQs, suppliers, and B2B matchmaking.',   href: '/trade',       emoji: '🤝' },
  { key: 'events',      title: 'Events',      blurb: 'Fairs, meetups, conferences, tickets.',    href: '/events',      emoji: '🎟️' },
  { key: 'research',    title: 'Research',    blurb: 'Labs, studies, and collaborative science.',href: '/research',    emoji: '🔬' },
  { key: 'experiments', title: 'Experiments', blurb: 'Playground for wild prototypes.',          href: '/experiments', emoji: '🧪' },
]

export default function Home() {
  const [ctaHref, setCtaHref] = useState('/onboarding')

  useEffect(() => {
    // If there is no session, we’ll let /onboarding guard redirect to /signin anyway.
    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) setCtaHref('/onboarding') // unchanged; onboarding will route to sign-in
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Head>
        <title>HEMPIN • The Hemp Metaverse</title>
        <meta name="description" content="Join the hemp movement. Build your brand, trade, research, and create." />
      </Head>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 bg-gradient-to-br from-emerald-400/20 via-emerald-300/10 to-cyan-400/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide">
              <span className="opacity-70">NEW</span>
              <span>Glassy profile + modules</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Grow your impact in the <span className="text-emerald-300">hemp</span> universe
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--text-2)]">
              HEMPIN is your mothership for brands, trade, research, and events.
              Earn leaves (🌿) as you build. Unlock modules. Co-create a regenerative economy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ctaHref}
                className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 font-medium backdrop-blur hover:bg-emerald-400/20"
              >
                Start your journey
              </Link>
              <Link
                href="/supermarket"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur hover:bg-white/10"
              >
                Explore products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universes */}
      <section className="mx-auto max-w-7xl px-4 pb-28">
        <h2 className="mb-6 text-xl font-medium opacity-80">Universes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TEASERS.map(t => (
            <Link
              key={t.key}
              href={t.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-content-center rounded-xl border border-white/10 bg-white/5">
                  <span className="text-lg">{t.emoji}</span>
                </div>
                <div>
                  <div className="text-lg font-medium">{t.title}</div>
                  <div className="text-sm text-[var(--text-2)]">{t.blurb}</div>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-70">
                Enable modules during onboarding—your profile becomes your RPG sheet.
              </div>
              <div className="mt-4 text-emerald-300/80 opacity-0 transition group-hover:opacity-100">
                Enter →
              </div>
            </Link>
          ))}
        </div>

        {/* Why HEMPIN */}
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {[
            { title: 'Consumer-friendly', body: 'Instant rewards, clean UI, and a glassy dark vibe that respects your attention.' },
            { title: 'Pro-grade modules', body: 'Directories, RFQs, events, research, and vendor tools that actually work.' },
            { title: 'Regenerative mission', body: 'Track contributions, celebrate badges, and see your impact add up.' },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-base font-medium">{b.title}</div>
              <div className="mt-2 text-sm text-[var(--text-2)]">{b.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}