// pages/admin/review/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import SidebarLayout from '../../../components/SidebarLayout'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../../lib/adminAuth'

type BrandRow = {
  id: string
  name: string
  slug: string
  approved: boolean
  featured: boolean | null
  logo_url?: string | null
  category?: string | null
  created_at?: string
}

type EventRow = {
  id: string
  title: string
  slug: string
  status: 'pending' | 'approved' | 'rejected'
  featured: boolean | null
  city?: string | null
  country?: string | null
  created_at?: string
}

type ProductRow = {
  id: string
  name: string
  slug: string
  approved: boolean
  price_label?: string | null
  created_at?: string
}

export default function AdminReview() {
  const [tab, setTab] = useState<'brands' | 'events' | 'products'>('brands')
  const [brands, setBrands] = useState<BrandRow[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const [b, e, p] = await Promise.all([
        fetch('/api/admin/review/brands?only=pending').then(r => r.json()).catch(() => ({ rows: [] })),
        fetch('/api/admin/review/events?only=pending').then(r => r.json()).catch(() => ({ rows: [] })),
        fetch('/api/admin/review/products?only=pending').then(r => r.json()).catch(() => ({ rows: [] })),
      ])
      setBrands(b.rows || [])
      setEvents(e.rows || [])
      setProducts(p.rows || [])
    } catch {
      setMsg('Failed to load review queues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // --- Mutations ------------------------------------------------------------

  const patch = async (url: string, body: Record<string, any>, onOk?: () => void) => {
    const r = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      setMsg(j?.error || 'Update failed')
      return
    }
    onOk?.()
    load()
  }

  const setBrand = (id: string, patchObj: Partial<BrandRow>) =>
    patch('/api/admin/review/brands', { id, ...patchObj })

  const setEvent = (id: string, patchObj: Partial<EventRow>) =>
    patch('/api/admin/review/events', { id, ...patchObj })

  const setProduct = (id: string, patchObj: Partial<ProductRow>) =>
    patch('/api/admin/review/products', { id, ...patchObj })

  // --- UI -------------------------------------------------------------------

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin — Review</title></Head>

      <h1 className="text-2xl font-semibold mb-4">Admin — Review</h1>

      <div className="mb-3 flex gap-2">
        {(['brands', 'events', 'products'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-3 py-1.5 rounded-lg border',
              tab === t ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:bg-white/10',
            ].join(' ')}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-sm text-[var(--text-2)]">{msg}</span>
      </div>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">Loading queues…</div>
      )}

      {!loading && tab === 'brands' && (
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <ul className="grid gap-2">
            {brands.map(b => (
              <li key={b.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                {b.logo_url
                  ? <img src={b.logo_url} className="h-8 w-8 rounded-full object-cover" />
                  : <div className="h-8 w-8 rounded-full bg-white/10" />}
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.name}</div>
                  <div className="text-xs text-[var(--text-2)] truncate">
                    {b.slug} • {b.category || '—'}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link className="text-sm underline" href={`/brands/${b.slug}`} target="_blank">Open</Link>
                  <button onClick={() => setBrand(b.id, { approved: true })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                  <button onClick={() => setBrand(b.id, { approved: false })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                  <button onClick={() => setBrand(b.id, { featured: !(b.featured ?? false) })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">
                    {b.featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {!brands.length && <div className="text-sm text-[var(--text-2)] p-2">No pending brands.</div>}
        </section>
      )}

      {!loading && tab === 'events' && (
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <ul className="grid gap-2">
            {events.map(e => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{e.title}</div>
                  <div className="text-xs text-[var(--text-2)] truncate">
                    {e.slug} • {e.city || '—'}, {e.country || '—'}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link className="text-sm underline" href={`/events/${e.slug}`} target="_blank">Open</Link>
                  <button onClick={() => setEvent(e.id, { status: 'approved' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                  <button onClick={() => setEvent(e.id, { status: 'rejected' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                  <button onClick={() => setEvent(e.id, { featured: !(e.featured ?? false) })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">
                    {e.featured ? 'Unfeature' : 'Feature'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {!events.length && <div className="text-sm text-[var(--text-2)] p-2">No pending events.</div>}
        </section>
      )}

      {!loading && tab === 'products' && (
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <ul className="grid gap-2">
            {products.map(p => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-[var(--text-2)] truncate">
                    {p.slug} • {p.price_label || '—'}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link className="text-sm underline" href={`/products/${p.slug}`} target="_blank">Open</Link>
                  <button onClick={() => setProduct(p.id, { approved: true })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                  <button onClick={() => setProduct(p.id, { approved: false })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                </div>
              </li>
            ))}
          </ul>
          {!products.length && <div className="text-sm text-[var(--text-2)] p-2">No pending products.</div>}
        </section>
      )}
    </SidebarLayout>
  )
}

// Server-side: password-gated via admin cookie (no user session needed)
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}