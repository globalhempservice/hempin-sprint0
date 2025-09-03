// components/atomic/molecules/MetaLineKPI.tsx
import { tokens } from '../particles/tokens'

type Props = {
  items: { label: string; value: number | string }[]
}

/**
 * Horizontal KPI line — shows a few compact stats like "Brands · 12 | Products · 34".
 */
export default function MetaLineKPI({ items }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: tokens.space[4],
        fontSize: tokens.font.size.sm,
        lineHeight: tokens.font.lh.snug,
        color: tokens.text.dim,
      }}
    >
      {items.map((it, i) => (
        <span key={i}>
          <span style={{ color: tokens.text.high, fontWeight: tokens.font.weight.bold }}>
            {it.value}
          </span>{' '}
          {it.label}
        </span>
      ))}
    </div>
  )
}
