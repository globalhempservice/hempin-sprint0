// components/atomic/molecules/StatTriplet.tsx
import { tokens } from '../particles/tokens'

type Stat = { label: string; value: number | string }

export default function StatTriplet({ a, b, c }: { a: Stat; b: Stat; c: Stat }) {
  const Cell = ({ label, value }: Stat) => (
    <div
      style={{
        background: tokens.glass,
        borderRadius: tokens.radii.md,
        padding: tokens.space[4],
        textAlign: 'center',
        border: `1px solid ${tokens.stroke}`,
      }}
    >
      <div
        style={{
          fontSize: tokens.font.size.h4,
          fontWeight: tokens.font.weight.bold,
          color: tokens.text.high,
          marginBottom: tokens.space[1],
        }}
      >
        {value}
      </div>
      <div style={{ color: tokens.text.dim, fontSize: tokens.font.size.sm }}>
        {label}
      </div>
    </div>
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: tokens.space[3],
      }}
    >
      <Cell {...a} />
      <Cell {...b} />
      <Cell {...c} />
    </div>
  )
}