import React from 'react'
import GlassSection from '../molecules/GlassSection'
import UniverseHeader from '../organisms/UniverseHeader'
import HeaderCta from '../molecules/HeaderCta'
import { type AccentKey } from '../particles/tokens'

type Density = 'normal' | 'roomy'

type Enabled = {
  universeHeader?: boolean
  headerCta?: boolean
  bigTitle?: boolean
  kicker?: boolean
  headerCtaStrip?: boolean // reserved, not rendered in this taxon right now
}

type Props = {
  /** Content (all optional so caller can omit) */
  kicker?: string
  title?: string
  subtitle?: string
  cta?: { label: string; href: string }

  /** Style */
  density?: Density
  accent?: AccentKey

  /** Toggle sub-parts on/off */
  enabled?: Enabled
}

export default function UniverseHeaderTaxon({
  kicker = 'Supermarket',
  title = 'Shop the hemp multiverse',
  subtitle = 'Curated goods from vetted brands. Cannabis items are separate by default.',
  cta = { label: 'Register your brand', href: '/account/brands/new' },
  density = 'normal',
  accent = 'supermarket',
  enabled = {},
}: Props) {
  const showHeader = enabled.universeHeader !== false
  const showCta = enabled.headerCta !== false
  const showKicker = enabled.kicker !== false
  const showTitle = enabled.bigTitle !== false

  return (
    <GlassSection density={density} accent={accent}>
      {showHeader && (
        <UniverseHeader
          kicker={showKicker ? kicker : undefined}
          title={showTitle ? title : ''}
          subtitle={subtitle}
        />
      )}

      {showCta && (
        <div style={{ marginTop: 20 }}>
          <HeaderCta primary={cta} />
        </div>
      )}
    </GlassSection>
  )
}