import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../components/SidebarLayout'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth, SignInRequiredCard } from '../../../lib/authGuard'

type EventRow = {
  id: string
  slug: string
  title: string
  summary: string | null
  venue_name: string | null
  city: string | null
  country: string | null
  starts_at: string | null
  ends_at: string | null
  cover_url: string | null
  status: string
  featured: boolean | null
  created_at?: string
}

/** Keep the list short + useful. Add more later if needed. */
const COUNTRY_OPTIONS = [
  'Thailand',
  'United States',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Canada',
  'Brazil',
  'Mexico',
  'Japan',
  'China',
  'India',
  'Australia',
  'South Africa',
  'United Arab Emirates',
  'Other',
] as const
type CountryOption = typeof COUNTRY_OPTIONS[number]

function slugify(base: string) {
  const s = (base || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return s || 'event'
}

function toISO(dt?: string | null) {
  if (!dt) return null
  try {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dt)) return new Date(dt + ':00').toISOString()
    const d = new Date(dt)
    return isNaN(d.getTime()) ? null : d.toISOString()
  } catch { return null }
}

async function uploadToBucket(file: File | null, pathPrefix: string) {
  if (!file) return null
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
  const key = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(key, file, {
    upsert: false,
    cacheControl: '3600',
    contentType: file.type || 'application/octet-stream',
  })
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(key)
  return data?.publicUrl || null
}

export default function EventsOwnerPage() {
  const { loading, user } = useAuth()

  const [rows, setRows] = useState<EventRow[]>([])
  const [form, setForm] = useState<Partial<EventRow> & { id?: string }>({
    id: undefined, title: '', summary: '', venue_name: '', city: '', country: '', starts_at: '', ends_at: '', cover_url: ''
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const suggestedSlug = useMemo(() => slugify(form.title || ''), [form.title])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, slug, title, summary, venue_name, city, country, starts_at, ends_at, cover_url, status, featured, created_at')
        .eq('owner_profile_id', user.id)
        .order('starts_at', { ascending: false })
      if (error) console.warn('events list error:', error.message)
      setRows(data || [])
    })()
  }, [user])

  const startNew = () => {
    setForm({ id: undefined, title: '', summary: '', venue_name: '', city: '', country: '', starts_at: '', ends_at: '', cover_url: '' })
    setCoverFile(null); setMsg(null)
  }

  const startEdit = (ev: EventRow) => {
    setForm({
      id: ev.id, title: ev.title || '', summary: ev.summary || '',
      venue_name: ev.venue_name || '', city: ev.city || '', country: ev.country || '',
      starts_at: (ev.starts_at || '').slice(0, 16),
      ends_at: (ev.ends_at || '').slice(0, 16),
      cover_url: ev.cover_url || ''
    })
    setCoverFile(null); setMsg(null)
  }

  const save = async () => {
    if (!user) { setMsg('You must be signed in.'); return }
    setBusy(true); setMsg(null)

    let coverUrl = form.cover_url || null
    try {
      if (coverFile) coverUrl = await uploadToBucket(coverFile, `events/${user.id}/cover`)
    } catch (e: any) {
      setMsg(`Error uploading image: ${e?.message || e}`)
      setBusy(false)
      return
    }

    const base = slugify(form.title || '')
    if (!base) { setMsg('Please enter a title'); setBusy(false); return }

    const payloadBase = {
      title: form.title!,
      summary: (form.summary || null) as string | null,
      venue_name: (form.venue_name || null) as string | null,
      city: (form.city || null) as string | null,
      country: (form.country || null) as string | null,
      starts_at: toISO(form.starts_at || null),
      ends_at: toISO(form.ends_at || null),
      cover_url: coverUrl,
      owner_profile_id: user.id,
      status: 'pending' as const,
    }

    const maxTries = 6
    let attempt = 0
    while (attempt < maxTries) {
      const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`
      const payload = { ...payloadBase, slug: candidate }
      try {
        if (form.id) {
          const { error } = await supabase.from('events').update(payload).eq('id', form.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('events').insert(payload)
          if (error) throw error
        }
        setMsg('Saved. Your event is pending approval.')
        const { data } = await supabase
          .from('events')
          .select('id, slug, title, summary, venue_name, city, country, starts_at, ends_at, cover_url, status, featured, created_at')
          .eq('owner_profile_id', user.id)
          .order('starts_at', { ascending: false })
        setRows(data || [])
        if (!form.id) startNew()
        setBusy(false)
        return
      } catch (e: any) {
        const m = (e?.message || '').toLowerCase()
        const code = e?.code || ''
        const dup = code === '23505' || (m.includes('duplicate key') && m.includes('slug'))
        if (dup) { attempt++; continue }
        setMsg(`Error: ${e?.message || e}`)
        setBusy(false)
        return
      }
    }

    setMsg('Error: could not find a unique URL slug. Try changing the title slightly.')
    setBusy(false)
  }

  return (
    <SidebarLayout variant="account">
      <Head><title>My events • HEMPIN</title></Head>

      <h1 className="text-2xl font-semibold mb-4">My Events</h1>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur-md p-6 text-center text-[var(--text-2)]">
          Loading account…
        </div>
      )}

      {!loading && !user && <SignInRequiredCard nextPath="/account/events" />}

      {!loading && user && (
        <>
          <section className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
            {!rows.length && <div className="text-[var(--text-2)]">You don’t have any events yet.</div>}
            <ul className="grid gap-3">
              {rows.map(e => (
                <li key={e.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{e.title}</div>
                    <div className="text-xs text-[var(--text-2)]">
                      {e.slug} {e.status === 'approved' ? '• approved' : `• ${e.status}`}
                    </div>
                  </div>
                  <button className="text-sm underline" onClick={() => startEdit(e)}>Edit</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{form.id ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => startNew()} className="text-sm underline">New</button>
            </div>

            <div className="mt-3 grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-[var(--text-2)]">Title</span>
                <input value={form.title || ''} onChange={e=>setForm(f=>({...f, title:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
              </label>

              <label className="grid gap-1">
                <span className="text-sm text-[var(--text-2)]">Summary</span>
                <textarea value={form.summary || ''} onChange={e=>setForm(f=>({...f, summary:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" rows={3} />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Venue</span>
                  <input value={form.venue_name || ''} onChange={e=>setForm(f=>({...f, venue_name:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">City</span>
                  <input value={form.city || ''} onChange={e=>setForm(f=>({...f, city:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Country</span>
                  <select
                    value={(form.country as CountryOption) || ''}
                    onChange={e=>setForm(f=>({...f, country: e.target.value as CountryOption}))}
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
                  >
                    <option value="" disabled>Select a country…</option>
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Starts at</span>
                  <input type="datetime-local" value={form.starts_at || ''} onChange={e=>setForm(f=>({...f, starts_at:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Ends at</span>
                  <input type="datetime-local" value={form.ends_at || ''} onChange={e=>setForm(f=>({...f, ends_at:e.target.value}))} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none" />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm text-[var(--text-2)]">Cover (upload)</span>
                <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0] || null)} />
                {form.cover_url && <img alt="cover" src={form.cover_url} className="mt-2 h-24 rounded-lg object-cover" />}
              </label>

              <div className="grid gap-3 sm:grid-cols-3 mt-1">
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Slug (suggested)</span>
                  <input value={suggestedSlug} readOnly className="rounded-lg bg-white/5 border border-white/10 px-3 py-2" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button disabled={busy} onClick={save} className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition">
                  {busy ? 'Saving…' : (form.id ? 'Save changes' : 'Create')}
                </button>
                {msg && <div className="text-sm text-[var(--text-2)]">{msg}</div>}
              </div>
            </div>
          </section>
        </>
      )}
    </SidebarLayout>
  )
}