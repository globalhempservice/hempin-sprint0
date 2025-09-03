import GlassSection from '../atomic/molecules/GlassSection'
import SearchBar from '../atomic/molecules/SearchBar'
import MetaLineKPI from '../atomic/molecules/MetaLineKPI'
import StatTriplet from '../atomic/molecules/StatTriplet'
import ItemGrid from '../atomic/organisms/ItemGrid'
import { useState } from 'react'

export default function UniverseExploreTaxon({
  totals,
}: {
  totals: { brands: number; products: number; events: number }
}) {
  const [q, setQ] = useState('')

  return (
    <GlassSection>
      <SearchBar value={q} onChange={setQ} onReset={() => setQ('')} />
      <div style={{ margin: '20px 0' }}>
        <MetaLineKPI
          items={[
            { label: 'Brands', value: totals.brands },
            { label: 'Products', value: totals.products },
            { label: 'Events', value: totals.events },
          ]}
        />
      </div>
      <StatTriplet
        a={{ label: 'Brands', value: totals.brands }}
        b={{ label: 'Products', value: totals.products }}
        c={{ label: 'Events', value: totals.events }}
      />
      <div style={{ marginTop: 20 }}>
        <ItemGrid q={q} />
      </div>
    </GlassSection>
  )
}