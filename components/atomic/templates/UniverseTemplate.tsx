// components/atomic/templates/UniverseTemplate.tsx
import React, { ReactNode, isValidElement, cloneElement } from 'react'
import { tokens, type AccentKey, getAccent } from '../../atomic/particles/tokens'

export type HeaderOverrides = {
  kicker?: string
  title?: string
  subtitle?: string
  cta?: { label: string; href: string }
}

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

  // OVERRIDES (from architect cfg)
  /** Send text overrides for the header organism; we’ll clone the node with these props if possible */
  headerOverrides?: HeaderOverrides

  // STYLE / LAYOUT
  /** Universe accent to tint the background orb (defaults to 'supermarket') */
  accentKey?: AccentKey
  /** Whether to render the soft orb background (default true) */
  showBackground?: boolean
  /** Optional custom background element; if omitted we render a soft orb BG (when showBackground is true) */
  background?: ReactNode
  /** Content max width in px (default 1100) */
  maxWidth?: number
  /** Density preset that maps to padding (overrides pad if set) */
  density?: 'normal' | 'roomy'
  /** Extra padding around content (default 20) — ignored if density is provided */
  pad?: number
}


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
    headerOverrides,
    leadActions,
    aboveFold,
    primaryFeed,
    secondaryFeed,
    howItWorks,
    ctaStrip,
    footerMeta,

    background,
    accentKey = 'supermarket',
    showBackground = true,

    density,
    pad: padProp = 20,
    maxWidth = 1100,
  } = p

  
  const pad = density === 'roomy' ? tokens.space[10] : density === 'normal' ? tokens.space[6] : padProp

  
  const headerNode =
    headerOverrides && isValidElement(header)
      ? cloneElement(header as any, { ...headerOverrides })
      : header

  return (
    <div
      style={{
        minHeight: '100vh',
        color: tokens.text.high,
        background: tokens.neutral[900],
        position: 'relative',
      }}
    >
     
      {showBackground && (background ?? <DefaultBackground accentKey={accentKey} />)}

     
      <div
        style={{
          position: 'relative',
          zIndex: tokens.z.content,
          maxWidth,
          margin: '0 auto',
          padding: pad,
        }}
      >
       
        <Section>{headerNode}</Section>

       
        {leadActions && <Section>{leadActions}</Section>}

        
        {aboveFold && <Section>{aboveFold}</Section>}

       
        <Section>{primaryFeed}</Section>

       
        {secondaryFeed && <Section>{secondaryFeed}</Section>}

       
        {howItWorks && <Section pad={12}>{howItWorks}</Section>}

        
        {ctaStrip && <Section pad={12}>{ctaStrip}</Section>}

       
        {footerMeta && <footer style={{ margin: '18px 0' }}>{footerMeta}</footer>}
      </div>
    </div>
  )
}