// components/atomic/atoms/Pill.tsx
import { tokens } from '../particles/tokens'

export default function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        border: `1px solid ${tokens.stroke}`,
        borderRadius: tokens.radii.pill,
        padding: `${tokens.component.pill.paddingY}px ${tokens.component.pill.paddingX}px`,
        fontSize: tokens.font.size.sm,
        color: tokens.text.base,
        background: tokens.glass,
        lineHeight: tokens.font.lh.snug,
      }}
    >
      {children}
    </span>
  )
}