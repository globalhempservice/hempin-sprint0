// components/atomic/taxons/UniverseExploreTaxon.tsx
import GlassSection from '../molecules/GlassSection'
import MetaLineKPI from '../molecules/MetaLineKPI'
import StatTriplet from '../molecules/StatTriplet'
import SearchBar from '../molecules/SearchBar'
import { tokens, type AccentKey } from '../particles/tokens'
import React from 'react'

type Totals = { brands: number; products: number; events: number }

type Props = {
  totals: Totals
  density?: 'normal' | 'roomy'
  accent?: AccentKey
}

export default function UniverseExploreTaxon({
  totals,
  density = 'normal',
  accent = 'supermarket',
}: Props) {
  return (
    <GlassSection density={density} accent={accent}>
      {/* example layout – keep whatever you already had here */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <SearchBar value={''} onChange={() => {}} placeholder="Search…" />
      </div>

      <MetaLineKPI
        items={[
          { label: 'Brands', value: totals.brands },
          { label: 'Products', value: totals.products },
          { label: 'Events', value: totals.events },
        ]}
      />
    </GlassSection>
  )
}