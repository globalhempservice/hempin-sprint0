// components/atomic/templates/UniverseTemplate.tsx
import { ReactNode } from 'react'
import { tokens, type AccentKey, getAccent } from '../../atomic/particles/tokens'

export type UniverseTemplateProps = {
  // SLOT API
  header: ReactNode
  leadActions?: ReactNode
  aboveFold?: ReactNode
  primaryFeed: ReactNode
  secondaryFeed?: ReactNode
  howItWorks?: ReactNode
  ctaStrip?: ReactNode
  footerMeta?: ReactNode

  // STYLE / LAYOUT
  /** Universe accent to tint the background orb (defaults to 'supermarket' to be safe) */
  accentKey?: AccentKey
  /** Optional custom background element; if omitted we render a soft orb BG */
  background?: ReactNode
  /** Content max width in px (default 1100) */
  maxWidth?: number
  /** Extra padding around content (default 20) */
  pad?: number
}

/** Internal glass section wrapper (no hard borders) */
function Section({ children, pad = 0 }: { children: ReactNode; pad?: number }) {
  return (
    <section
      style={{
        margin: '10px 0',
        padding: pad,
        background: pad ? tokens.glass : 'transparent',
        borderRadius: pad ? tokens.radii.lg : 0,
        boxShadow: pad ? tokens.shadow : undefined,
      }}
    >
      {children}
    </section>
  )
}

/** Default soft animated orb background (fixed, subtle, no heavy GPU cost) */
function DefaultBackground({ accentKey = 'supermarket' as AccentKey }) {
  const acc = getAccent(accentKey)
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: tokens.z.orb,
        pointerEvents: 'none',
        background: `
          radial-gradient(1200px 600px at 0% -10%, ${acc.a}1f, transparent 50%),
          radial-gradient(1200px 600px at 100% 110%, ${acc.b}19, transparent 50%)
        `,
        // very light motion
        animation: 'universe-orb 26s linear infinite',
      }}
    >
      <style jsx>{`
        @keyframes universe-orb {
          0% { transform: translate3d(0,0,0) }
          50% { transform: translate3d(0, -10px, 0) }
          100% { transform: translate3d(0,0,0) }
        }
      `}</style>
    </div>
  )
}

export default function UniverseTemplate(p: UniverseTemplateProps) {
  const {
    header,
    leadActions,
    aboveFold,
    primaryFeed,
    secondaryFeed,
    howItWorks,
    ctaStrip,
    footerMeta,
    background,
    accentKey = 'supermarket',
    maxWidth = 1100,
    pad = 20,
  } = p

  return (
    <div
      style={{
        minHeight: '100vh',
        color: tokens.text.high,
        background: tokens.neutral[900],
        position: 'relative',
      }}
    >
      {/* Background layer */}
      {background ?? <DefaultBackground accentKey={accentKey} />}

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          zIndex: tokens.z.content,
          maxWidth,
          margin: '0 auto',
          padding: pad,
        }}
      >
        {/* Header zone */}
        <Section>{header}</Section>

        {/* LeadActions (search, filters, reset) */}
        {leadActions && <Section>{leadActions}</Section>}

        {/* Above-fold (KPIs, stat triplet, meta line…) */}
        {aboveFold && <Section>{aboveFold}</Section>}

        {/* Primary feed (the big grid / list) */}
        <Section>{primaryFeed}</Section>

        {/* Secondary feed (featured brands / featured products strip) */}
        {secondaryFeed && <Section>{secondaryFeed}</Section>}

        {/* How it works (optional) */}
        {howItWorks && <Section pad={12}>{howItWorks}</Section>}

        {/* CTA strip (optional) */}
        {ctaStrip && (
          <Section pad={12}>
            {ctaStrip}
          </Section>
        )}

        {/* Footer meta (optional) */}
        {footerMeta && <footer style={{ margin: '18px 0' }}>{footerMeta}</footer>}
      </div>
    </div>
  )
}