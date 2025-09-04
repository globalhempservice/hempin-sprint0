import React from 'react'
import GlassSection from '../molecules/GlassSection'
import FeatBrandCard from '../molecules/FeatBrandCard'
import FeatProductCard from '../molecules/FeatProductCard'
import { type AccentKey } from '../particles/tokens'

type Density = 'normal' | 'roomy'

type Enabled = {
  featuredA?: boolean     // brands strip/row
  featuredB?: boolean     // products strip/row
  featBrandCard?: boolean // show brand cards
  featProductCard?: boolean // show product cards
}

type Props = {
  density?: Density
  accent?: AccentKey
  enabled?: Enabled
}

export default function UniverseFeaturedTaxon({
  density = 'normal',
  accent = 'supermarket',
  enabled = {},
}: Props) {
  const showA = enabled.featuredA !== false
  const showB = enabled.featuredB !== false
  const showBrandCard = enabled.featBrandCard !== false
  const showProductCard = enabled.featProductCard !== false

  return (
    <GlassSection density={density} accent={accent}>
      {showA && showBrandCard && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          {/* Replace with your actual data mapping */}
          <FeatBrandCard />
          <FeatBrandCard />
          <FeatBrandCard />
        </div>
      )}

      {showB && showProductCard && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Replace with your actual data mapping */}
          <FeatProductCard />
          <FeatProductCard />
          <FeatProductCard />
        </div>
      )}
    </GlassSection>
  )
}