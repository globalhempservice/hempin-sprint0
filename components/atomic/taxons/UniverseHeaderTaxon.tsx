import React from 'react'
import GlassSection from '../molecules/GlassSection'
import UniverseHeader from '../organisms/UniverseHeader'
import HeaderCta from '../molecules/HeaderCta'
import { type AccentKey } from '../particles/tokens'

type Cta = { label: string; href: string }

type Props = {
  kicker?: string
  title: string
  subtitle?: string
  cta?: Cta
  density?: 'normal' | 'roomy'
  accent?: AccentKey
}

export default function UniverseHeaderTaxon({
  kicker,
  title,
  subtitle,
  cta,
  density = 'normal',
  accent = 'supermarket',
}: Props) {
  return (
    <GlassSection density={density} accent={accent}>
      <UniverseHeader kicker={kicker ?? ''} title={title} subtitle={subtitle} />
      {cta && (
        <div style={{ marginTop: 20 }}>
          {/* adjust if your HeaderCta expects a different prop shape */}
          <HeaderCta primary={{ label: cta.label, href: cta.href }} />
        </div>
      )}
    </GlassSection>
  )
}