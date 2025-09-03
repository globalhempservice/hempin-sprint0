// components/universe/UniverseTemplate.tsx
import Head from 'next/head'
import { PropsWithChildren, useRef } from 'react'
import { Button, Chip, Glass, Pill, Section, UNIVERSE_THEMES, UniverseThemeKey } from './atoms'

type Metric = { label: string; value: number | string }
type Feature = { title: string; copy: string }
type Card = { title: string; copy: string; href?: string }

export type UniverseTemplateProps = {
  theme: UniverseThemeKey

  // Toggles (Architect will control these later)
  showHero?: boolean
  showActions?: boolean
  showSearch?: boolean
  showMetrics?: boolean
  showFeatured?: boolean
  showGrid?: boolean
  showHowItWorks?: boolean
  showCTA?: boolean

  // Data
  metrics?: Metric[]
  featured?: Feature[]
  grid?: Card[]

  // CTAs
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }

  // Optional title/lead (otherwise theme name is used)
  title?: string
  lead?: string
}

export default function UniverseTemplate({
  theme,
  showHero = true,
  showActions = true,
  showSearch = true,
  showMetrics = true,
  showFeatured = true,
  showGrid = true,
  showHowItWorks = true,
  showCTA = true,
  metrics = [],
  featured = [],
  grid = [],
  primaryCta,
  secondaryCta,
  title,
  lead,
}: UniverseTemplateProps) {
  const t = UNIVERSE_THEMES[theme]
  const pageRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Head><title>{t.name} — HEMPIN</title></Head>

      {/* Theme variables + fixed aurora background */}
      <div className="u-bg" aria-hidden />
      <style jsx global>{`
        :root{
          --hueA:${t.hueA}; --hueB:${t.hueB}; --aurA:${t.auroraA}; --aurB:${t.auroraB};
          --ink:${t.ink}; --subInk:${t.subInk}; --onPrimary:${t.onPrimary};
        }
        body{ background:#0b0f12; color:var(--ink) }
      `}</style>
      <style jsx>{`
        .u-bg{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background:
            radial-gradient(1400px 900px at 60% 10%, var(--aurA), transparent 60%),
            radial-gradient(1200px 820px at 25% 85%, var(--aurB), transparent 60%),
            #0b0f12;
          animation:hue 30s linear infinite;
        }
        @keyframes hue { 0%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(10deg)} 100%{filter:hue-rotate(0deg)} }
        .h1{font-size: clamp(2.1rem,4.2vw,3.6rem); line-height:1.06; letter-spacing:-.02em}
        .lead{color:var(--subInk)}
        .grid{display:grid; gap:clamp(12px,1.6vmin,18px)}
      `}</style>

      {/* Scrollable content layer */}
      <div ref={pageRef} style={{position:'relative', zIndex:1}}>

        {/* HERO (organism) */}
        {showHero && (
          <Section>
            <Glass>
              <div style={{padding: '28px 22px 24px'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <Pill>{t.name}</Pill>
                </div>
                <h1 className="h1" style={{margin:'14px 0 8px'}}>
                  {title || `${t.name} Universe`}
                </h1>
                <p className="lead" style={{margin:0}}>
                  {lead || 'Discover, filter and act. A liquid interface with gentle motion and no hard edges.'}
                </p>

                {showActions && (
                  <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:14}}>
                    {primaryCta && <Button primary href={primaryCta.href}>{primaryCta.label}</Button>}
                    {secondaryCta && <Button href={secondaryCta.href}>{secondaryCta.label}</Button>}
                    <Chip href="#">How it works</Chip>
                  </div>
                )}
              </div>
            </Glass>

            {showSearch && (
              <div style={{marginTop:12, display:'grid', gap:12, gridTemplateColumns:'1fr minmax(160px,220px) minmax(140px,200px)'}}>
                <Glass><div style={{padding:12}}>Search… (slot)</div></Glass>
                <Glass><div style={{padding:12}}>Category (slot)</div></Glass>
                <Glass><div style={{padding:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>Reset filters <Button>Clear</Button></div></Glass>
              </div>
            )}
          </Section>
        )}

        {/* METRICS (organism) */}
        {showMetrics && metrics?.length > 0 && (
          <Section>
            <div className="grid" style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
              {metrics.map(m => (
                <Glass key={m.label}>
                  <div style={{padding:18, textAlign:'center'}}>
                    <div style={{fontSize:'1.65rem', fontWeight:800}}>{m.value}</div>
                    <div style={{color:'var(--subInk)'}}>{m.label}</div>
                  </div>
                </Glass>
              ))}
            </div>
          </Section>
        )}

        {/* FEATURED (organism) */}
        {showFeatured && featured?.length > 0 && (
          <Section>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <div style={{fontWeight:800}}>Featured</div>
              <Chip href="#">View all</Chip>
            </div>
            <div className="grid" style={{gridTemplateColumns:'repeat(12,minmax(0,1fr))'}}>
              {featured.map((f, i)=>(
                <Glass key={i} className="card">
                  <div style={{padding:'18px 18px 16px', gridColumn:'span 4'}}>
                    <div style={{fontWeight:800, marginBottom:6}}>{f.title}</div>
                    <div style={{color:'var(--subInk)'}}>{f.copy}</div>
                  </div>
                </Glass>
              ))}
            </div>
          </Section>
        )}

        {/* GRID FEED (organism) */}
        {showGrid && grid?.length > 0 && (
          <Section>
            <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit, minmax(clamp(220px,26vmin,360px), 1fr))'}}>
              {grid.map((c, i)=>(
                <Glass key={i}>
                  <div style={{padding:'16px 16px 14px'}}>
                    <div style={{fontWeight:800}}>{c.title}</div>
                    <div style={{color:'var(--subInk)', margin:'6px 0 10px'}}>{c.copy}</div>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                      <Button href={c.href || '#'}>Open</Button>
                    </div>
                  </div>
                </Glass>
              ))}
            </div>
          </Section>
        )}

        {/* HOW IT WORKS (organism) */}
        {showHowItWorks && (
          <Section>
            <Glass>
              <div style={{padding:18}}>
                <div style={{fontWeight:800, marginBottom:10}}>How it works</div>
                <ol style={{margin:0, padding:'0 0 0 1.2rem', color:'var(--subInk)'}}>
                  <li>Sign in and create your profile.</li>
                  <li>Choose modules; customize your feed.</li>
                  <li>Contribute content. Earn leaves & badges.</li>
                </ol>
              </div>
            </Glass>
          </Section>
        )}

        {/* CTA STRIP (organism) */}
        {showCTA && (
          <Section>
            <Glass>
              <div style={{padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap'}}>
                <div>
                  <div style={{fontWeight:800}}>Ready to contribute?</div>
                  <div style={{color:'var(--subInk)'}}>Publish, list, host, and connect across HEMPIN.</div>
                </div>
                <div style={{display:'flex', gap:10}}>
                  <Button primary href="/join?next=/onboarding">Create account</Button>
                  <Button href="/signin?next=/onboarding">I already have an account</Button>
                </div>
              </div>
            </Glass>
          </Section>
        )}

        {/* Footer note */}
        <Section>
          <div style={{textAlign:'center', color:'var(--subInk)', margin:'18px 0 28px'}}>
            Universe backbone • Theme-aware • Toggleable sections • Atoms→Molecules→Organisms
          </div>
        </Section>
      </div>
    </>
  )
}