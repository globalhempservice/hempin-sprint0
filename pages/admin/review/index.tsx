import Head from 'next/head'
import SidebarLayout from '../../../components/SidebarLayout'
import { redirectToAdminLogin, hasValidAdminCookie } from '../../../lib/adminAuth'
import type { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type BrandRow = { id: string; name: string; slug: string; approved: boolean; featured: boolean | null; logo_url?: string | null; category?: string | null; created_at?: string }
type EventRow = { id: string; title: string; slug: string; status: string; featured: boolean | null; city?: string | null; country?: string | null; created_at?: string }

export default function AdminReview() {
  const [tab, setTab] = useState<'brands'|'events'>('brands')
  const [brands, setBrands] = useState<BrandRow[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  const load = async () => {
    setMsg(null)
    const [b, e] = await Promise.all([
      fetch('/api/admin/review/brands?only=pending').then(r => r.json()).catch(() => ({ rows: [] })),
      fetch('/api/admin/review/events?only=pending').then(r => r.json()).catch(() => ({ rows: [] })),
    ])
    setBrands(b.rows || [])
    setEvents(e.rows || [])
  }

  useEffect(() => { load() }, [])

  const setBrand = async (id: string, patch: Partial<BrandRow>) => {
    const r = await fetch('/api/admin/review/brands', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...patch }) })
    if (!r.ok) setMsg('Update failed'); else load()
  }
  const setEvent = async (id: string, patch: Partial<EventRow>) => {
    const r = await fetch('/api/admin/review/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...patch }) })
    if (!r.ok) setMsg('Update failed'); else load()
  }

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin — Review</title></Head>
      <h1 className="text-2xl font-semibold mb-4">Admin — Review</h1>

      <div className="mb-3 flex gap-2">
        <button onClick={() => setTab('brands')} className={['px-3 py-1.5 rounded-lg border', tab==='brands' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'].join(' ')}>Brands</button>
        <button onClick={() => setTab('events')} className={['px-3 py-1.5 rounded-lg border', tab==='events' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'].join(' ')}>Events</button>
        <span className="ml-auto text-sm text-[var(--text-2)]">{msg}</span>
      </div>

      {tab === 'brands' && (
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <ul className="grid gap-2">
            {brands.map(b => (
              <li key={b.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                {b.logo_url ? <img src={b.logo_url} className="h-8 w-8 rounded-full object-cover" /> : <div className="h-8 w-8 rounded-full bg-white/10" />}
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.name}</div>
                  <div className="text-xs text-[var(--text-2)] truncate">{b.slug} • {b.category || '—'}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link className="text-sm underline" href={`/brands/${b.slug}`}>Open</Link>
                  <button onClick={() => setBrand(b.id, { approved: true })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                  <button onClick={() => setBrand(b.id, { approved: false })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                  <button onClick={() => setBrand(b.id, { featured: !(b.featured ?? false) })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">{b.featured ? 'Unfeature' : 'Feature'}</button>
                </div>
              </li>
            ))}
          </ul>
          {!brands.length && <div className="text-sm text-[var(--text-2)] p-2">No pending brands.</div>}
        </section>
      )}

      {tab === 'events' && (
        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-3">
          <ul className="grid gap-2">
            {events.map(e => (
              <li key={e.id} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{e.title}</div>
                  <div className="text-xs text-[var(--text-2)] truncate">{e.slug} • {e.city || '—'}, {e.country || '—'}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Link className="text-sm underline" href={`/events/${e.slug}`}>Open</Link>
                  <button onClick={() => setEvent(e.id, { status: 'approved' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                  <button onClick={() => setEvent(e.id, { status: 'rejected' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                  <button onClick={() => setEvent(e.id, { featured: !(e.featured ?? false) })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">{e.featured ? 'Unfeature' : 'Feature'}</button>
                </div>
              </li>
            ))}
          </ul>
          {!events.length && <div className="text-sm text-[var(--text-2)] p-2">No pending events.</div>}
        </section>
      )}
    </SidebarLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}