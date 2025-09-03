// components/atomic/molecules/Kicker.tsx
import { tokens } from '../particles/tokens'

type Props = {
  text: string
}

/**
 * Small pre-title label, often used above BigTitle.
 */
export default function Kicker({ text }: Props) {
  return (
    <div
      style={{
        fontSize: tokens.font.size.sm,
        fontWeight: tokens.font.weight.medium,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: tokens.text.dim,
        marginBottom: tokens.space[2],
      }}
    >
      {text}
    </div>
  )
}