import React from 'react'
import GlassSection from '../molecules/GlassSection'
// Remove these two imports if they were only used for preview
// import FeatBrandCard from '../molecules/FeatBrandCard'
// import FeatProductCard from '../molecules/FeatProductCard'
import { type AccentKey } from '../particles/tokens'

type Props = {
  density?: 'normal' | 'roomy'
  accent?: AccentKey
}

export default function UniverseFeaturedTaxon({
  density = 'normal',
  accent = 'supermarket',
}: Props) {
  const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }
  const stub: React.CSSProperties = {
    width: 220,
    height: 120,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    opacity: .85,
  }

  return (
    <GlassSection density={density} accent={accent}>
      <div style={rowStyle}>
        <div style={stub}>Brand card</div>
        <div style={stub}>Brand card</div>
        <div style={stub}>Brand card</div>
      </div>

      <div style={rowStyle}>
        <div style={stub}>Product card</div>
        <div style={stub}>Product card</div>
        <div style={stub}>Product card</div>
      </div>
    </GlassSection>
  )
}