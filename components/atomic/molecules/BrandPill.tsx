// components/atomic/molecules/BrandPill.tsx
import Link from 'next/link'
import Pill from '../atoms/Pill'
import { tokens } from '../particles/tokens'

type Props = {
  name: string
  slug: string
  /** Optional square logo URL; will be rendered as a tiny round avatar */
  logoUrl?: string | null
  /** Visual density */
  size?: 'sm' | 'md'
}

export default function BrandPill({ name, slug, logoUrl, size = 'md' }: Props) {
  const padY = size === 'sm' ? 4 : tokens.component.pill.paddingY
  const padX = size === 'sm' ? 10 : tokens.component.pill.paddingX
  const fontSize = size === 'sm' ? tokens.font.size.xs : tokens.font.size.sm

  return (
    <Link
      href={`/brands/${slug}`}
      aria-label={`View ${name}`}
      style={{ textDecoration: 'none' }}
    >
      <Pill>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: `${padY}px ${padX}px`,
            borderRadius: tokens.radii.pill,
            // soft “glass” look, no hard border
            background: tokens.glass,
            boxShadow: tokens.shadow,
            color: tokens.text.base,
            fontSize,
            lineHeight: 1,
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={16}
              height={16}
              style={{
                display: 'block',
                width: 16,
                height: 16,
                borderRadius: tokens.radii.pill,
                objectFit: 'cover',
                background: tokens.neutral[800],
              }}
            />
          ) : null}
          <span style={{ color: tokens.text.high }}>{name}</span>
        </span>
      </Pill>
    </Link>
  )
}