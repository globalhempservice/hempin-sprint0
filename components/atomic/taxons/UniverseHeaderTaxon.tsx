import GlassSection from '../molecules/GlassSection'
import UniverseHeader from '../organisms/UniverseHeader'
import HeaderCta from '../molecules/HeaderCta'

export default function UniverseHeaderTaxon({
  kicker,
  title,
  subtitle,
  cta,
}: {
  kicker: string
  title: string
  subtitle?: string
  cta: { label: string; href: string }
}) {
  return (
    <GlassSection accent="supermarket">
      <UniverseHeader kicker={kicker} title={title} subtitle={subtitle} />
      <div style={{ marginTop: 20 }}>
        <HeaderCta primary={cta} />
      </div>
    </GlassSection>
  )
}