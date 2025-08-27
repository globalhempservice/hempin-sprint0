// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Countdown from '../components/Countdown'

export default function Home() {
  const target = '2025-11-01T10:00:00+07:00'

  return (
    <>
      <Head>
        <title>Hemp’in — Build your hemp brand, fast.</title>
        <meta name="description" content="Hemp’in is the easiest way to launch and showcase hemp brands — with pop-ups, product pages, and a curated marketplace." />
        <meta property="og:title" content="Hemp’in — Build your hemp brand, fast." />
        <meta property="og:description" content="Teaser: Bangkok 2025 pop-up. Launch countdown. Join early." />
      </Head>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(52,211,153,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              🌱 Hemp’in Preview • Bangkok 2025 pop-up
            </span>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Build your <span className="text-emerald-400">hemp brand</span> and sell with confidence
            </h1>

            <p className="mt-5 max-w-2xl text-zinc-400">
              Pages, payments, pop-ups, and a curated marketplace — all-in-one. We’re opening with a special
              pop-up in Bangkok this November.
            </p>

            <div className="mt-7">
              <Countdown target={target} label="Launch in" />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-emerald-950 hover:bg-emerald-400"
              >
                Explore kits & slots
              </Link>
              <Link
                href="/account"
                className="rounded-xl border border-zinc-700 px-5 py-3 font-medium hover:border-zinc-500"
              >
                Create your brand page
              </Link>
              <Link
                href="/brand"
                className="rounded-xl border border-zinc-700 px-5 py-3 font-medium hover:border-zinc-500"
              >
                What a brand page looks like
              </Link>
            </div>

            <div className="mt-8 text-xs text-zinc-500">
              Kit ordering closes <strong>Oct 15</strong>. Shipping deadline <strong>Oct 25</strong>.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
