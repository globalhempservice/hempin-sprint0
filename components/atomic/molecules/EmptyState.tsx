// components/atomic/molecules/EmptyState.tsx
import { tokens, getAccent } from '../particles/tokens'

type Props = {
  title: string
  hint?: string
  /** Which universe accent to glow with */
  accent?: 'supermarket' | 'trade' | 'events' | 'research' | 'places'
}

export default function EmptyState({ title, hint, accent = 'supermarket' }: Props) {
  const { a, b } = getAccent(accent)

  return (
    <div
      style={{
        background: tokens.glass,
        border: `1px solid ${tokens.stroke}`,
        borderRadius: tokens.radii.lg,
        padding: tokens.space[7],
        textAlign: 'center',
        gridColumn: '1 / -1',
        boxShadow: tokens.shadow,
      }}
    >
      {/* glowing orb accent */}
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: tokens.radii.orb,
          margin: '0 auto 10px',
          background: tokens.orb(a, b),
          filter: 'blur(22px)',
          opacity: 0.4,
        }}
      />

      {/* main title */}
      <div
        style={{
          fontWeight: tokens.font.weight.bold,
          fontSize: tokens.font.size.md,
          color: tokens.text.high,
        }}
      >
        {title}
      </div>

      {/* optional hint */}
      {hint && (
        <div
          style={{
            color: tokens.text.dim,
            marginTop: tokens.space[1],
            fontSize: tokens.font.size.sm,
          }}
        >
          {hint}
        </div>
      )}
    </div>
  )
}