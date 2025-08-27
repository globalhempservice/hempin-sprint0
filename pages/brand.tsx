// pages/brand.tsx
import Head from 'next/head'
import Countdown from '../components/Countdown'
import BrandShowcase from '../components/BrandShowcase'
import Link from 'next/link'

export default function BrandTeaser() {
  const target = '2025-11-01T10:00:00+07:00'

  return (
    <>
      <Head>
        <title>Create Your Hemp’in Brand Page</title>
        <meta name="description" content="Show your mission, materials, and products in a polished brand page. Launching Nov 1, 2025." />
      </Head>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(52,211,153,0.18),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            🌿 Brand Pages • Public on Nov 1
          </span>
          <h1 className="max-w-4xl mx-auto text-4xl font-semibold leading-tight sm:text-5xl">
            Tell your <span className="text-emerald-400">hemp story</span> with a page you’re proud of
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
            A clean, flexible page for your mission, materials, and products — connected to the Bangkok pop-up.
          </p>
          <div className="mt-6 inline-block">
            <Countdown target={target} label="Goes live in" />
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account" className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-emerald-950 hover:bg-emerald-400">
              Claim your brand page
            </Link>
            <Link href="/shop" className="rounded-xl border border-zinc-700 px-5 py-3 font-medium hover:border-zinc-500">
              See pricing & kits
            </Link>
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <BrandShowcase />
      </section>

      {/* WHAT YOU GET */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-4">What’s included</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.t} title={it.t} body={it.b} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
          <h3 className="text-xl font-semibold">Ready to start?</h3>
          <p className="mt-2 text-zinc-400">Create your brand space now — it’ll publish with the Bangkok showcase.</p>
          <div className="mt-4">
            <Link href="/account" className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-emerald-950 hover:bg-emerald-400">
              Build my brand page
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

const items = [
  { t: 'Hero & story', b: 'Upload a hero image and tell your mission in your own words.' },
  { t: 'Product links', b: 'Attach product pages with QR codes for the pop-up.' },
  { t: 'Materials & impact', b: 'List hemp materials and impact notes.' },
  { t: 'Contact & socials', b: 'Help visitors connect and follow your brand.' },
  { t: 'Moderated for quality', b: 'We review quickly so everything stays polished.' },
  { t: 'SEO-friendly', b: 'Your page is fast, accessible, and discoverable.' },
]

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
    </div>
  )
}
