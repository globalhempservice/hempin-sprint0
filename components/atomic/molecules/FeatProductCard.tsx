// components/atomic/molecules/FeatProductCard.tsx
import Link from 'next/link'
import CardFrame from '../atoms/CardFrame'
import ImageTile from '../atoms/ImageTile'
import PriceTag from '../atoms/PriceTag'
import { tokens } from '../particles/tokens'

type Props = {
  name: string
  slug: string
  image?: string | null
  price_cents?: number | null
  price_label?: string | null
  currency?: 'USD' | 'EUR' | 'GBP' // optional; defaults to USD
}

/**
 * Small, mostly-visual product tile for the Featured zone.
 * Image on top, name, and a compact price line.
 */
export default function FeedProductCard({
  name,
  slug,
  image,
  price_cents,
  price_label,
  currency = 'USD',
}: Props) {
  return (
    <Link href={`/products/${slug}`} style={{ textDecoration: 'none' }}>
      <CardFrame>
        {/* Visual */}
        <ImageTile
          src={image ?? undefined}
          alt={name}
          height={140}
          radius="top"
          fit="contain"
        />

        {/* Text */}
        <div style={{ padding: tokens.space[3] }}>
          <div
            style={{
              color: tokens.text.high,
              fontWeight: tokens.font.weight.bold,
              fontSize: tokens.font.size.sm,
              lineHeight: tokens.font.lh.snug,
              marginBottom: 6,
            }}
            title={name}
          >
            {name}
          </div>

          {/* Price (cents or label) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PriceTag cents={price_cents ?? undefined} label={price_label ?? undefined} currency={currency} size="sm" />
          </div>
        </div>
      </CardFrame>
    </Link>
  )
}