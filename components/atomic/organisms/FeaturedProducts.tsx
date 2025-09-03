import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import FeedProductCard from '../atoms/FeedProductCard'

type Row = {
  id: string
  slug: string
  name: string
  price_label?: string | null
  images?: string[] | null
  brand: { name: string | null } | null
}

/**
 * Featured / Latest products strip
 * - Phase 1: shows most recent approved non-cannabis products
 * - Later: add a 'featured' filter or Architect control
 */
export default function FeaturedProducts({ limit = 6, title = 'Featured products', href = '/products' }:{
  limit?: number
  title?: string
  href?: string
}) {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, slug, name, price_label, images,
          brand:brands ( name )
        `)
        .eq('approved', true)
        .eq('is_cannabis', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!alive) return
      if (error) { console.error('[FeaturedProducts] supabase error:', error); setRows([]); return }
      const normalized = (data || []).map((r: any) => ({
        ...r,
        brand: Array.isArray(r?.brand) ? r.brand[0] ?? null : r?.brand ?? null,
      }))
      setRows(normalized)
    })()
    return () => { alive = false }
  }, [limit])

  if (!rows.length) return null

  return (
    <section style={{ margin: '10px 0' }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', margin:'16px 0 8px 0'}}>
        <h3>{title}</h3>
        <a href={href} style={{ color:'#9be9d3', textDecoration:'underline' }}>View all →</a>
      </div>
      <div className="grid" style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))' }}>
        {rows.map((p) => (
          <FeedProductCard
            key={p.id}
            slug={p.slug}
            name={p.name}
            brandName={p.brand?.name || null}
            priceLabel={p.price_label || null}
            img={Array.isArray(p.images) ? (p.images[0] || null) : null}
          />
        ))}
      </div>
    </section>
  )
}