import GlassSection from '../atomic/molecules/GlassSection'
import FeaturedBrands from '../atomic/organisms/FeaturedBrands'
import FeaturedProducts from '../atomic/organisms/FeaturedProducts'

export default function UniverseFeaturedTaxon() {
  return (
    <GlassSection>
      <FeaturedBrands />
      <FeaturedProducts />
    </GlassSection>
  )
}