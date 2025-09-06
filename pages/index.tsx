// pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Lazy-load the orb so first paint is instant
const Orb = dynamic(() => import('../components/Orb'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <title>Hempin — Enter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen overflow-hidden relative flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--bg),_#050507_60%)]" />
        {/* Subtle animated grain */}
        <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay bg-noise" />

        {/* Orb behind content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Orb />
        </div>

        {/* Copy + actions */}
        <section className="relative z-10 text-center space-y-6 px-6">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Welcome, <span className="text-brand-2">Hempin</span> traveler.
          </h1>
          <p className="opacity-80 max-w-xl mx-auto">
            This is your portal. One profile to explore the hemp universe.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {/* Reuse your existing /account for auth (magic link) */}
            <Link href="/account" className="btn btn-primary">
              Login / Sign up
            </Link>
            <Link href="/learn-more" className="btn btn-outline">
              What is Hempin?
            </Link>
          </div>

          <p className="text-xs opacity-60 pt-6">HEMPIN — 2025</p>
        </section>
      </main>
    </>
  )
}
