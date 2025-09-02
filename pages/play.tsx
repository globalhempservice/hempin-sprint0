// pages/play.tsx
import Head from 'next/head'
import UniverseTemplate from '../components/universe/UniverseTemplate'
import UniverseHeader from '../components/organisms/UniverseHeader'
import HeroCTA from '../components/molecules/HeroCTA'

export default function PlayUniverse() {
  // try different accents quickly here
  const accent = { a: '#c471f5', b: '#fa71cd' } // Supermarket vibe

  return (
    <>
      <Head><title>HEMPIN — Universe Template Playground</title></Head>

      <UniverseTemplate
        accent={accent}
        header={<UniverseHeader
          kicker="Template"
          title="Universe Template"
          tagline="One shared skeleton for Supermarket, Trade, Events, Research, and Places. Accent-driven, slot-based, and /architect-ready."
        />}
        leadActions={
          <div style={{display:'grid', gap:12}}>
            <HeroCTA primaryLabel="Primary action" secondaryLabel="Secondary link" />
            <div style={{display:'flex', gap:12, padding:'0 16px 12px 16px', flexWrap:'wrap'}}>
              <input placeholder="Search…" aria-label="Search"
                style={{flex:'1 1 260px', padding:'10px 12px', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.03)', color:'#eafff7'}}/>
              <select aria-label="Filter"
                style={{padding:'10px 12px', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.03)', color:'#eafff7'}}>
                <option>All categories</option><option>Option A</option><option>Option B</option>
              </select>
              <button className="btn ghost">Reset filters</button>
            </div>
          </div>
        }
        aboveFold={
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:14}}>
            {['Brands','Products','Events'].map((label,i)=>(
              <div key={i} className="panel" style={{padding:18, textAlign:'center'}}>
                <div style={{fontSize:'1.6rem', fontWeight:900}}>128</div>
                <div style={{opacity:.8}}>{label}</div>
              </div>
            ))}
          </div>
        }
        primaryFeed={
          <div className="panel" style={{padding:16}}>
            <h3 style={{margin:'2px 0 10px 2px'}}>Primary feed</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12}}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="card" style={{height:140, display:'grid', placeItems:'center'}}>Card #{i+1}</div>
              ))}
            </div>
          </div>
        }
        secondaryFeed={
          <div className="panel" style={{padding:16}}>
            <h3 style={{margin:'2px 0 10px 2px'}}>Secondary feed</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12}}>
              {Array.from({length:4}).map((_,i)=>(
                <div key={i} className="card" style={{height:110, display:'grid', placeItems:'center'}}>Mini #{i+1}</div>
              ))}
            </div>
          </div>
        }
        howItWorks={
          <div style={{padding:16}}>
            <h3 style={{margin:'2px 0 10px 2px'}}>How it works</h3>
            <ol style={{display:'grid', gap:10, paddingLeft:18, opacity:.9}}>
              <li>Submit great stuff → we review for quality & compliance.</li>
              <li>Approved content flows into the primary feed.</li>
              <li>Earn leaves & badges; unlock pro modules as needed.</li>
            </ol>
          </div>
        }
        ctaStrip={
          <>
            <div><strong>Ready to wire a real universe?</strong><div style={{opacity:.8}}>Swap the accent, drop slots you don’t need.</div></div>
            <a className="btn primary" href="/onboarding">Start now</a>
          </>
        }
        footerMeta={<div style={{opacity:.85}}>This is a playground. Once we’re happy, we’ll apply it to Supermarket, Trade, Events, Research, and Places.</div>}
      />
    </>
  )
}