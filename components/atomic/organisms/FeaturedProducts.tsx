// components/atomic/organisms/FeaturedProducts.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { tokens } from '../particles/tokens'
import FeatProductCard from '../molecules/FeatProductCard'

type Row = {
  id: string
  slug: string
  name: string
  price_label?: string | null
  images?: string[] | null
  brand: { name: string | null } | null
}

/**
 * Featured / Latest products strip (small visual cards)
 * Phase 1: newest approved non-cannabis products.
 * Later: add 'featured' flag or Architect control.
 */
export default function FeaturedProducts({
  limit = 8,
  title = 'Featured products',
  href = '/products',
}: {
  limit?: number
  title?: string
  href?: string
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          id, slug, name, price_label, images,
          brand:brands ( name )
        `
        )
        .eq('approved', true)
        .eq('is_cannabis', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!alive) return
      if (error) {
        console.error('[FeaturedProducts] supabase error:', error)
        setRows([])
      } else {
        const normalized = (data || []).map((r: any) => ({
          ...r,
          brand: Array.isArray(r?.brand) ? r.brand[0] ?? null : r?.brand ?? null,
        }))
        setRows(normalized)
      }
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [limit])

  if (!rows.length && !loading) return null

  return (
    <section style={{ margin: `${tokens.space[4]}px 0` }}>
      {/* header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: `${tokens.space[4]}px 0 ${tokens.space[2]}px 0`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: tokens.font.family,
            fontSize: tokens.font.size.h5,
            fontWeight: tokens.font.weight.bold,
            lineHeight: tokens.font.lh.snug,
            color: tokens.text.high,
          }}
        >
          {title}
        </h3>
        <Link
          href={href}
          style={{
            color: tokens.text.base,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          View all →
        </Link>
      </div>

      {/* grid of compact product cards */}
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        }}
      >
        {loading
          ? Array.from({ length: Math.min(8, limit) }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 180,
                  borderRadius: tokens.radii.lg,
                  background: tokens.glass,
                }}
              />
            ))
          : rows.map((p) => (
              <FeatProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                image={Array.isArray(p.images) ? p.images?.[0] ?? null : null}
                price_label={p.price_label || null}
              />
            ))}
      </div>
    </section>
  )
}