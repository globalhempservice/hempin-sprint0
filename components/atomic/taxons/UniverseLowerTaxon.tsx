import GlassSection from '../molecules/GlassSection'
import HowItWorks from '../organisms/HowItWorks'
import LowerCta from '../molecules/LowerCta'
import Meta from '../molecules/Meta'

export default function UniverseLowerTaxon({
  note,
  cta,
  footer,
}: {
  note?: string
  cta: { label: string; href: string }
  footer: string
}) {
  return (
    <GlassSection>
      <HowItWorks note={note} />
      <div style={{ margin: '32px 0' }}>
        <LowerCta {...cta} />
      </div>
      <Meta text={footer} />
    </GlassSection>
  )
}