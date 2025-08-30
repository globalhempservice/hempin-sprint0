// pages/legal/index.tsx
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LEGAL_PAGES } from '../../lib/legalPages'

export default function LegalIndex() {
  const [q, setQ] = useState('')
  const items = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return LEGAL_PAGES
    return LEGAL_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.summary.toLowerCase().includes(s) ||
        p.slug.includes(s),
    )
  }, [q])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-zinc-900/60 to-black/80 p-6 shadow-lg ring-1 ring-white/5">
        <h1 className="text-2xl font-bold">Legal Wiki</h1>
        <p className="mt-1 text-zinc-300/90">
          One place for Privacy, Terms, Cookies, Refunds, and platform rules. Transparent. Simple.
        </p>
        <div className="mt-4 flex gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search privacy, terms, cookies…"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 outline-none ring-emerald-400/30 placeholder:text-zinc-500 focus:ring-2"
          />
        </div>
        <p className="mt-3 text-xs text-zinc-400">
          Need a copy for compliance? You can link to these pages from PayPal, emails, and footers.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((doc) => (
          <Link
            key={doc.slug}
            href={`/legal/${doc.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{doc.title}</h2>
              <span className="rounded-full border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-300">
                Open
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-300/90">{doc.summary}</p>
            {doc.updated && (
              <p className="mt-3 text-xs text-zinc-500">Last updated: {doc.updated}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}