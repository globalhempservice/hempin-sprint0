// components/atomic/molecules/BigTitle.tsx
import { tokens } from '../particles/tokens'

type Props = {
  title: string
  eyebrow?: string
  align?: 'left' | 'center'
}

export default function BigTitle({ title, eyebrow, align = 'center' }: Props) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: tokens.space[6],
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontSize: tokens.font.size.sm,
            fontWeight: tokens.font.weight.medium,
            color: tokens.text.dim,
            letterSpacing: 1,
            marginBottom: tokens.space[2],
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
      )}

      <h1
        style={{
          fontFamily: tokens.font.family,
          fontSize: tokens.font.size.h2,
          fontWeight: tokens.font.weight.bold,
          lineHeight: tokens.font.lh.tight,
          background: `linear-gradient(90deg, ${tokens.accent.supermarket.a}, ${tokens.accent.supermarket.b})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
        }}
      >
        {title}
      </h1>
    </div>
  )
}