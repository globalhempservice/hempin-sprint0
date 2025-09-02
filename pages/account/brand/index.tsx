import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../components/SidebarLayout'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth, SignInRequiredCard } from '../../../lib/authGuard'

type BrandRow = {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  cover_url: string | null
  category: string | null
  website: string | null
  approved: boolean
  featured: boolean | null
  created_at?: string
}

/** KEEP IN SYNC with brands_category_check in SQL */
const BRAND_CATEGORIES = [
  'fashion',
  'innovation',
  'food',
  'wellness',
  'materials',
  'construction',
  'equipment',
  'textiles',
  'beauty',
  'education',
  'services',
  'other',
] as const
type BrandCategory = typeof BRAND_CATEGORIES[number]

function slugify(base: string) {
  const s = (base || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'brand'
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

export default function BrandOwnerPage() {
  const { loading, user } = useAuth()

  const [rows, setRows] = useState<BrandRow[]>([])
  const [form, setForm] = useState<Partial<BrandRow> & { id?: string }>({
    id: undefined,
    name: '',
    description: '',
    logo_url: '',
    cover_url: '',
    category: '',
    website: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const suggestedSlug = useMemo(() => slugify(form.name || ''), [form.name])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, slug, name, description, logo_url, cover_url, category, website, approved, featured, created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      if (error) console.warn('brands list error:', error.message)
      setRows(data || [])
    })()
  }, [user])

  const startNew = () => {
    setForm({ id: undefined, name: '', description: '', logo_url: '', cover_url: '', category: '', website: '' })
    setLogoFile(null)
    setCoverFile(null)
    setMsg(null)
  }

  const startEdit = (b: BrandRow) => {
    setForm({
      id: b.id,
      name: b.name || '',
      description: b.description || '',
      logo_url: b.logo_url || '',
      cover_url: b.cover_url || '',
      category: (b.category || '') as string,
      website: b.website || '',
    })
    setLogoFile(null)
    setCoverFile(null)
    setMsg(null)
  }

  const save = async () => {
    if (!user) {
      setMsg('You must be signed in.')
      return
    }
    setBusy(true)
    setMsg(null)

    try {
      const base = slugify(form.name || '')
      if (!base) throw new Error('Please enter a name')

      const uploadedLogo = logoFile ? await uploadToBucket(logoFile, `brands/${user.id}/logo`) : null
      const uploadedCover = coverFile ? await uploadToBucket(coverFile, `brands/${user.id}/cover`) : null

      const payloadBase = {
        name: form.name!,
        description: (form.description || null) as string | null,
        logo_url: uploadedLogo ?? (form.logo_url || null),
        cover_url: uploadedCover ?? (form.cover_url || null),
        category: (form.category || null) as string | null, // must match SQL list
        website: (form.website || null) as string | null,
        owner_id: user.id,
        approved: false,
      }

      const maxTries = 6
      let attempt = 0
      while (attempt < maxTries) {
        const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`
        const payload = { ...payloadBase, slug: candidate }
        try {
          if (form.id) {
            const { error } = await supabase.from('brands').update(payload).eq('id', form.id)
            if (error) throw error
          } else {
            const { error } = await supabase.from('brands').insert(payload)
            if (error) throw error
          }
          setMsg('Saved. Your brand is pending approval.')

          const { data } = await supabase
            .from('brands')
            .select('id, slug, name, description, logo_url, cover_url, category, website, approved, featured, created_at')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
          setRows(data || [])

          if (!form.id) startNew()
          setBusy(false)
          return
        } catch (e: any) {
          const m = (e?.message || '').toLowerCase()
          const code = e?.code || ''
          const dup = code === '23505' || (m.includes('duplicate key') && m.includes('slug'))
          if (dup) {
            attempt++
            continue
          }
          setMsg(`Error: ${e?.message || e}`)
          setBusy(false)
          return
        }
      }

      setMsg('Error: could not find a unique URL slug. Try changing the name slightly.')
    } catch (e: any) {
      setMsg(`Error: ${e?.message || e}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <SidebarLayout variant="account">
      <Head>
        <title>My brands • HEMPIN</title>
      </Head>

      <h1 className="text-2xl font-semibold mb-4">My Brands</h1>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur-md p-6 text-center text-[var(--text-2)]">
          Loading account…
        </div>
      )}

      {!loading && !user && <SignInRequiredCard nextPath="/account/brand" />}

      {!loading && user && (
        <>
          <section className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
            {!rows.length && <div className="text-[var(--text-2)]">You don’t have any brands yet.</div>}
            <ul className="grid gap-3">
              {rows.map((b) => (
                <li
                  key={b.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-white/10" />
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{b.name}</div>
                      <div className="text-xs text-[var(--text-2)] truncate">
                        {b.slug} {b.approved ? '• approved' : '• pending'}
                      </div>
                    </div>
                  </div>
                  <button className="text-sm underline" onClick={() => startEdit(b)}>
                    Edit
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{form.id ? 'Edit Brand' : 'Create Brand'} </h2>
              <button onClick={startNew} className="text-sm underline">
                New
              </button>
            </div>

            <div className="mt-3 grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm text-[var(--text-2)]">Name</span>
                <input
                  value={form.name || ''}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm text-[var(--text-2)]">Description</span>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
                  rows={3}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Logo (upload)</span>
                  <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                  {form.logo_url && (
                    <img alt="logo" src={form.logo_url} className="mt-2 h-14 w-14 rounded-full object-cover" />
                  )}
                </label>
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Cover (upload)</span>
                  <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                  {form.cover_url && <img alt="cover" src={form.cover_url} className="mt-2 h-20 rounded-lg object-cover" />}
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Category</span>
                  <select
                    value={(form.category as BrandCategory) || ''}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BrandCategory }))}
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
                  >
                    <option value="" disabled>
                      Select a category…
                    </option>
                    {BRAND_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Website</span>
                  <input
                    value={form.website || ''}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm text-[var(--text-2)]">Slug (suggested)</span>
                  <input value={suggestedSlug} readOnly className="rounded-lg bg-white/5 border border-white/10 px-3 py-2" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={busy}
                  onClick={save}
                  className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  {busy ? 'Saving…' : form.id ? 'Save changes' : 'Create'}
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