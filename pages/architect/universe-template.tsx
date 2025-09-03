import { useMemo, useState } from 'react'
import Head from 'next/head'

// template + taxons
import UniverseTemplate from '../../components/atomic/templates/UniverseTemplate'
import {
  UniverseHeaderSection,
  UniverseFeaturedSection,
  UniverseExploreSection,
  UniverseLowerSection,
} from '../../components/atomic/taxons'

// molecules for controls preview bits
import { Button } from '../../components/atomic/atoms/Button'
import { tokens } from '../../components/atomic/particles/tokens'

// --- simple control widget ---
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr', alignItems:'center', gap:12, margin:'8px 0' }}>
      <div style={{ color: tokens.text.dim, fontSize: 14 }}>{label}</div>
      <div>{children}</div>
    </div>
  )
}

export default function UniverseTemplateArchitect() {
  // Controls
  const [accent, setAccent] = useState<'supermarket'|'events'|'places'|'trade'|'research'>('supermarket')
  const [orbOpacity, setOrbOpacity] = useState(0.35)
  const [density, setDensity] = useState<'normal'|'roomy'>('roomy')
  const [showFeatured, setShowFeatured] = useState(true)
  const [showExplore, setShowExplore] = useState(true)
  const [showLower, setShowLower] = useState(true)

  // Fake totals so you can feel it
  const totals = { brands: 12, products: 98, events: 3 }

  // Background node that reacts to sliders
  const Background = useMemo(() => {
    const a = tokens.accent[accent].a
    const b = tokens.accent[accent].b
    return (
      <div style={{ position:'fixed', inset:0, zIndex:0, background: tokens.neutral[900] }}>
        <div style={{
          position:'absolute', inset:0,
          background: tokens.orb(a,b),
          opacity: orbOpacity,
          filter:'blur(28px)',
          pointerEvents:'none'
        }}/>
      </div>
    )
  }, [accent, orbOpacity])

  // Header CTA config
  const cta = { label: 'Submit your product', href: '/account/products/new' }

  return (
    <>
      <Head><title>Architect • UniverseTemplate</title></Head>

      {/* layout: left controls, right live preview */}
      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', minHeight:'100vh' }}>
        {/* Controls */}
        <aside style={{
          position:'sticky', top:0, alignSelf:'start',
          padding:16, borderRight:`1px solid ${tokens.neutral[700]}`,
          background: tokens.neutral[850], height:'100vh', overflow:'auto'
        }}>
          <h2 style={{ marginTop:4, color: tokens.text.high, fontSize:18 }}>Architect</h2>
          <div style={{ marginTop:12 }}>

            <Row label="Accent">
              <select
                value={accent}
                onChange={e=>setAccent(e.target.value as any)}
                style={{ background:'transparent', color:tokens.text.high, border:`1px solid ${tokens.neutral[700]}`, borderRadius:8, padding:'6px 8px' }}
              >
                <option value="supermarket">supermarket</option>
                <option value="trade">trade</option>
                <option value="events">events</option>
                <option value="places">places</option>
                <option value="research">research</option>
              </select>
            </Row>

            <Row label="Orb opacity">
              <input type="range" min={0} max={0.7} step={0.05} value={orbOpacity}
                onChange={e=>setOrbOpacity(parseFloat(e.target.value))} style={{ width:'100%' }}/>
            </Row>

            <Row label="Section density">
              <select
                value={density}
                onChange={e=>setDensity(e.target.value as any)}
                style={{ background:'transparent', color:tokens.text.high, border:`1px solid ${tokens.neutral[700]}`, borderRadius:8, padding:'6px 8px' }}
              >
                <option value="roomy">roomy</option>
                <option value="normal">normal</option>
              </select>
            </Row>

            <Row label="Show featured">
              <input type="checkbox" checked={showFeatured} onChange={e=>setShowFeatured(e.target.checked)} />
            </Row>
            <Row label="Show explore">
              <input type="checkbox" checked={showExplore} onChange={e=>setShowExplore(e.target.checked)} />
            </Row>
            <Row label="Show lower">
              <input type="checkbox" checked={showLower} onChange={e=>setShowLower(e.target.checked)} />
            </Row>

            <div style={{ marginTop:16 }}>
              <Button kind="ghost" onClick={()=>{
                setAccent('supermarket'); setOrbOpacity(0.35); setDensity('roomy')
                setShowFeatured(true); setShowExplore(true); setShowLower(true)
              }}>Reset</Button>
            </div>
          </div>
        </aside>

        {/* Live preview uses the actual template + taxons */}
        <main style={{ position:'relative', zIndex:1 }}>
          <UniverseTemplate
            background={Background}
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
            secondaryFeed={
              showFeatured ? (
                <UniverseFeaturedSection density={density} />
              ) : null
            }
            leadActions={
              showExplore ? (
                <UniverseExploreSection
                  totals={totals}
                  density={density}
                  accent={accent}
                />
              ) : null
            }
            primaryFeed={
              <div style={{ marginTop: 8 }}>
                {/* We reuse ItemGrid in the real page; for the architect we can hint with a placeholder */}
                <div style={{
                  padding:16, borderRadius:16, background:tokens.glass, boxShadow:tokens.shadow, color:tokens.text.base
                }}>
                  Primary feed goes here (ItemGrid on the real page)
                </div>
              </div>
            }
            howItWorks={
              showLower ? (
                <UniverseLowerSection density={density} />
              ) : null
            }
            ctaStrip={
              <div style={{ marginTop: 12 }}>
                <Button kind="primary" href={cta.href}>{cta.label}</Button>
              </div>
            }
            footerMeta={<div style={{ color: tokens.text.foot }}>Architect preview</div>}
          />
        </main>
      </div>
    </>
  )
}