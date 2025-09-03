// components/atomic/organisms/ItemGrid.tsx
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type BrandRef = { name: string; slug: string }
export type Product = {
  id: string
  slug: string
  name: string
  description?: string | null
  price_cents?: number | null
  images?: string[] | null
  brand: BrandRef | null
}

export default function ItemGrid({ limit = 48 }: { limit?: number }) {
  const [rows, setRows] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('products')
        .select(
          `
          id, slug, name, description, price_cents, images,
          brand:brands ( name, slug )
        `
        )
        .eq('approved', true)
        .eq('is_cannabis', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) console.error('[ItemGrid] supabase error:', error)

      if (alive) {
        // 🔧 Normalize: supabase can return related rows as an array; our UI expects a single object.
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
  }, [limit])

  const list = useMemo(() => rows || [], [rows])

  if (loading) {
    return (
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.06)',
              height: 300,
            }}
          >
            <div
              style={{
                height: 160,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background:
                  'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent)',
              }}
            />
            <div style={{ padding: 12, opacity: 0.6 }}>Loading…</div>
          </div>
        ))}
      </div>
    )
  }

  if (!list.length) {
    return (
      <div
        className="rounded-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: 20,
        }}
      >
        <div style={{ color: '#cfe9df' }}>
          No products yet — shelves are filling as submissions get approved.
        </div>
      </div>
    )
  }

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))' }}
    >
      {list.map((p) => {
        const img =
          (Array.isArray(p.images) ? p.images[0] : undefined) ||
          '/img/placeholder-product.png'
        const price =
          typeof p.price_cents === 'number'
            ? `$${(p.price_cents / 100).toFixed(0)}`
            : undefined

        return (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="rounded-2xl block overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              style={{
                height: 180,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background:
                  'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.06), transparent)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt=""
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ padding: 12 }}>
              <div
                style={{
                  fontWeight: 800,
                  color: '#eafff7',
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
                title={p.name}
              >
                {p.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8fbfb0' }}>
                  {p.brand?.name ?? '—'}
                </span>
                {price && (
                  <span style={{ color: '#bef0dc', fontWeight: 700 }}>
                    {price}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}