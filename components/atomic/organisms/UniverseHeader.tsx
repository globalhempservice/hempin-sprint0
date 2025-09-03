// components/atomic/organisms/UniverseHeader.tsx
import Pill from '../atoms/Pill'
import { tokens } from '../particles/tokens'

export default function UniverseHeader({
  kicker,
  title,
  subtitle,
  align = 'left',
}: {
  kicker: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}) {
  const textAlign = align === 'center' ? 'center' : 'left'

  return (
    <header style={{ textAlign, marginBottom: tokens.space[6] }}>
      <div style={{ marginBottom: tokens.space[2] }}>
        <Pill>{kicker}</Pill>
      </div>
      <h1
        style={{
          fontSize: 'clamp(2rem,4vw,3rem)',
          lineHeight: tokens.font.lh.tight,
          letterSpacing: '-.02em',
          margin: `${tokens.space[2]}px 0 0`,
          color: tokens.text.high,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            color: tokens.text.base,
            maxWidth: 740,
            marginTop: tokens.space[2],
            marginInline: align === 'center' ? 'auto' : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}