// components/atomic/molecules/LowerHow.tsx
import { tokens } from '../particles/tokens'

type Props = {
  title?: string
  steps?: string[]
}

/**
 * A "How it works" strip for the lower part of a universe page.
 */
export default function LowerHow({ title = "How it works", steps = [] }: Props) {
  return (
    <div
      style={{
        marginTop: tokens.space[12],
        padding: `${tokens.space[10]}px ${tokens.space[6]}px`,
        borderRadius: tokens.radii.lg,
        background: tokens.glass,
      }}
    >
      <h3
        style={{
          fontSize: tokens.font.size.h4,
          fontWeight: tokens.font.weight.bold,
          color: tokens.text.high,
          marginBottom: tokens.space[6],
          textAlign: 'center',
        }}
      >
        {title}
      </h3>
      {steps.length > 0 && (
        <ol
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.space[4],
            maxWidth: 640,
            margin: '0 auto',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {steps.map((s, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.space[3],
                color: tokens.text.base,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: tokens.radii.pill,
                  background: tokens.accent.supermarket.a,
                  color: '#000',
                  fontWeight: tokens.font.weight.bold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: tokens.font.size.sm,
                }}
              >
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}