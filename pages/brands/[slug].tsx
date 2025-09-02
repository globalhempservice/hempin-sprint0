import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SidebarLayout from '../../components/SidebarLayout'
import { supabase } from '../../lib/supabaseClient'

type Brand = {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  cover_url: string | null
  category: string | null
  website: string | null
  approved: boolean
}

type Product = {
  id: string
  slug: string
  name: string
  price_label: string | null
  images: { url?: string }[] | null
  approved: boolean | null
}

export default function BrandPublic() {
  const { query } = useRouter()
  const { slug } = query
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      const b = await supabase
        .from('brands')
        .select('id,name,slug,description,logo_url,cover_url,category,website,approved')
        .eq('slug', slug)
        .eq('approved', true)
        .maybeSingle()
      if (b.error || !b.data) { setNotFound(true); return }
      setBrand(b.data)

      const p = await supabase
        .from('products')
        .select('id,slug,name,price_label,images,approved')
        .eq('brand_id', b.data.id)
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(24)
      if (!p.error) setProducts(p.data || [])
    })()
  }, [slug])

  return (
    <SidebarLayout variant="account">
      <Head><title>{brand?.name || 'Brand'} • HEMPIN</title></Head>

      {!brand && !notFound && <div className="p-6">Loading…</div>}
      {notFound && <div className="p-6">Brand not found or not approved yet.</div>}
      {brand && (
        <div className="grid gap-4">
          {brand.cover_url && <img src={brand.cover_url} className="rounded-xl object-cover max-h-80 w-full border border-white/10" />}
          <div className="flex items-center gap-3">
            {brand.logo_url
              ? <img src={brand.logo_url} className="h-12 w-12 rounded-full object-cover border border-white/10" />
              : <div className="h-12 w-12 rounded-full bg-white/10" />}
            <div>
              <h1 className="text-2xl font-semibold">{brand.name}</h1>
              <div className="text-sm text-[var(--text-2)]">{brand.category || '—'}</div>
            </div>
          </div>
          {brand.description && <p className="text-[var(--text-2)] whitespace-pre-line">{brand.description}</p>}
          {brand.website && <a className="underline" href={brand.website} target="_blank" rel="noreferrer">Visit website →</a>}

          <h2 className="mt-6 font-semibold">Products</h2>
          {!products.length && (
            <div className="text-sm text-[var(--text-2)]">No approved products yet.</div>
          )}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(p => (
              <li key={p.id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <a href={`/products/${p.slug}`} className="block">
                  <div className="aspect-[4/3] bg-white/5">
                    {p.images?.[0]?.url
                      ? <img src={p.images[0].url} className="w-full h-full object-cover" />
                      : <div className="w-full h-full" />}
                  </div>
                  <div className="p-3">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-[var(--text-2)]">{p.price_label || '—'}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SidebarLayout>
  )
}