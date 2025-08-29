// pages/experiments/index.tsx
import Link from 'next/link'

export default function ExperimentsIndex() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-6">HEMPIN — Experiments</h1>
      <p className="text-zinc-400 mb-10">
        Fast prototypes we can test without touching the core app.
      </p>

      <ul className="grid gap-6 sm:grid-cols-2">
        <li className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07]">
          <h2 className="font-semibold mb-2">Brand Preview (PNG/SVG export)</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Enter brand name, tagline, pick a color, drop a logo and export a shareable hero card.
          </p>
          <Link href="/experiments/brand-preview" className="inline-flex items-center rounded-lg px-3 py-2 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10">
            Open
          </Link>
        </li>
      </ul>

      <div className="mt-10 text-xs text-zinc-500">
        P.S. These routes are public and isolated from /account.
      </div>
    </main>
  )
}