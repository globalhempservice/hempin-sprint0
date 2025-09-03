// components/atomic/organisms/HowItWorks.tsx
import { tokens } from '../particles/tokens'

type StepDef = { t: string; d: string }

export default function HowItWorks({
  steps,
  note,
}: {
  steps?: StepDef[]
  note?: string
}) {
  const items =
    steps && steps.length
      ? steps
      : [
          { t: 'Submit', d: 'Brands add products with images and details.' },
          { t: 'Review', d: 'Moderators verify quality & compliance.' },
          { t: 'Appear', d: 'Approved items show up on shelves.' },
        ]

  const Step = ({ t, d }: StepDef) => (
    <div
      style={{
        display: 'flex',
        gap: tokens.space[2],
        alignItems: 'flex-start',
        background: tokens.glass,
        border: `1px solid ${tokens.stroke}`,
        borderRadius: tokens.radii.md,
        padding: tokens.space[3],
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: tokens.radii.pill,
          background: `linear-gradient(135deg, ${tokens.accent.supermarket.a}, ${tokens.accent.supermarket.b})`,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontWeight: tokens.font.weight.bold,
            color: tokens.text.high,
            marginBottom: 2,
          }}
        >
          {t}
        </div>
        <div
          style={{
            opacity: 0.85,
            color: tokens.text.base,
            fontSize: tokens.font.size.sm,
          }}
        >
          {d}
        </div>
      </div>
    </div>
  )

  return (
    <section style={{ marginTop: tokens.space[6] }}>
      <h3
        style={{
          fontFamily: tokens.font.family,
          fontSize: tokens.font.size.h5,
          fontWeight: tokens.font.weight.bold,
          color: tokens.text.high,
          marginBottom: tokens.space[3],
        }}
      >
        How it works
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: tokens.space[3],
        }}
      >
        {items.map((s, i) => (
          <Step key={i} {...s} />
        ))}
      </div>
      {note && (
        <p
          style={{
            color: tokens.text.dim,
            marginTop: tokens.space[3],
            fontSize: tokens.font.size.sm,
          }}
        >
          {note}
        </p>
      )}
    </section>
  )
}