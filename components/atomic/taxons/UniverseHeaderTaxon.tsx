// components/atomic/taxons/UniverseHeaderTaxon.tsx
import GlassSection from '../molecules/GlassSection'
import UniverseHeader from '../organisms/UniverseHeader'
import HeaderCta from '../molecules/HeaderCta'
import { AccentKey } from '../particles/tokens'   // <- add

type Props = {
  kicker: string
  title: string
  subtitle?: string
  cta: { label: string; href: string }
  /** optional style knobs for the section */
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
      <UniverseHeader kicker={kicker} title={title} subtitle={subtitle} />
      <div style={{ marginTop: 20 }}>
        <HeaderCta primary={cta} />
      </div>
    </GlassSection>
  )
}