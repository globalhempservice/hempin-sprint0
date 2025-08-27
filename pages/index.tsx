
import Link from 'next/link'

export default function Home() {
  return (
    <main className="container space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">HEMP’IN – Global hemp brand directory & pop‑up</h1>
        <p className="text-sm opacity-80">Bangkok Edition • Directory goes live Nov 1, 2025 • Samples due Oct 25, 2025</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Sell on HEMP’IN</h2>
          <p>Get a brand page and product pages, join the Bangkok pop‑up, and be discovered.</p>
          <div className="space-x-2">
            <Link href="/account">
              <span className="btn btn-primary">Get started</span>
            </Link>
            <Link href="/shop">
              <span className="btn btn-outline">View packages</span>
            </Link>
          </div>
        </div>
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Browse brands</h2>
          <p>Categories: Fashion, Beauty, Homeware, Food & Drinks, Wellness, Innovation.</p>
          <div className="space-x-2">
            <Link href="/directory"><span className="btn btn-outline">Directory</span></Link>
          </div>
        </div>
      </div>

      <footer className="opacity-70 text-xs">
        © 2025 HEMP’IN • Global Hemp Service
      </footer>
    </main>
  )
}
