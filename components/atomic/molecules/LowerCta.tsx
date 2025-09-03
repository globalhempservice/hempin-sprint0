// components/atomic/molecules/LowerCta.tsx
import Link from 'next/link'
import { tokens } from '../particles/tokens'
import Kicker from './Kicker'

type Props = {
  label: string
  href: string
  kicker?: string
  copy?: string
}

/**
 * A full-width CTA strip usually placed at the bottom of a universe page.
 */
export default function LowerCta({ label, href, kicker, copy }: Props) {
  return (
    <div
      style={{
        marginTop: tokens.space[12],
        padding: `${tokens.space[10]}px ${tokens.space[6]}px`,
        borderRadius: tokens.radii.lg,
        background: tokens.glassStrong,
        textAlign: 'center',
      }}
    >
      {kicker && <Kicker text={kicker} />}
      {copy && (
        <p
          style={{
            color: tokens.text.base,
            marginBottom: tokens.space[4],
            fontSize: tokens.font.size.md,
            lineHeight: tokens.font.lh.relaxed,
          }}
        >
          {copy}
        </p>
      )}
      <Link
        href={href}
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          borderRadius: tokens.radii.pill,
          background: `linear-gradient(135deg, ${tokens.accent.supermarket.a}, ${tokens.accent.supermarket.b})`,
          color: '#090c0f',
          fontWeight: tokens.font.weight.bold,
          textDecoration: 'none',
          transition: `all ${tokens.motion.base}ms ${tokens.motion.spring}`,
        }}
      >
        {label}
      </Link>
    </div>
  )
}