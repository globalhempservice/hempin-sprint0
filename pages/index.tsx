// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>HEMPIN – Grow the Hemp Ecosystem</title>
        <meta name="description" content="Trade, Supermarket, Events, Research, Experiments" />
      </Head>

      <main className="flex-1">
        {/* HERO */}
        <section className="px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Build the future of <span className="text-emerald-400">hemp</span>
          </h1>
          <p className="opacity-75 max-w-xl mx-auto mb-8">
            HEMPIN unifies creators, brands and communities across Trade, Supermarket, Events,
            Research and playful Experiments.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/experiments" className="btn btn-primary">Explore Experiments</Link>
            <Link href="/shop" className="btn btn-outline">Browse Supermarket</Link>
            <Link href="/trade" className="btn btn-outline">Open Trade</Link>
          </div>
        </section>
      </main>
    </>
  )
}