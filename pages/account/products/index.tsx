import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../../components/SidebarLayout'
import { useAuth, SignInRequiredCard } from '../../../lib/authGuard'
import { supabase } from '../../../lib/supabaseClient'

type BrandLite = { id: string; name: string }
type ProductRow = {
  id: string
  slug: string
  name: string
  description: string | null
  price_label: string | null
  images: any[] | null
  approved: boolean | null
  brand_id: string
  created_at?: string
}

export default function MyProducts() {
  const { user, loading } = useAuth()
  const [brands, setBrands] = useState<BrandLite[]>([])
  const [rows, setRows] = useState<ProductRow[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<ProductRow> & { brand_id?: string }>({
    name: '',
    description: '',
    price_label: '',
    slug: 'product',
    brand_id: undefined,
  })
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)

  const canCreate = useMemo(
    () => !!user && !!form.name && !!form.brand_id && !!form.slug,
    [user, form.name, form.brand_id, form.slug]
  )

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setMsg(null)
      // Brands owned by user
      const b = await supabase
        .from('brands')
        .select('id,name')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      if (!b.error) setBrands(b.data || [])
      // Products for those brands
      const p = await supabase
        .from('products')
        .select('id,slug,name,description,price_label,images,approved,brand_id,created_at')
        .in('brand_id', (b.data || []).map(x => x.id))
        .order('created_at', { ascending: false })
      if (!p.error) setRows(p.data || [])
    })()
  }, [user])

  const onCreate = async () => {
    if (!canCreate || !user) return
    setSaving(true); setMsg(null)
    try {
      // upload images (optional)
      let images: any[] = []
      if (imageFiles && imageFiles.length) {
        const uploaded: any[] = []
        for (let i = 0; i < imageFiles.length; i++) {
          const f = imageFiles[i]
          const key = `products/${user.id}/${Date.now()}_${i}_${f.name}`.toLowerCase().replace(/\s+/g,'-')
          const { error } = await supabase.storage.from('media').upload(key, f, {
            cacheControl: '3600',
            upsert: false,
            contentType: f.type || 'application/octet-stream',
          })
          if (error) throw error
          const { data: pub } = supabase.storage.from('media').getPublicUrl(key)
          uploaded.push({ url: pub.publicUrl })
        }
        images = uploaded
      }

      const payload = {
        slug: form.slug!.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: form.name!,
        description: form.description || null,
        price_label: form.price_label || null,
        images,
        brand_id: form.brand_id!,
        approved: false,
      }

      const { error } = await supabase.from('products').insert(payload)
      if (error) throw error

      setMsg('Created. Pending approval.')
      // reload list
      const p = await supabase
        .from('products')
        .select('id,slug,name,description,price_label,images,approved,brand_id,created_at')
        .in('brand_id', brands.map(x => x.id))
        .order('created_at', { ascending: false })
      if (!p.error) setRows(p.data || [])

      // reset minimal
      setForm(f => ({ ...f, name: '', description: '', price_label: '', slug: 'product' }))
      setImageFiles(null)
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <SidebarLayout variant="account">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">Loading account…</div>
      </SidebarLayout>
    )
  }

  if (!user) {
    return (
      <SidebarLayout variant="account">
        <SignInRequiredCard nextPath="/account/products" />
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout variant="account">
      <Head><title>My Products</title></Head>
      <h1 className="text-2xl font-semibold mb-4">My Products</h1>

      <div className="rounded-2xl bg-[var(--surface)]/80 border border-white/10 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Create Product</h2>
          <button
            onClick={() => setForm({ name: '', description: '', price_label: '', slug: 'product', brand_id: brands[0]?.id })}
            className="text-sm underline"
          >New</button>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Name</span>
            <input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Brand</span>
            <select
              value={form.brand_id || ''}
              onChange={e => setForm(f => ({ ...f, brand_id: e.target.value || undefined }))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <option value="">Select brand…</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm text-[var(--text-2)]">Description</span>
            <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Price label</span>
            <input value={form.price_label || ''} onChange={e => setForm(f => ({ ...f, price_label: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" placeholder="$49" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Images (upload)</span>
            <input type="file" multiple onChange={e => setImageFiles(e.target.files)} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-[var(--text-2)]">Slug (suggested)</span>
            <input value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
          </label>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={onCreate}
            disabled={!canCreate || saving}
            className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Create'}
          </button>
          <div className="text-sm text-[var(--text-2)]">{msg}</div>
        </div>
      </div>

      <h2 className="font-semibold mt-6 mb-2">Your Products</h2>
      <div className="grid gap-2">
        {rows.map(r => (
          <div key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-[var(--text-2)] truncate">{r.slug} • {r.price_label || '—'} • {r.approved ? 'approved' : 'pending'}</div>
          </div>
        ))}
        {!rows.length && <div className="text-sm text-[var(--text-2)]">You don’t have any products yet.</div>}
      </div>
    </SidebarLayout>
  )
}