import React from 'react'
import GlassSection from '../molecules/GlassSection'
import MetaLineKPI from '../molecules/MetaLineKPI'
import StatTriplet from '../molecules/StatTriplet'
import SearchBar from '../molecules/SearchBar'
import { type AccentKey } from '../particles/tokens'

type Density = 'normal' | 'roomy'
type Totals = { brands: number; products: number; events: number }

type Enabled = {
  leadAction?: boolean      // reserved
  aboveFold?: boolean       // wrapper idea; if false, hide the top strip
  primaryFeed?: boolean     // preview block text
  searchBar?: boolean
  metaKpi?: boolean
  statTriplet?: boolean
  meta?: boolean            // reserved
  feedProductCard?: boolean // reserved
}

type Props = {
  totals: Totals
  density?: Density
  accent?: AccentKey
  enabled?: Enabled
}

export default function UniverseExploreTaxon({
  totals,
  density = 'normal',
  accent = 'supermarket',
  enabled = {},
}: Props) {
  const showStrip = enabled.aboveFold !== false
  const showSearch = enabled.searchBar !== false
  const showKpi = enabled.metaKpi !== false
  const showTriplet = enabled.statTriplet !== false
  const showPrimaryFeed = enabled.primaryFeed !== false

  return (
    <GlassSection density={density} accent={accent}>
      {showStrip && (
        <>
          {showSearch && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <SearchBar value={''} onChange={() => {}} placeholder="Search…" />
            </div>
          )}

          {showKpi && (
            <MetaLineKPI
              items={[
                { label: 'Brands', value: totals.brands },
                { label: 'Products', value: totals.products },
                { label: 'Events', value: totals.events },
              ]}
            />
          )}

{showTriplet && (
  <div style={{ marginTop: 8 }}>
    <StatTriplet
      a={{ label: 'Brands',   value: totals.brands }}
      b={{ label: 'Products', value: totals.products }}
      c={{ label: 'Events',   value: totals.events }}
    />
  </div>
)}
        </>
      )}

      {showPrimaryFeed && (
        <div style={{ opacity: 0.6, fontSize: 12, marginTop: 12 }}>
          (Primary feed preview is shown in the Explore section above)
        </div>
      )}
    </GlassSection>
  )
}