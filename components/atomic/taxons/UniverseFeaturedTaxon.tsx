import GlassSection from '../molecules/GlassSection'
import FeaturedBrands from '../organisms/FeaturedBrands'

type Props = {
  /** optional padding density to pass to GlassSection */
  density?: 'normal' | 'roomy'
}

export default function UniverseFeaturedSection({ density = 'normal' }: Props) {
  return (
    <GlassSection title="Featured brands" density={density}>
      <FeaturedBrands />
    </GlassSection>
  )
}