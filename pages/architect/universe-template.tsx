// pages/architect/universe-template.tsx
import { useState } from 'react'

import UniverseTemplate from '../../components/atomic/templates/UniverseTemplate'
import { ControlsPanel } from '../../components/architect/ControlsPanel'
import { defaultUniverseConfig, type UniverseConfig } from '../../components/architect/universeConfig'
import { TokensProvider } from '../../components/atomic/particles/TokensProvider'

import {
  UniverseHeaderSection,
  UniverseFeaturedSection,
  UniverseExploreSection,
  UniverseLowerSection,
} from '../../components/atomic/taxons'

export default function ArchitectUniverseTemplate() {
  const [cfg, setCfg] = useState<UniverseConfig>(defaultUniverseConfig)
  const { accent, density, showBackground } = cfg.look

  // If showBackground = true → let the template render its default orb (pass undefined)
  // If showBackground = false → override with an empty element so nothing renders
  const bgOverride = showBackground ? undefined : <div aria-hidden />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      <TokensProvider>
        <UniverseTemplate
          accentKey={accent}
          background={bgOverride}

          {/* Header taxon */}
          header={
            cfg.taxons.header.enabled ? (
              <UniverseHeaderSection
                accent={accent}
                density={density}
                enabled={{
                  universeHeader: cfg.taxons.header.universeHeader.enabled,
                  headerCta: cfg.taxons.header.headerCta.enabled,
                  bigTitle: cfg.taxons.header.bigTitle.enabled,
                  kicker: cfg.taxons.header.kicker.enabled,
                  headerCtaStrip: cfg.taxons.header.headerCtaStrip.enabled,
                }}
              />
            ) : null
          }

          {/* We render explore summary (KPI/meta/search/etc.) in aboveFold */}
          aboveFold={
            cfg.taxons.explore.enabled ? (
              <UniverseExploreSection
                totals={cfg.totals}
                density={density}
                accent={accent}
                enabled={{
                  leadAction:   cfg.taxons.explore.leadAction.enabled,
                  aboveFold:    cfg.taxons.explore.aboveFold.enabled,
                  primaryFeed:  cfg.taxons.explore.primaryFeed.enabled,
                  searchBar:    cfg.taxons.explore.searchBar.enabled,
                  metaKpi:      cfg.taxons.explore.metaKpi.enabled,
                  statTriplet:  cfg.taxons.explore.statTriplet.enabled,
                  meta:         cfg.taxons.explore.meta.enabled,
                  feedProductCard: cfg.taxons.explore.feedProductCard.enabled,
                }}
              />
            ) : null
          }

          {/* Template requires primaryFeed; we preview the real grid inside Explore,
              so here we pass a small placeholder to satisfy the slot. */}
          primaryFeed={
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              (Primary feed preview is shown in the Explore section above)
            </div>
          }

          {/* Featured taxon goes into secondaryFeed */}
          secondaryFeed={
            cfg.taxons.featured.enabled ? (
              <UniverseFeaturedSection
                density={density}
                enabled={{
                  featuredA:       cfg.taxons.featured.featuredA.enabled,
                  featuredB:       cfg.taxons.featured.featuredB.enabled,
                  featBrandCard:   cfg.taxons.featured.featBrandCard.enabled,
                  featProductCard: cfg.taxons.featured.featProductCard.enabled,
                }}
              />
            ) : null
          }

          {/* Lower taxon */}
          howItWorks={
            cfg.taxons.lower.enabled ? (
              <UniverseLowerSection
                density={density}
                enabled={{
                  howItWorks:   cfg.taxons.lower.howItWorks.enabled,
                  lowerCta:     cfg.taxons.lower.lowerCta.enabled,
                  lowerHow:     cfg.taxons.lower.lowerHow.enabled,
                  lowerCtaStrip: cfg.taxons.lower.lowerCtaStrip.enabled,
                }}
              />
            ) : null
          }

          footerMeta={
            <div style={{ color: '#9ac8b7' }}>
              HEMPIN — {accent} • density: {density}
            </div>
          }
        />
      </TokensProvider>

      {/* Right-side live controls */}
      <ControlsPanel cfg={cfg} setCfg={setCfg} />
    </div>
  )
}