// components/atomic/molecules/Meta.tsx
import { tokens } from '../particles/tokens'

type Props = {
  text: string
}

/**
 * Small auxiliary text (e.g. "Updated 2 days ago").
 */
export default function Meta({ text }: Props) {
  return (
    <span
      style={{
        fontSize: tokens.font.size.sm,
        lineHeight: tokens.font.lh.snug,
        color: tokens.text.dim,
        letterSpacing: 0.2,
      }}
    >
      {text}
    </span>
  )
}