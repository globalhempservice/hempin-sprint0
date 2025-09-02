import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../components/SidebarLayout'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth, SignInRequiredCard } from '../../../lib/authGuard'

type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  category: string | null
  approved: boolean
  featured: boolean | null
  owner_id: string
  created_at?: string
}

type EventRow = {
  id: string
  title: string
  slug: string
  city: string | null
  country: string | null
  status: string
  featured: boolean | null
  owner_profile_id: string
  created_at?: string
}

export default function AdminReview() {
  const { loading, user } = useAuth()
  const [tab, setTab] = useState<'brands'|'events'>('brands')
  const [brands, setBrands] = useState<Brand[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  const refresh = async () => {
    setMsg(null)
    if (!user) return
    // list unapproved brands + all recent
    const b = await supabase
      .from('brands')
      .select('id,name,slug,logo_url,category,approved,featured,owner_id,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (!b.error) setBrands(b.data || [])
    // list events pending + all recent
    const e = await supabase
      .from('events')
      .select('id,title,slug,city,country,status,featured,owner_profile_id,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (!e.error) setEvents(e.data || [])
  }

  useEffect(() => { if (user) { void refresh() } }, [user])

  const isAdmin = useMemo(() => !!user, [user]) // RLS only allows admins to read everything; non-admins will see empty lists

  const setBrand = async (id: string, patch: Partial<Brand>) => {
    const { error } = await supabase.from('brands').update(patch).eq('id', id)
    if (error) setMsg(error.message); else refresh()
  }
  const setEvent = async (id: string, patch: Partial<EventRow>) => {
    const { error } = await supabase.from('events').update(patch).eq('id', id)
    if (error) setMsg(error.message); else refresh()
  }

  return (
    <SidebarLayout variant="admin">
      <Head><title>Admin • Review</title></Head>

      <h1 className="text-2xl font-semibold mb-4">Admin Review</h1>

      {loading && <div className="rounded-xl border border-white/10 bg-[var(--surface)]/80 p-4">Loading…</div>}
      {!loading && !user && <SignInRequiredCard nextPath="/admin/review" />}

      {!loading && user && (
        <>
          <div className="mb-3 flex gap-2">
            <button
              className={['px-3 py-1.5 rounded-lg border', tab==='brands' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'].join(' ')}
              onClick={() => setTab('brands')}
            >Brands</button>
            <button
              className={['px-3 py-1.5 rounded-lg border', tab==='events' ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'].join(' ')}
              onClick={() => setTab('events')}
            >Events</button>
            <div className="ml-auto text-sm text-[var(--text-2)]">{msg}</div>
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
                      <span className="text-xs px-2 py-1 rounded bg-white/10">{b.approved ? 'approved' : 'pending'}</span>
                      <button onClick={() => setBrand(b.id, { approved: true })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                      <button onClick={() => setBrand(b.id, { approved: false })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                      <button onClick={() => setBrand(b.id, { featured: !b.featured })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">
                        {b.featured ? 'Unfeature' : 'Feature'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
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
                      <span className="text-xs px-2 py-1 rounded bg-white/10">{e.status}</span>
                      <button onClick={() => setEvent(e.id, { status: 'approved' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Approve</button>
                      <button onClick={() => setEvent(e.id, { status: 'rejected' })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">Reject</button>
                      <button onClick={() => setEvent(e.id, { featured: !e.featured })} className="text-sm rounded-lg border border-white/15 px-2 py-1 bg-white/5 hover:bg-white/10">
                        {e.featured ? 'Unfeature' : 'Feature'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </SidebarLayout>
  )
}