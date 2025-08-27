// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import Countdown from '../components/Countdown'

export default function Home() {
  // Nov 1, 2025 at 10:00 Bangkok time (UTC+7). Change if you like.
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
                href="/account/brand"
                className="rounded-xl border border-zinc-700 px-5 py-3 font-medium hover:border-zinc-500"
              >
                Create your brand page
              </Link>
            </div>

            <div className="mt-8 text-xs text-zinc-500">
              Kit ordering closes <strong>Oct 15</strong>. Shipping deadline <strong>Oct 25</strong>.
            </div>
          </div>
        </div>
      </section>

      {/* VALUE GRID */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Instant brand pages',
              body: 'Spin up a beautiful page with images, story, and product links — no code.',
            },
            {
              title: 'Built-in payments',
              body: 'Secure checkout via PayPal. Simple pricing; keep what you sell.',
            },
            {
              title: 'Bangkok pop-up 2025',
              body: 'Join our curated physical showcase to meet buyers and fans IRL.',
            },
            {
              title: 'Product slots',
              body: 'Publish, unpublish, and manage a limited number of products per plan.',
            },
            {
              title: 'Moderation & quality',
              body: 'Submissions are reviewed to keep the marketplace clean and trustworthy.',
            },
            {
              title: 'Roadmap',
              body: 'Wholesale tools, creator collabs, analytics, and more rolling out after launch.',
            },
          ].map((c) => (
            <Card key={c.title} title={c.title} body={c.body} />
          ))}
        </div>
      </section>

      {/* BANGKOK FEATURE */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Bangkok Pop-up • November 2025</h2>
              <p className="mt-2 text-zinc-400">
                We’re kicking off with a curated showcase in Bangkok. Book a pop-up kit, ship samples, and get real
                feedback from people who care about mindful materials.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>• Order kits by <strong>Oct 15</strong></li>
                <li>• Ship by <strong>Oct 25</strong></li>
                <li>• Event opens <strong>Nov 1</strong></li>
              </ul>

              <div className="mt-6 flex gap-3">
                <Link href="/shop" className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950">
                  Get a kit
                </Link>
                <Link
                  href="/account/brand"
                  className="rounded-lg border border-zinc-700 px-4 py-2 font-medium hover:border-zinc-500"
                >
                  Claim your brand space
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6">
              <StatRow label="Brands accepted" value="Limited cohort" />
              <StatRow label="Venue" value="Central Bangkok (TBA)" />
              <StatRow label="Audience" value="Design, sustainability, buyers" />
              <StatRow label="Theme" value="Material honesty • Hemp culture" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900/60">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>© {new Date().getFullYear()} Hemp’in</div>
            <div className="flex gap-4">
              <Link className="hover:text-zinc-300" href="/account">Account</Link>
              <Link className="hover:text-zinc-300" href="/admin">Admin</Link>
              <Link className="hover:text-zinc-300" href="/shop">Shop</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800/60 py-3 last:border-b-0">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}