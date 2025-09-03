import React from 'react'
import GlassSection from '../molecules/GlassSection'
import FeatBrandCard from '../molecules/FeatBrandCard'
import FeatProductCard from '../molecules/FeatProductCard'
import { type AccentKey } from '../particles/tokens'

type Props = {
  density?: 'normal' | 'roomy'
  accent?: AccentKey
  // ...whatever else you already accept (data, titles, etc.)
}

export default function UniverseFeaturedTaxon({
  density = 'normal',
  accent = 'supermarket',
  // ...rest
}: Props) {
  return (
    <GlassSection density={density} accent={accent}>
      {/* existing featured brands/products content */}
    </GlassSection>
  )
}