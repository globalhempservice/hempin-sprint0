import GlassSection from '../atomic/molecules/GlassSection'
import HowItWorks from '../atomic/organisms/HowItWorks'
import LowerCta from '../atomic/molecules/LowerCta'
import Meta from '../atomic/molecules/Meta'

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