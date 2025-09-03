// components/architect/ControlsPanel.tsx
import React from 'react'
import type { UniverseConfig, Density } from './universeConfig'
import { AccentKey } from '../atomic/particles/tokens'

export function ControlsPanel({
  cfg,
  setCfg,
}: {
  cfg: UniverseConfig
  setCfg: React.Dispatch<React.SetStateAction<UniverseConfig>>
}) {
  const set = (mutate: (draft: UniverseConfig) => void) =>
    setCfg(prev => {
      const next = structuredClone(prev)
      mutate(next)
      return next
    })

  const Toggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string
    checked: boolean
    onChange: (v: boolean) => void
  }) => (
    <label style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    </label>
  )

  return (
    <aside
      style={{
        width: 320,
        padding: 16,
        background: 'rgba(255,255,255,.03)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 12,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Universe — Controls</h3>

      {/* Look & feel */}
      <div style={{ marginTop: 10 }}>
        <div style={{ opacity: 0.8, marginBottom: 6 }}>Look &amp; feel</div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(['supermarket', 'trade', 'events', 'research', 'places'] as AccentKey[]).map(k => (
            <button
              key={k}
              onClick={() => set(d => void (d.look.accent = k))}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,.12)',
                opacity: cfg.look.accent === k ? 1 : 0.6,
              }}
            >
              {k}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {(['normal', 'roomy'] as Density[]).map(d => (
            <button
              key={d}
              onClick={() => set(s => void (s.look.density = d))}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,.12)',
                opacity: cfg.look.density === d ? 1 : 0.6,
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <Toggle
          label="Background"
          checked={cfg.look.showBackground}
          onChange={v => set(s => void (s.look.showBackground = v))}
        />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.08)', margin: '12px 0' }} />

      {/* Section toggles that exist in UniverseConfig */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ opacity: 0.8, marginBottom: 6 }}>Sections</div>
        <Toggle
          label="Featured zone"
          checked={cfg.showFeatured}
          onChange={v => set(s => void (s.showFeatured = v))}
        />
        <Toggle
          label="Explore zone"
          checked={cfg.showExplore}
          onChange={v => set(s => void (s.showExplore = v))}
        />
        <Toggle
          label="Lower zone"
          checked={cfg.showLower}
          onChange={v => set(s => void (s.showLower = v))}
        />
      </div>

      {/* Explore totals preview */}
      <div>
        <div style={{ opacity: 0.8, margin: '6px 0' }}>Explore totals</div>
        {(['brands', 'products', 'events'] as const).map(k => (
          <label key={k} style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0' }}>
            <span style={{ textTransform: 'capitalize' }}>{k}</span>
            <input
              type="number"
              min={0}
              value={cfg.totals[k]}
              onChange={e => set(s => void (s.totals[k] = Number(e.target.value) || 0))}
              style={{ width: 72 }}
            />
          </label>
        ))}
      </div>
    </aside>
  )
}