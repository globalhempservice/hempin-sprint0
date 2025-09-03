import GlassSection from '../molecules/GlassSection'
import FeaturedBrands from '../organisms/FeaturedBrands'
import FeaturedProducts from '../organisms/FeaturedProducts'

export default function UniverseFeaturedTaxon() {
  return (
    <GlassSection>
      <FeaturedBrands />
      <FeaturedProducts />
    </GlassSection>
  )
}