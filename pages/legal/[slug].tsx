// pages/legal/[slug].tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LEGAL_PAGES, findLegal } from '../../lib/legalPages'

export default function LegalDocPage() {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined
  const doc = findLegal(slug)

  if (!doc) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-zinc-300">Not found.</p>
        <Link href="/legal" className="mt-3 inline-block underline">
          Back to Legal Wiki
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/legal"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:bg-white/5"
        >
          ← Legal Wiki
        </Link>
        {doc.updated && (
          <span className="text-xs text-zinc-500">Last updated: {doc.updated}</span>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[18rem,1fr]">
        {/* Sidebar TOC */}
        <aside className="h-max rounded-2xl border border-white/10 bg-white/[0.03] p-4 ring-1 ring-white/5">
          <div className="mb-2 text-sm font-semibold text-zinc-200">All documents</div>
          <nav className="space-y-1">
            {LEGAL_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/legal/${p.slug}`}
                className={[
                  'block rounded-lg px-3 py-2 text-sm hover:bg-white/5',
                  p.slug === doc.slug ? 'bg-white/10 text-white' : 'text-zinc-300/90',
                ].join(' ')}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Article */}
        <article className="prose prose-invert max-w-none prose-headings:font-semibold">
          <h1>{doc.title}</h1>
          {doc.content}
          <hr className="my-6 border-white/10" />
          <p className="text-sm text-zinc-400">
            Questions or requests (export/delete data)? Email{' '}
            <a href="mailto:hello@hempin.example" className="underline">
              hello@hempin.example
            </a>
            .
          </p>
        </article>
      </div>
    </div>
  )
}