// components/atomic/organisms/ItemGrid.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { tokens } from '../particles/tokens'
import FeedProductCard from '../molecules/FeedProductCard'

type BrandRef = { name: string; slug: string }
export type Product = {
  id: string
  slug: string
  name: string
  description?: string | null
  price_cents?: number | null
  price_label?: string | null
  images?: string[] | null
  brand: BrandRef | null
}

export default function ItemGrid({ limit = 48, q }: { limit?: number; q?: string }) {
  const [rows, setRows] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      // base query
      let query = supabase
        .from('products')
        .select(
          `
          id, slug, name, description, price_cents, price_label, images,
          brand:brands ( name, slug )
        `
        )
        .eq('approved', true)
        .eq('is_cannabis', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      // optional name search
      if (q && q.trim()) query = query.ilike('name', `%${q.trim()}%`)

      const { data, error } = await query
      if (error) console.error('[ItemGrid] supabase error:', error)

      if (alive) {
        // Supabase may return related rows as an array; our UI expects a single object.
        const normalized: Product[] = (data || []).map((r: any) => ({
          ...r,
          brand: Array.isArray(r?.brand) ? r.brand[0] ?? null : r?.brand ?? null,
        }))
        setRows(normalized)
        setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [limit, q])

  const list = useMemo(() => rows || [], [rows])

  // Skeleton
  if (loading) {
    return (
      <div
        className="grid"
        style={{
          display: 'grid',
          gap: tokens.space[3],
          gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              borderRadius: tokens.radii.lg,
              background: tokens.glass,
              border: `1px solid ${tokens.stroke}`,
              overflow: 'hidden',
              boxShadow: tokens.shadow,
              height: 300,
            }}
          >
            <div
              style={{
                height: 180,
                background:
                  'linear-gradient(120deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
                borderBottom: `1px solid ${tokens.stroke}`,
              }}
            />
            <div style={{ padding: tokens.space[3], opacity: 0.6, color: tokens.text.base }}>
              Loading…
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (!list.length) {
    return (
      <div
        style={{
          borderRadius: tokens.radii.lg,
          background: tokens.glass,
          border: `1px solid ${tokens.stroke}`,
          padding: tokens.space[4],
          color: tokens.text.base,
        }}
      >
        No products yet — shelves are filling as submissions get approved.
      </div>
    )
  }

  // List
  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gap: tokens.space[3],
        gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
      }}
    >
      {list.map((p) => {
        const img =
          (Array.isArray(p.images) ? p.images[0] : undefined) ||
          '/img/placeholder-product.png'

        return (
  <FeedProductCard
    key={p.id}
    id={p.id}
    slug={p.slug}
    name={p.name}
    brand={p.brand} // { name, slug } | null
    image={img}     // string | null
    price_cents={typeof p.price_cents === 'number' ? p.price_cents : null}
    price_label={p.price_label ?? null}
  />
)
      })}
    </div>
  )
}
