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

type Busy = 'idle' | 'saving' | 'loading'

export default function ArchitectUniverseTemplate() {
  const [cfg, setCfg] = useState<UniverseConfig>(defaultUniverseConfig)
  const [busy, setBusy] = useState<Busy>('idle')
  const [msg, setMsg] = useState<string>('')

  const { accent, density, showBackground } = cfg.look
  // If background is disabled, pass a trivial node so Template doesn’t render its default BG.
  const bgOverride = showBackground ? undefined : <div aria-hidden />

  // Use accent as the config key for now (switch to slug later if you like)
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
          /* Header taxon */
          header={
            <UniverseHeaderSection
              accent={accent}
              density={density}
              kicker="Shop the hemp multiverse"
              title="Curated goods from vetted brands."
              subtitle="Cannabis items are separate by default."
              cta={{ label: 'Register your brand', href: '#' }}
            />
          }
          /* Explore taxon renders the above-the-fold strip + preview content */
          aboveFold={
            cfg.showExplore ? (
              <UniverseExploreSection
                totals={cfg.totals}
                density={density}
                accent={accent}
              />
            ) : null
          }
          /* Primary feed placeholder (we preview it inside Explore above) */
          primaryFeed={
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              (Primary feed preview is shown in the Explore section above)
            </div>
          }
          /* Featured strip taxon */
          secondaryFeed={
            cfg.showFeatured ? (
              <UniverseFeaturedSection
                density={density}
              />
            ) : null
          }
          /* Lower/how-it-works taxon */
          howItWorks={
            cfg.showLower ? (
              <UniverseLowerSection
                density={density}
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

      {/* Right-side: Controls + Save/Load */}
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