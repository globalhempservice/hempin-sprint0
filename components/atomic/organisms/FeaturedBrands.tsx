// components/atomic/organisms/FeaturedBrands.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { tokens } from '../particles/tokens'
import BrandPill from '../molecules/BrandPill'

type Row = { name: string; slug: string }

export default function FeaturedBrands({
  title = 'Featured brands',
  limit = 8,
  showAllLink = true,
}: {
  title?: string
  limit?: number
  showAllLink?: boolean
}) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('name,slug')
        .eq('approved', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!alive) return
      if (error) {
        console.error('[FeaturedBrands] supabase error:', error)
        setRows([])
      } else {
        setRows(data || [])
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
        {showAllLink && (
          <Link
            href="/brands"
            style={{
              color: tokens.text.base,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            All brands →
          </Link>
        )}
      </div>

      {/* pills row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {loading
          ? Array.from({ length: Math.min(6, limit) }).map((_, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  padding: `${tokens.component.pill.paddingY}px ${tokens.component.pill.paddingX}px`,
                  borderRadius: tokens.radii.pill,
                  background: tokens.glass,
                  color: tokens.text.dim,
                  opacity: 0.6,
                }}
              >
                Loading…
              </span>
            ))
          : rows.map((b) => (
              <BrandPill key={b.slug} name={b.name} slug={b.slug} />
            ))}
      </div>
    </section>
  )
}