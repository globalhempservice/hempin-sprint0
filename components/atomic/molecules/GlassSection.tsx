// components/atomic/molecules/GlassSection.tsx
import React from 'react'
import { tokens, getAccent } from '../particles/tokens'
import type { AccentKey } from '../particles/tokens'

type Props = {
  children?: React.ReactNode
  /** Optional small label above the title */
  kicker?: string
  /** Optional section title */
  title?: string
  /** Optional description copy under the title */
  description?: string
  /** Tight or roomy padding */
  density?: 'normal' | 'roomy'
  /** Universe accent to softly tint the background */
  accent?: AccentKey
  /** Extra style passthrough */
  style?: React.CSSProperties
}

export default function GlassSection({
  children,
  kicker,
  title,
  description,
  density = 'normal',
  accent,
  style,
}: Props) {
  const pad = density === 'roomy' ? tokens.space[10] : tokens.space[6]

  // Resolve accent (if any) into a subtle orb background layer
  const orbLayer =
    accent
      ? tokens.orb(getAccent(accent).a, getAccent(accent).b)
      : undefined

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: tokens.radii.lg,
        background: tokens.glass,     // soft glass surface (no hard borders)
        boxShadow: tokens.shadow,     // subtle elevation
        padding: pad,
        outline: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Accent orb (very subtle, under content) */}
      {orbLayer && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: orbLayer,
            opacity: 0.35,
            filter: 'blur(22px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {(kicker || title || description) && (
        <header style={{ position:'relative', zIndex: 1, marginBottom: tokens.space[5] }}>
          {kicker && (
            <div
              style={{
                display: 'inline-block',
                padding: `6px 10px`,
                borderRadius: tokens.radii.pill,
                background: tokens.glassStrong,
                fontSize: tokens.font.size.xs,
                letterSpacing: 0.4,
                color: tokens.text.dim,
              }}
            >
              {kicker}
            </div>
          )}
          {title && (
            <h2
              style={{
                margin: kicker ? `${tokens.space[3]}px 0 0 0` : 0,
                fontFamily: tokens.font.family,
                fontWeight: tokens.font.weight.bold,
                fontSize: tokens.font.size.h4,
                lineHeight: tokens.font.lh.tight as number,
                color: tokens.text.high,
              }}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              style={{
                marginTop: tokens.space[2],
                color: tokens.text.base,
                lineHeight: tokens.font.lh.relaxed as number,
                maxWidth: 800,
              }}
            >
              {description}
            </p>
          )}
        </header>
      )}

      <div style={{ position:'relative', zIndex: 1 }}>{children}</div>
    </section>
  )
}