// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function Home() {
  return (
    <>
      <Head>
        <title>HEMPIN — Grow the Hemp Ecosystem</title>
        <meta name="description" content="Trade, Supermarket, Events, Research and playful Experiments—one open platform for the hemp ecosystem." />
      </Head>

      {/* Global shell */}
      <div className="min-h-screen bg-black text-white flex flex-col">
        <SiteNav />

        <main className="flex-1">
          {/* HERO */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(16,185,129,0.15),transparent_60%)]" />
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <div className="pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Build the future of <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-violet-400 bg-clip-text text-transparent">hemp</span>
                  </h1>
                  <p className="mt-4 text-zinc-300 md:text-lg max-w-xl">
                    HEMPIN unifies creators, brands and communities across
                    Trade, the consumer Supermarket, global Events, open Research, and playful Experiments.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/experiments" className="btn btn-primary">
                      Explore Experiments
                    </Link>
                    <Link href="/supermarket" className="btn btn-secondary">
                      Browse Supermarket
                    </Link>
                    <Link href="/trade" className="btn btn-ghost">
                      Open Trade
                    </Link>
                  </div>

                  <p className="mt-4 text-sm text-zinc-400">
                    New here? <Link className="underline hover:text-white" href="/signin">Sign in</Link> or{' '}
                    <Link className="underline hover:text-white" href="/signup">Create an account</Link>
                  </p>
                </div>

                {/* Right promo rail (universes quick links) */}
                <div className="grid gap-4">
                  <UniverseCard
                    href="/trade"
                    title="Trade"
                    desc="B2B listings, buyers & suppliers, materials and services."
                    badge="B2B"
                    className="from-blue-600/20 to-cyan-500/10 ring-blue-400/25"
                    pillClass="bg-blue-600/20 text-blue-300"
                  />
                  <UniverseCard
                    href="/supermarket"
                    title="Supermarket"
                    desc="Consumer marketplace for hemp goods—brands, SKUs, kits."
                    badge="B2C"
                    className="from-violet-600/20 to-fuchsia-500/10 ring-violet-400/25"
                    pillClass="bg-violet-600/20 text-violet-300"
                  />
                  <UniverseCard
                    href="/events"
                    title="Events"
                    desc="Global calendar. Spotlight: Bangkok Showroom kit."
                    badge="IRL"
                    className="from-orange-600/20 to-amber-500/10 ring-orange-400/25"
                    pillClass="bg-orange-600/20 text-orange-300"
                  />
                  <UniverseCard
                    href="/research"
                    title="Research (Wiki)"
                    desc="Literature, studies, data: an open, curated knowledge hub."
                    badge="Open"
                    className="from-teal-500/20 to-emerald-500/10 ring-teal-400/30"
                    pillClass="bg-teal-600/20 text-teal-300"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE STRIP — rainbow experiments */}
          <section className="border-t border-white/10 bg-gradient-to-r from-emerald-900/20 via-blue-900/10 to-violet-900/20">
            <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-semibold">Playground Experiments</h2>
                <Link href="/experiments" className="text-sm text-zinc-300 hover:text-white underline">
                  View all
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ExperimentCard
                  href="/experiments/planetagotchi"
                  title="Planetagotchi"
                  desc="Care for a tiny world. Balance energy, soil, water & biodiversity."
                  gradient="from-emerald-500/30 to-sky-500/30"
                />
                <ExperimentCard
                  href="/experiments/jackpot"
                  title="Hemp Jackpot"
                  desc="Spin for community coupons & swag drops."
                  gradient="from-violet-500/30 to-fuchsia-500/30"
                />
                <ExperimentCard
                  href="/experiments/coupons"
                  title="Coupon Studio"
                  desc="Mint, redeem, gift—prototype promo rails."
                  gradient="from-amber-500/30 to-rose-500/30"
                />
                <ExperimentCard
                  href="/experiments/lca"
                  title="LCA Builder"
                  desc="Lightweight lifecycle data collection (level 2)."
                  gradient="from-teal-500/30 to-emerald-500/30"
                />
              </div>
            </div>
          </section>

          {/* SHOWROOM PROMO (Bangkok under Events) */}
          <section className="relative">
            <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/30">
                  Events • Spotlight
                </span>
                <h3 className="mt-3 text-3xl md:text-4xl font-bold">Bangkok Hempin Showroom</h3>
                <p className="mt-3 text-zinc-300">
                  Be featured IRL. Book the showroom kit, demo your products, and
                  meet buyers. Seamless flow from kit purchase to activation.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/events" className="btn btn-secondary">Explore Events</Link>
                  <Link href="/bangkoklanding" className="btn btn-primary">View Bangkok kit</Link>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-gradient-to-br from-orange-500/10 to-rose-500/10 p-1">
                <div className="aspect-[16/10] rounded-2xl bg-[url('/images/bangkok-hero.jpg')] bg-cover bg-center" />
              </div>
            </div>
          </section>

          {/* CTA STRIP */}
          <section className="border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
              <MiniCTA
                title="For brands"
                desc="Set up your page, add products and pick a kit."
                href="/experiments/brand-preview"
                color="emerald"
              />
              <MiniCTA
                title="For makers"
                desc="List materials & services on Trade."
                href="/trade"
                color="blue"
              />
              <MiniCTA
                title="For community"
                desc="Play, vote, and co-create in Experiments."
                href="/experiments"
                color="violet"
              />
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  )
}

/* ---------- small presentational helpers ---------- */

function UniverseCard({
  href,
  title,
  desc,
  badge,
  className,
  pillClass,
}: {
  href: string
  title: string
  desc: string
  badge: string
  className: string
  pillClass: string
}) {
  return (
    <Link
      href={href}
      className={[
        'group rounded-2xl p-5 ring-1 transition',
        'bg-gradient-to-br hover:ring-white/30 hover:translate-y-[-2px]',
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={['text-[11px] px-2 py-1 rounded-full ring-1', pillClass, 'ring-current/30'].join(' ')}>
          {badge}
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-300">{desc}</p>
      <div className="mt-3 text-sm text-zinc-400 group-hover:text-white underline">Open →</div>
    </Link>
  )
}

function ExperimentCard({
  href,
  title,
  desc,
  gradient,
}: {
  href: string
  title: string
  desc: string
  gradient: string
}) {
  return (
    <Link
      href={href}
      className={[
        'block rounded-2xl p-5 ring-1 ring-white/10',
        'bg-gradient-to-br hover:ring-white/30 hover:translate-y-[-2px] transition',
        gradient,
      ].join(' ')}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-300">{desc}</p>
      <div className="mt-3 text-sm text-zinc-400 underline">Try it →</div>
    </Link>
  )
}

function MiniCTA({
  title, desc, href, color,
}: {
  title: string
  desc: string
  href: string
  color: 'emerald' | 'blue' | 'violet'
}) {
  const ring = color === 'emerald' ? 'ring-emerald-400/30' : color === 'blue' ? 'ring-blue-400/30' : 'ring-violet-400/30'
  const bg = color === 'emerald' ? 'from-emerald-500/10 to-teal-500/10'
    : color === 'blue' ? 'from-blue-600/10 to-cyan-500/10'
    : 'from-violet-600/10 to-fuchsia-500/10'
  return (
    <Link href={href} className={['rounded-2xl p-5 ring-1 hover:ring-white/30 transition bg-gradient-to-br', ring, bg].join(' ')}>
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-zinc-300">{desc}</p>
      <div className="mt-3 text-sm text-zinc-400 underline">Go →</div>
    </Link>
  )
}