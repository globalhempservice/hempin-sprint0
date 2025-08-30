// pages/bangkoklanding.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function BangkokLanding() {
  // subtle parallax on hero blobs
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8
      const y = (e.clientY / window.innerHeight - 0.5) * 8
      setTilt({ x, y })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <Head>
        <title>HEMPIN • Bangkok Showroom</title>
        <meta name="description" content="A living showroom for hemp design, culture, and circular commerce — coming to Bangkok." />
      </Head>

      <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(80%_60%_at_50%_-10%,#0EA5E9_0%,rgba(14,165,233,0)_40%),radial-gradient(70%_50%_at_120%_10%,#22C55E_0%,rgba(34,197,94,0)_50%),#0b0b0b] text-white">
        {/* floating background orbs */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background:
            'radial-gradient(closest-side,#22C55E55,#22C55E00 70%)',
            transform: `translate3d(-50%,0,0) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          }}
        />
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-70"
          style={{ background: 'radial-gradient(circle,#0EA5E955,#0EA5E900 70%)' }}
        />
        <div
          className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full blur-3xl opacity-60"
          style={{ background: 'radial-gradient(circle,#22C55E55,#22C55E00 70%)' }}
        />

        {/* Sticky RSVP bar */}
        <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/50 border-b border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
            <Link href="/" className="font-semibold tracking-wide">
              HEMPIN
              <span className="ml-2 rounded bg-emerald-400/20 px-2 py-0.5 text-xs text-emerald-300">Showroom</span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden md:inline text-white/70">Bangkok • Q4 2025</span>
              <Link href="/signin" className="rounded-xl bg-emerald-500 px-3 py-1.5 font-medium text-black hover:bg-emerald-400 transition">
                RSVP / Early Access
              </Link>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 lg:px-6 lg:pt-24">
          <h1 className="text-balance bg-gradient-to-br from-white via-white to-emerald-200 bg-clip-text text-4xl font-extrabold leading-tight text-transparent sm:text-6xl lg:text-7xl">
            Bangkok Hempin Showroom
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80 sm:text-xl">
            A living space where material science meets lifestyle. Touch hemp textiles, test bio-composites, meet makers, and preview the future of sustainable commerce.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signin" className="rounded-2xl bg-white px-5 py-3 text-black font-semibold hover:bg-emerald-200 transition">
              Get on the list
            </Link>
            <a href="#sections" className="rounded-2xl border border-white/20 px-5 py-3 text-white/90 hover:bg-white/10 transition">
              Explore the concept
            </a>
          </div>

          {/* hero cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Material Bar', desc: 'Feel fibers, sheets, yarns, and blends — curated by use case.' },
              { title: 'Maker’s Line', desc: 'Live demos: weaving, molding, additive, and natural dyes.' },
              { title: 'Circular Cart', desc: 'Buy once, loop forever — deposit + repair + resell flows.' },
            ].map((c) => (
              <div key={c.title} className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:border-emerald-400/40 hover:bg-white/10 transition">
                <div className="text-sm text-emerald-300/90">Showroom Pillar</div>
                <div className="mt-1 text-xl font-semibold">{c.title}</div>
                <p className="mt-2 text-white/70">{c.desc}</p>
                <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 opacity-70 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* marquee */}
        <div className="relative my-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-transparent to-[#0b0b0b]" />
          <div className="animate-[scroll_22s_linear_infinite] whitespace-nowrap text-xl text-emerald-300/80 will-change-transform">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-3 opacity-90">
                <span>🌿 Hemp</span><span>•</span>
                <span>🧪 Material Science</span><span>•</span>
                <span>🧵 Textiles</span><span>•</span>
                <span>🛠️ Fabrication</span><span>•</span>
                <span>♻️ Circularity</span><span>•</span>
                <span>🎭 Culture</span>
              </span>
            ))}
          </div>
        </div>

        {/* Sections */}
        <section id="sections" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <div className="grid items-start gap-6 lg:grid-cols-[1.2fr,1fr]">
            {/* left: story */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-2xl font-bold">Why Bangkok?</h2>
              <p className="mt-3 text-white/80">
                A fast, creative city with global reach. The showroom anchors pop-ups, residencies, and a studio for local prototyping — then bridges into HEMPIN’s global marketplace.
              </p>
              <ul className="mt-5 space-y-2 text-white/80">
                <li>• Sourcing corridor across Asia</li>
                <li>• Tourism + design capital</li>
                <li>• University & maker community access</li>
              </ul>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Stat label="Launch cohort" value="12 brands" />
                <Stat label="Material SKUs" value="150+" />
              </div>
            </div>

            {/* right: schedule */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold">Opening Season — Program</h3>
              <ol className="mt-4 space-y-4">
                {[
                  ['Week 1', 'Soft-open + Member previews'],
                  ['Week 2', 'Material Bar nights'],
                  ['Week 3', 'Fabrication demos & classes'],
                  ['Week 4', 'Circular Cart pilot & swaps'],
                ].map(([w, t]) => (
                  <li key={w} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 min-w-[4.5rem] items-center justify-center rounded-md bg-emerald-400/20 text-emerald-300">{w}</span>
                    <span className="text-white/85">{t}</span>
                  </li>
                ))}
              </ol>
              <Link href="/signin" className="mt-6 inline-block rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400 transition">
                Request an invite
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery (placeholders) */}
        <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
          <h3 className="text-xl font-semibold">Mood gallery</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {['Textiles Lab','Material Library','Showcase Nook','Demo Bench','Community Lounge','Street Pop-up'].map((label,i)=>(
              <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-white/10 to-white/0" />
                <div className="absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur">{label}</div>
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">Location</h3>
                <p className="mt-2 text-white/80">
                  Central Bangkok (final site TBA). Walkable, transit-linked, and designed for drop-in discovery.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Stat label="Floor area" value="250–400 m²" />
                  <Stat label="Ceiling" value="3.5–5.0 m" />
                </div>
                <div className="mt-6">
                  <Link href="/contact" className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">
                    Landlord / Partner? Talk to us →
                  </Link>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Bangkok map"
                  className="h-72 w-full"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=100.48,13.68,100.6,13.78&layer=mapnik&marker=13.73,100.54"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA footer */}
        <section className="border-t border-white/10 bg-black/30">
          <div className="mx-auto max-w-7xl px-4 py-14 text-center lg:px-6">
            <h4 className="text-2xl font-bold">Be first through the doors</h4>
            <p className="mx-auto mt-2 max-w-xl text-white/75">
              Members get early access, private previews, and circular perks. We’ll also announce build diaries from the space.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/signin" className="rounded-xl bg-white px-5 py-3 font-semibold text-black hover:bg-emerald-200 transition">
                Join the list
              </Link>
              <Link href="/experiments" className="rounded-xl border border-white/20 px-5 py-3 hover:bg-white/10 transition">
                Explore prototypes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-wide text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}