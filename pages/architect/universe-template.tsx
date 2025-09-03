// pages/architect/universe-template.tsx
import { useEffect, useMemo, useState } from 'react'
import UniverseTemplate from '../../components/atomic/templates/UniverseTemplate'
import {
  UniverseHeaderSection,
  UniverseFeaturedSection,
  UniverseExploreSection,
  UniverseLowerSection,
} from '../../components/atomic/taxons'
import { tokens, type AccentKey } from '../../components/atomic/particles/tokens'

// ——————————————————————————————————
// Tiny background helper (accent-aware)
function AccentBG({ accent }: { accent: AccentKey }) {
  const { a, b } = tokens.accent[accent]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: tokens.z.orb, background: tokens.neutral[900] }}>
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: tokens.radii.orb,
          filter: 'blur(70px)',
          opacity: 0.22,
          mixBlendMode: 'screen',
          left: '-18vw',
          top: '-10vh',
          background: `radial-gradient(closest-side, ${a}, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: tokens.radii.orb,
          filter: 'blur(70px)',
          opacity: 0.22,
          mixBlendMode: 'screen',
          right: '-15vw',
          bottom: '-18vh',
          background: `radial-gradient(closest-side, ${b}, transparent 70%)`,
        }}
      />
    </div>
  )
}

// ——————————————————————————————————
// Control UI primitives (unstyled on purpose)
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
      <span style={{ color: tokens.text.base }}>{label}</span>
      <div>{children}</div>
    </label>
  )
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 14, marginBottom: 8, color: tokens.text.high, fontWeight: 800, fontSize: 14 }}>
      {children}
    </div>
  )
}

// ——————————————————————————————————
// The page
export default function UniverseTemplatePlay() {
  // live state
  const [accent, setAccent] = useState<AccentKey>('supermarket')
  const [density, setDensity] = useState<'normal' | 'roomy'>('normal')

  const [showFeatured, setShowFeatured] = useState(true)
  const [showExplore, setShowExplore] = useState(true)
  const [showLower, setShowLower] = useState(true)
  const [showBackground, setShowBackground] = useState(true)

  const [totals, setTotals] = useState({ brands: 12, products: 98, events: 3 })
  const [search, setSearch] = useState('')

  // persist simple settings so refresh doesn’t wipe your play state
  useEffect(() => {
    const saved = localStorage.getItem('ut-play')
    if (saved) {
      try {
        const obj = JSON.parse(saved)
        if (obj) {
          setAccent(obj.accent ?? 'supermarket')
          setDensity(obj.density ?? 'normal')
          setShowFeatured(obj.showFeatured ?? true)
          setShowExplore(obj.showExplore ?? true)
          setShowLower(obj.showLower ?? true)
          setShowBackground(obj.showBackground ?? true)
          setTotals(obj.totals ?? { brands: 12, products: 98, events: 3 })
          setSearch(obj.search ?? '')
        }
      } catch {}
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(
      'ut-play',
      JSON.stringify({ accent, density, showFeatured, showExplore, showLower, showBackground, totals, search })
    )
  }, [accent, density, showFeatured, showExplore, showLower, showBackground, totals, search])

  // options
  const accentKeys = useMemo<AccentKey[]>(() => ['supermarket', 'trade', 'events', 'research', 'places'], [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: tokens.neutral[900],
        color: tokens.text.high,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px',
      }}
    >
      {/* preview */}
      <div style={{ position: 'relative' }}>
        {showBackground && <AccentBG accent={accent} />}

        <UniverseTemplate
          background={null /* background handled above so panel stays readable */}
          header={
            <UniverseHeaderSection
              kicker="Supermarket"
              title="Shop the hemp multiverse"
              subtitle="Curated goods from vetted brands. Cannabis items are separate by default."
              cta={{ label: 'Register your brand', href: '/account/brands/new' }}
              density={density}
              accent={accent}
            />
          }
          leadActions={
            showExplore ? (
              <UniverseExploreSection
                totals={totals}
                density={density}
                accent={accent}
                /** pass-throughs we may wire later */
                searchSlot={{
                  value: search,
                  onChange: setSearch,
                  placeholder: 'Search…',
                  onReset: () => setSearch(''),
                }}
              />
            ) : null
          }
          primaryFeed={
            <div
              style={{
                borderRadius: tokens.radii.lg,
                background: tokens.glass,
                boxShadow: tokens.shadow,
                padding: tokens.space[6],
                color: tokens.text.base,
              }}
            >
              Primary feed goes here (ItemGrid on the real page)
            </div>
          }
          secondaryFeed={showFeatured ? <UniverseFeaturedSection density={density} accent={accent} /> : null}
          howItWorks={showLower ? <UniverseLowerSection density={density} accent={accent} /> : null}
          ctaStrip={null}
          footerMeta={
            <div style={{ color: tokens.text.foot }}>
              HEMPIN — {accent} • density: <b>{density}</b>
            </div>
          }
        />
      </div>

      {/* side panel */}
      <aside
        style={{
          position: 'sticky',
          top: 0,
          alignSelf: 'start',
          height: '100dvh',
          padding: 16,
          borderLeft: `1px solid ${tokens.neutral[700]}`,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))',
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>UniverseTemplate — Controls</div>

        <SectionTitle>Look & feel</SectionTitle>
        <Row label="Accent">
          <select
            value={accent}
            onChange={(e) => setAccent(e.target.value as AccentKey)}
            style={{ background: 'transparent', color: tokens.text.high, border: `1px solid ${tokens.neutral[700]}`, borderRadius: 8, padding: '6px 8px' }}
          >
            {accentKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Row>
        <Row label="Density">
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setDensity('normal')}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: `1px solid ${tokens.neutral[700]}`,
                background: density === 'normal' ? tokens.glassStrong : 'transparent',
                color: tokens.text.base,
                cursor: 'pointer',
              }}
            >
              normal
            </button>
            <button
              onClick={() => setDensity('roomy')}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: `1px solid ${tokens.neutral[700]}`,
                background: density === 'roomy' ? tokens.glassStrong : 'transparent',
                color: tokens.text.base,
                cursor: 'pointer',
              }}
            >
              roomy
            </button>
          </div>
        </Row>
        <Row label="Background">
          <input type="checkbox" checked={showBackground} onChange={(e) => setShowBackground(e.target.checked)} />
        </Row>

        <SectionTitle>Sections</SectionTitle>
        <Row label="Featured">
          <input type="checkbox" checked={showFeatured} onChange={(e) => setShowFeatured(e.target.checked)} />
        </Row>
        <Row label="Explore strip">
          <input type="checkbox" checked={showExplore} onChange={(e) => setShowExplore(e.target.checked)} />
        </Row>
        <Row label="Lower (how it works)">
          <input type="checkbox" checked={showLower} onChange={(e) => setShowLower(e.target.checked)} />
        </Row>

        <SectionTitle>Explore totals</SectionTitle>
        <Row label="Brands">
          <input
            type="number"
            value={totals.brands}
            onChange={(e) => setTotals((t) => ({ ...t, brands: Number(e.target.value) }))}
            style={{ width: 90, background: 'transparent', color: tokens.text.high, border: `1px solid ${tokens.neutral[700]}`, borderRadius: 8, padding: '4px 8px' }}
          />
        </Row>
        <Row label="Products">
          <input
            type="number"
            value={totals.products}
            onChange={(e) => setTotals((t) => ({ ...t, products: Number(e.target.value) }))}
            style={{ width: 90, background: 'transparent', color: tokens.text.high, border: `1px solid ${tokens.neutral[700]}`, borderRadius: 8, padding: '4px 8px' }}
          />
        </Row>
        <Row label="Events">
          <input
            type="number"
            value={totals.events}
            onChange={(e) => setTotals((t) => ({ ...t, events: Number(e.target.value) }))}
            style={{ width: 90, background: 'transparent', color: tokens.text.high, border: `1px solid ${tokens.neutral[700]}`, borderRadius: 8, padding: '4px 8px' }}
          />
        </Row>

        <SectionTitle>Search preview</SectionTitle>
        <Row label="Query">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            style={{ width: 180, background: 'transparent', color: tokens.text.high, border: `1px solid ${tokens.neutral[700]}`, borderRadius: 8, padding: '4px 8px' }}
          />
        </Row>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setAccent('supermarket')
              setDensity('normal')
              setShowFeatured(true)
              setShowExplore(true)
              setShowLower(true)
              setShowBackground(true)
              setTotals({ brands: 12, products: 98, events: 3 })
              setSearch('')
            }}
            style={{
              padding: '8px 10px',
              borderRadius: 10,
              border: `1px solid ${tokens.neutral[700]}`,
              background: tokens.glassStrong,
              color: tokens.text.base,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </aside>
    </div>
  )
}