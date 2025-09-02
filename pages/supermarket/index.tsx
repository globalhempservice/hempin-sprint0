import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import SidebarLayout from '../../components/SidebarLayout'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

type Brand = { id: string; slug: string; name: string; logo_url: string | null; category: string | null }
type Product = { id: string; slug: string; name: string; price_label: string | null; images: { url?: string }[] | null; brand_id: string }

const CATEGORIES = [
  'fashion','innovation','food','wellness','materials','construction','equipment','textiles','beauty','education','services','other'
] as const

export default function SupermarketIndex() {
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 18

  const filtersApplied = useMemo(() => Boolean(search || category), [search, category])

  useEffect(() => {
    ;(async () => {
      // Featured brands (approved + featured)
      const fb = await supabase
        .from('brands')
        .select('id,slug,name,logo_url,category')
        .eq('approved', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8)
      if (!fb.error) setFeaturedBrands(fb.data || [])
    })()
  }, [])

  const loadProducts = async (reset = false) => {
    setLoading(true)
    const from = reset ? 0 : page * pageSize
    const to = from + pageSize - 1

    let q = supabase
      .from('products')
      .select('id,slug,name,price_label,images,brand_id')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category) {
      // pull brand ids in that category
      const b = await supabase.from('brands').select('id').eq('approved', true).eq('category', category)
      const ids = (b.data || []).map(x => x.id)
      if (ids.length) q = q.in('brand_id', ids)
      else q = q.eq('brand_id', '00000000-0000-0000-0000-000000000000') // empty impossible id to yield none
    }

    if (search) {
      // simple ilike on name (can expand to description or trigram later)
      q = q.ilike('name', `%${search}%`)
    }

    const { data, error } = await q
    if (!error) {
      setProducts(prev => reset ? (data || []) : [...prev, ...(data || [])])
      setPage(reset ? 1 : page + 1)
    }
    setLoading(false)
  }

  useEffect(() => {
    // initial load
    loadProducts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // reload when filters change
    loadProducts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category])

  return (
    <SidebarLayout variant="account">
      <Head><title>Supermarket • HEMPIN</title></Head>

      <div className="grid gap-6">
        <header className="rounded-2xl p-6 border border-white/10 bg-[linear-gradient(180deg,rgba(28,35,33,.5),rgba(20,23,22,.4))] backdrop-blur">
          <h1 className="text-2xl font-semibold">Supermarket</h1>
          <p className="text-[var(--text-2)]">Discover hemp brands and products — neat, green, and seen.</p>

          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <input
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 outline-none"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              className="px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10"
              disabled={!filtersApplied}
            >
              Reset filters
            </button>
          </div>
        </header>

        {!!featuredBrands.length && (
          <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Featured brands</h2>
              <Link href="/brands" className="text-sm underline">Browse all brands</Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBrands.map(b => (
                <li key={b.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <a href={`/brands/${b.slug}`} className="flex items-center gap-3">
                    {b.logo_url ? <img src={b.logo_url} className="h-10 w-10 rounded-full object-cover border border-white/10" /> : <div className="h-10 w-10 rounded-full bg-white/10" />}
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-[var(--text-2)]">{b.category || '—'}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Products</h2>
            <div className="text-xs text-[var(--text-2)]">{products.length} loaded</div>
          </div>

          {!products.length && !loading && (
            <div className="text-sm text-[var(--text-2)]">No products match your filters yet.</div>
          )}

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => (
              <li key={p.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <a href={`/products/${p.slug}`} className="block">
                  <div className="aspect-[4/3] bg-white/5">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-[var(--text-2)]">{p.price_label || '—'}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => loadProducts(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        </section>
      </div>
    </SidebarLayout>
  )
}