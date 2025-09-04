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
  const [busy, setBusy] = useState<'idle' | 'saving' | 'loading'>('idle')
  const [msg, setMsg] = useState('')

  const { accent, density, showBackground } = cfg.look
  const bgOverride = showBackground ? undefined : <div aria-hidden />

  // Use the current accent as the config key in the Netlify function (?name=…)
  const CONFIG_NAME = accent
  const FN_URL = '/.netlify/functions/universe-config'

  async function saveConfig() {
    try {
      setBusy('saving')
      setMsg('')
      const res = await fetch(`${FN_URL}?name=${encodeURIComponent(CONFIG_NAME)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg('Saved ✓')
    } catch (e: any) {
      setMsg('Save failed: ' + (e?.message || 'Unknown error'))
    } finally {
      setBusy('idle')
    }
  }

  async function loadConfig() {
    try {
      setBusy('loading')
      setMsg('')
      const res = await fetch(`${FN_URL}?name=${encodeURIComponent(CONFIG_NAME)}`)
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (data) setCfg(data as UniverseConfig)
      setMsg(data ? 'Loaded ✓' : `No saved config yet for "${CONFIG_NAME}"`)
    } catch (e: any) {
      setMsg('Load failed: ' + (e?.message || 'Unknown error'))
    } finally {
      setBusy('idle')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      <TokensProvider>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={saveConfig} disabled={busy !== 'idle'}>
            {busy === 'saving' ? 'Saving…' : '💾 Save'}
          </button>
          <button onClick={loadConfig} disabled={busy !== 'idle'}>
            {busy === 'loading' ? 'Loading…' : '📂 Load'}
          </button>
          <span style={{ marginLeft: 8, opacity: 0.8, fontSize: 12 }}>{msg}</span>
        </div>

        <UniverseTemplate
          accentKey={accent}
          background={bgOverride}
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
          aboveFold={
            cfg.taxons.explore.enabled ? (
              <UniverseExploreSection
                totals={cfg.totals}
                density={density}
                accent={accent}
                enabled={{
                  leadAction: cfg.taxons.explore.leadAction.enabled,
                  aboveFold: cfg.taxons.explore.aboveFold.enabled,
                  primaryFeed: cfg.taxons.explore.primaryFeed.enabled,
                  searchBar: cfg.taxons.explore.searchBar.enabled,
                  metaKpi: cfg.taxons.explore.metaKpi.enabled,
                  statTriplet: cfg.taxons.explore.statTriplet.enabled,
                  meta: cfg.taxons.explore.meta.enabled,
                  feedProductCard: cfg.taxons.explore.feedProductCard.enabled,
                }}
              />
            ) : null
          }
          primaryFeed={
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              (Primary feed preview is shown in the Explore section above)
            </div>
          }
          secondaryFeed={
            cfg.taxons.featured.enabled ? (
              <UniverseFeaturedSection
                density={density}
                enabled={{
                  featuredA: cfg.taxons.featured.featuredA.enabled,
                  featuredB: cfg.taxons.featured.featuredB.enabled,
                  featBrandCard: cfg.taxons.featured.featBrandCard.enabled,
                  featProductCard: cfg.taxons.featured.featProductCard.enabled,
                }}
              />
            ) : null
          }
          howItWorks={
            cfg.taxons.lower.enabled ? (
              <UniverseLowerSection
                density={density}
                enabled={{
                  howItWorks: cfg.taxons.lower.howItWorks.enabled,
                  lowerCta: cfg.taxons.lower.lowerCta.enabled,
                  lowerHow: cfg.taxons.lower.lowerHow.enabled,
                  lowerCtaStrip: cfg.taxons.lower.lowerCtaStrip.enabled,
                }}
              />
            ) : null
          }
          footerMeta={
            <div style={{ color: '#9ac8b7' }}>
              HEMPIN — {accent} • density: {density} • key: <code>{CONFIG_NAME}</code>
            </div>
          }
        />
      </TokensProvider>

      <div>
        <ControlsPanel cfg={cfg} setCfg={setCfg} />
      </div>
    </div>
  )
}