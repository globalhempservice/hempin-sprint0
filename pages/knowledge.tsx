// pages/knowledge.tsx
import Link from 'next/link'

export default function Knowledge() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-zinc-900/60 to-black/80 px-6 py-20 shadow-lg ring-1 ring-white/5 sm:px-10">
        <div className="max-w-3xl">
          <p className="mb-3 inline-block rounded-full border border-indigo-400/30 px-3 py-1 text-xs text-indigo-300">
            Coming Soon
          </p>
          <h1 className="text-3xl font-bold sm:text-5xl">Hemp Knowledge Repository</h1>
          <p className="mt-4 text-lg text-zinc-300/90">
            A living library of hemp & cannabis research, literature, case studies, and open-access
            knowledge. From agronomy to policy to future tech, all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#sections"
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-indigo-400"
            >
              Explore sections
            </a>
            <Link
              href="/experiments"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/5"
            >
              Try our lab demos
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </section>

      {/* Content categories */}
      <section id="sections" className="mt-14">
        <h2 className="mb-6 text-xl font-semibold">Repository sections</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Agronomy & cultivation', 'Farming practices, yields, soil regeneration, CO₂ sequestration.'],
            ['Industrial applications', 'Fibers, composites, bioplastics, hempcrete, and new tech.'],
            ['Health & wellness', 'Nutritional, medical, and therapeutic research on hemp & cannabis.'],
            ['Policy & regulation', 'Legal frameworks, compliance, standards across countries.'],
            ['Carbon & environment', 'Life cycle assessments, impact studies, carbon credits.'],
            ['Culture & history', 'Hemp’s role in societies past and present.'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition hover:bg-white/[0.06]"
            >
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-300/90">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured papers mock */}
      <section className="mt-14">
        <h2 className="mb-6 text-xl font-semibold">Featured research (preview)</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [
              'Carbon storage in industrial hemp',
              'University of Wageningen study, 2023',
              'Hemp absorbs ~15 tons of CO₂ per hectare annually under optimal conditions.',
            ],
            [
              'Hempcrete as a building material',
              'ETH Zürich, 2022',
              'Thermal regulation and carbon-negative construction applications of hemp-lime composites.',
            ],
            [
              'Cannabinoids in therapeutic contexts',
              'Lancet Review, 2021',
              'Emerging findings on CBD and other cannabinoids for neurological health.',
            ],
          ].map(([title, meta, summary]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 ring-1 ring-white/5"
            >
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1 text-xs text-zinc-400">{meta}</p>
              <p className="mt-3 text-sm text-zinc-300/90">{summary}</p>
              <button className="mt-4 rounded-lg border border-indigo-400/30 px-3 py-1.5 text-sm text-indigo-300 hover:bg-indigo-400/10">
                Read preview
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="my-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center ring-1 ring-white/5">
        <h3 className="text-lg font-semibold">Want early access?</h3>
        <p className="mt-1 text-zinc-300/90">
          We’ll be opening the repository to collaborators, researchers, and brands soon. Join our
          mailing list to get notified.
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href="/contact"
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-indigo-400"
          >
            Join the waitlist
          </Link>
        </div>
      </section>
    </div>
  )
}