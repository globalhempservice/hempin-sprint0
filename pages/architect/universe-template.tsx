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
  const [msg, setMsg] = useState<string>('')

  const { accent, density, showBackground } = cfg.look
  const bgOverride = showBackground ? undefined : <div aria-hidden />

  
  const configId = accent

  async function saveConfig() {
    try {
      setBusy('saving')
      setMsg('')
      const res = await fetch('/.netlify/functions/universe-config?id=' + encodeURIComponent(configId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      })
      if (!res.ok) throw new Error(await res.text())
      setMsg('Saved ✓')
    } catch (e: any) {
      setMsg('Save failed: ' + e.message)
    } finally {
      setBusy('idle')
    }
  }

  async function loadConfig() {
    try {
      setBusy('loading')
      setMsg('')
      const res = await fetch('/.netlify/functions/universe-config?id=' + encodeURIComponent(configId))
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (data) setCfg(data as UniverseConfig)
      setMsg(data ? 'Loaded ✓' : `No saved config yet for "${configId}"`)
    } catch (e: any) {
      setMsg('Load failed: ' + e.message)
    } finally {
      setBusy('idle')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
      <TokensProvider>
        <UniverseTemplate
          accentKey={accent}
          background={bgOverride}

          
          header={
            <UniverseHeaderSection
              accent={accent}
              density={density}
              enabled={{
                universeHeader: true,
                headerCta: true,
                bigTitle: true,
                kicker: true,
                headerCtaStrip: true,
              }}
            />
          }

          
          aboveFold={
            cfg.showExplore ? (
              <UniverseExploreSection
                totals={cfg.totals}
                density={density}
                accent={accent}
                enabled={{
                  leadAction: true,
                  aboveFold: true,
                  primaryFeed: true,
                  searchBar: true,
                  metaKpi: true,
                  statTriplet: true,
                  meta: true,
                  feedProductCard: true,
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
            cfg.showFeatured ? (
              <UniverseFeaturedSection
                density={density}
                enabled={{
                  featuredA: true,
                  featuredB: true,
                  featBrandCard: true,
                  featProductCard: true,
                }}
              />
            ) : null
          }

          
          howItWorks={
            cfg.showLower ? (
              <UniverseLowerSection
                density={density}
                enabled={{
                  howItWorks: true,
                  lowerCta: true,
                  lowerHow: true,
                  lowerCtaStrip: true,
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

      
      <div>
        <ControlsPanel cfg={cfg} setCfg={setCfg} />

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button onClick={saveConfig} disabled={busy !== 'idle'}>
            {busy === 'saving' ? 'Saving…' : '💾 Save'}
          </button>
          <button onClick={loadConfig} disabled={busy !== 'idle'}>
            {busy === 'loading' ? 'Loading…' : '📂 Load'}
          </button>
        </div>
        <div style={{ marginTop: 6, opacity: 0.8, fontSize: 12 }}>{msg}</div>
        <div style={{ marginTop: 6, opacity: 0.6, fontSize: 11 }}>
          Config key: <code>{configId}</code>
        </div>
      </div>
    </div>
  )
}