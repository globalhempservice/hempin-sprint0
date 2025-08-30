// pages/supermarket.tsx
import Link from 'next/link'

export default function Supermarket() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-zinc-900/60 to-black/80 px-6 py-16 shadow-lg ring-1 ring-white/5 sm:px-10">
        <div className="max-w-3xl">
          <p className="mb-3 inline-block rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300">
            Preview
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">Hemp Supermarket</h1>
          <p className="mt-4 text-lg text-zinc-300/90">
            A curated consumer marketplace for hemp goods—clean design, verified brands, and simple
            checkout. From wardrobe to wellness to planet-friendly plastics.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/experiments"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              Try our lab demos
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/5"
            >
              Explore features
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </section>

      {/* Value props */}
      <section id="features" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Verified brands', 'Every seller is vetted. Product pages require proofs and labels.'],
          ['One-click checkout', 'PayPal native checkout. Keep what you sell; simple fees.'],
          ['Planet-first filters', 'Shop by impact: CO₂, materials, local radius, and more.'],
          ['Bundles & kits', 'Easy starter kits and “seasonal edits” curated by Hemp’in.'],
          ['Creator collabs', 'Limited drops with artists and eco-designers.'],
          ['Open data labels', 'Plain-language specs + links to certificates when available.'],
        ].map(([title, copy]) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5"
          >
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-zinc-300/90">{copy}</p>
          </div>
        ))}
      </section>

      {/* Featured categories */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Featured categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Wardrobe', 'Tees, denim, workwear, basics'],
            ['Wellness', 'Hemp seed nutrition, care, textiles'],
            ['Home', 'Bedding, towels, paper alternatives'],
            ['Pets', 'Eco-friendly pet textiles & snacks'],
            ['Outdoors', 'Bags, ropes, composites, gear'],
            ['Materials+', 'Bioplastics, biochar products (coming)'],
          ].map(([title, sub]) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 ring-1 ring-white/5 transition hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className="rounded-full border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-300">
                  Preview
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-300/90">{sub}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-24 rounded-xl border border-white/10 bg-gradient-to-b from-emerald-500/10 to-transparent"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product card mockups */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Product card mockups</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 ring-1 ring-white/5"
            >
              <div className="h-40 rounded-xl bg-white/5" />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Hemp Tee • Natural</div>
                  <div className="text-sm text-zinc-400">$29</div>
                </div>
                <button className="rounded-lg border border-emerald-400/30 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-400/10">
                  Add
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                55% hemp / 45% organic cotton, low-impact dye.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / compliance strip */}
      <section className="mt-12 grid gap-4 rounded-2xl border border-white/10 p-6 ring-1 ring-white/5 sm:grid-cols-3">
        {[
          ['Moderated listings', 'Clear policies. Report and review flows.'],
          ['Secure payments', 'PayPal capture with receipts + refunds policy.'],
          ['Open metrics', 'Public footprint notes and supplier provenance.'],
        ].map(([t, s]) => (
          <div key={t}>
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-zinc-300/90">{s}</div>
          </div>
        ))}
      </section>

      {/* Roadmap */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Roadmap</h2>
        <ol className="space-y-3">
          {[
            ['Beta brand pages', 'Live'],
            ['Product slots & kits', 'Rolling out'],
            ['Public marketplace', 'Q4 concept'],
            ['Impact labels & filters', 'Design'],
          ].map(([t, s]) => (
            <li key={t} className="rounded-xl border border-white/10 p-4 ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t}</span>
                <span className="text-xs text-zinc-400">{s}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="my-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center ring-1 ring-white/5">
        <h3 className="text-lg font-semibold">Want early access?</h3>
        <p className="mt-1 text-zinc-300/90">
          Create your brand in Account → Brand, then pick a kit in Billing.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/account/brand"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400"
          >
            Start my brand
          </Link>
          <Link
            href="/account/services"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/5"
          >
            Browse kits
          </Link>
        </div>
      </section>
    </div>
  )
}