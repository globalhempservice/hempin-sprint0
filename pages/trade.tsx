// pages/trade.tsx
import Link from 'next/link'

export default function Trade() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-zinc-900/60 to-black/80 px-6 py-16 shadow-lg ring-1 ring-white/5 sm:px-10">
        <div className="max-w-3xl">
          <p className="mb-3 inline-block rounded-full border border-sky-400/30 px-3 py-1 text-xs text-sky-300">
            Preview
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">Hemp Trade</h1>
          <p className="mt-4 text-lg text-zinc-300/90">
            A B2B exchange for raw and semi-finished hemp materials—fiber, hurd, yarn, fabrics,
            bioplastics, biochar, and more. Match supply with real demand, transparently.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#how"
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-sky-400"
            >
              How it works
            </a>
            <Link
              href="/experiments"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/5"
            >
              Explore experiments
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </section>

      {/* Pillars */}
      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ['Supplier directory', 'Profiles with capacity, specs, and compliance notes.'],
          ['RFQ / RFP flow', 'Buyers post needs. Suppliers quote with lead times.'],
          ['Samples & QC', 'Optional escrow + sample tracking before POs.'],
          ['Contracts & POs', 'Templates with delivery and sustainability addenda.'],
          ['Logistics hints', 'Incoterms, lanes, and basic CO₂ per route.'],
          ['Payments', 'Milestone releases via PayPal or wire (manual in alpha).'],
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

      {/* How it works */}
      <section id="how" className="mt-12 rounded-2xl border border-white/10 p-6 ring-1 ring-white/5">
        <h2 className="mb-4 text-xl font-semibold">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Post', 'Buyer posts RFQ with quantities, specs, delivery window.'],
            ['Match', 'Suppliers receive alerts and submit quotes and docs.'],
            ['Sample', 'Optional sample approval with photo/QC checklist.'],
            ['Order', 'Confirm PO, milestone payments, and shipping docs.'],
          ].map(([t, s], idx) => (
            <li key={t} className="rounded-xl border border-white/10 p-4">
              <div className="mb-1 text-xs text-zinc-400">Step {idx + 1}</div>
              <div className="font-medium">{t}</div>
              <div className="text-sm text-zinc-300/90">{s}</div>
            </li>
          ))}
        </ol>
      </section>

      {/* Mock RFQs */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Live RFQ mockups</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Hemp yarn 30s Ne • 2 tons / mo', 'OE/compact, natural, lead time 4–6 weeks.'],
            ['Woven fabric 260gsm • 5,000m', '55/45 hemp/cotton plain weave, VAT dye.'],
            ['Hurd • 3 truckloads', 'Construction grade, moisture <12%, EU.'],
          ].map(([title, sub]) => (
            <div key={title} className="rounded-2xl border border-white/10 p-5 ring-1 ring-white/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-zinc-400">{sub}</div>
                </div>
                <span className="rounded-full border border-sky-400/30 px-2 py-0.5 text-xs text-sky-300">
                  Preview
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5">
                  View RFQ
                </button>
                <button className="rounded-lg border border-sky-400/30 px-3 py-1.5 text-sm text-sky-300 hover:bg-sky-400/10">
                  Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance / trust */}
      <section className="mt-12 grid gap-4 rounded-2xl border border-white/10 p-6 ring-1 ring-white/5 sm:grid-cols-3">
        {[
          ['Docs vault', 'NDAs, COAs, MSDS, lab tests, and certificates.'],
          ['Moderation', 'Vendor agreement + community rules enforced.'],
          ['Transparency', 'Public profiles; share only what you approve.'],
        ].map(([t, s]) => (
          <div key={t}>
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-zinc-300/90">{s}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="my-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center ring-1 ring-white/5">
        <h3 className="text-lg font-semibold">Want to pilot Hemp Trade?</h3>
        <p className="mt-1 text-zinc-300/90">
          Tell us what you buy or sell, and we’ll invite you to the closed beta.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/account/brand"
            className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-sky-400"
          >
            Create supplier profile
          </Link>
          <Link
            href="/experiments"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/5"
          >
            Explore demos
          </Link>
        </div>
      </section>
    </div>
  )
}