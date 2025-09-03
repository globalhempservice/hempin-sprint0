// components/atomic/molecules/FeedProductCard.tsx
import Link from 'next/link'
import CardFrame from '../atoms/CardFrame'
import ImageTile from '../atoms/ImageTile'
import PriceTag from '../atoms/PriceTag'
import { tokens } from '../particles/tokens'

type Props = {
  id: string
  slug: string
  name: string
  brand?: { name: string; slug: string } | null
  image?: string | null
  price_cents?: number | null
  price_label?: string | null
  currency?: 'USD' | 'EUR' | 'GBP'
}

/**
 * Rich product card for the Explore (primary feed) zone.
 * Shows image, product name, brand, and price.
 */
export default function FeedProductCard({
  id,
  slug,
  name,
  brand,
  image,
  price_cents,
  price_label,
  currency = 'USD',
}: Props) {
  return (
    <Link
      key={id}
      href={`/products/${slug}`}
      style={{ textDecoration: 'none' }}
    >
      <CardFrame>
        {/* Visual */}
        <ImageTile
          src={image ?? undefined}
          alt={name}
          height={180}
          radius="top"
          fit="cover"
        />

        {/* Info */}
        <div style={{ padding: tokens.space[3] }}>
          {/* Product name */}
          <div
            style={{
              fontWeight: tokens.font.weight.bold,
              fontSize: tokens.font.size.lg,
              color: tokens.text.high,
              lineHeight: tokens.font.lh.snug,
              marginBottom: tokens.space[2],
            }}
            title={name}
          >
            {name}
          </div>

          {/* Brand + Price */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: tokens.text.dim,
                fontSize: tokens.font.size.sm,
              }}
            >
              {brand ? brand.name : '—'}
            </span>

            <PriceTag
              cents={price_cents ?? undefined}
              label={price_label ?? undefined}
              currency={currency}
              size="md"
            />
          </div>
        </div>
      </CardFrame>
    </Link>
  )
}