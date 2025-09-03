// components/atomic/molecules/FeatBrandCard.tsx
import Link from 'next/link'
import CardFrame from '../atoms/CardFrame'
import ImageTile from '../atoms/ImageTile'
import { tokens } from '../particles/tokens'

type Props = {
  name: string
  slug: string
  logoUrl?: string | null
  category?: string
}

export default function FeatBrandCard({ name, slug, logoUrl, category }: Props) {
  return (
    <Link href={`/brands/${slug}`} style={{ textDecoration: 'none' }}>
      <CardFrame>
        {/* Logo or fallback orb */}
        <ImageTile
          src={logoUrl ?? undefined}
          alt={name}
          height={80}
          radius="all"
          fit="contain"
        />

        <div style={{ padding: tokens.space[3], textAlign: 'center' }}>
          <div
            style={{
              fontSize: tokens.font.size.sm,
              fontWeight: tokens.font.weight.bold,
              color: tokens.text.high,
              marginBottom: category ? 4 : 0,
              lineHeight: tokens.font.lh.tight,
            }}
          >
            {name}
          </div>
          {category && (
            <div
              style={{
                fontSize: tokens.font.size.xs,
                color: tokens.text.dim,
                lineHeight: tokens.font.lh.snug,
              }}
            >
              {category}
            </div>
          )}
        </div>
      </CardFrame>
    </Link>
  )
}