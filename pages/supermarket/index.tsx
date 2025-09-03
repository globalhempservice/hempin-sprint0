// pages/supermarket/index.tsx
import Head from 'next/head'
import UniverseTemplate from '../../components/atomic/templates/UniverseTemplate'
import UniverseHeader from '../../components/atomic/organisms/UniverseHeader'
import SearchBar from '../../components/atomic/molecules/SearchBar'
import StatTriplet from '../../components/atomic/molecules/StatTriplet'
import ItemGrid from '../../components/atomic/organisms/ItemGrid'
import FeaturedBrands from '../../components/atomic/organisms/FeaturedBrands'
import { Button } from '../../components/atomic/atoms/Button'
import { useEffect, useState } from 'react'

export default function Supermarket() {
  const [q, setQ] = useState('')
  const [totals, setTotals] = useState<{brands:number;products:number;events:number}>({brands:0,products:0,events:0})

  useEffect(()=>{(async()=>{
    const r = await fetch('/api/meta/totals').then(r=>r.json()).catch(()=>null)
    if (r) setTotals(r)
  })()},[])

  return (
    <>
      <Head><title>Supermarket — HEMPIN</title></Head>
      <UniverseTemplate
        background={<BG />}
        header={<UniverseHeader kicker="Supermarket" title="Shop the hemp multiverse" subtitle="Curated goods from vetted brands. Cannabis items are separate by default." />}
        leadActions={
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <SearchBar value={q} onChange={setQ} placeholder="Search products or brands…" />
            <Button kind="ghost" onClick={()=>setQ('')}>Reset filters</Button>
            <Button kind="text" href="#how">How submissions work</Button>
          </div>
        }
        aboveFold={<StatTriplet
          a={{label:'Brands',value:totals.brands}}
          b={{label:'Products',value:totals.products}}
          c={{label:'Events',value:totals.events}}
        />}
        primaryFeed={<ItemGrid q={q} />}
        secondaryFeed={<FeaturedBrands />}
        howItWorks={<div id="how"><HowNote /></div>}
        ctaStrip={
          <div style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,
            background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:16,padding:16
          }}>
            <div>
              <div style={{border:'1px solid rgba(255,255,255,.12)',borderRadius:999,padding:'.35rem .65rem',fontSize:'.75rem',display:'inline-block'}}>Are you a brand?</div>
              <h4 style={{marginTop:4,fontSize:'1.2rem'}}>List your product on HEMPIN</h4>
              <p style={{color:'#8fbfb0'}}>It’s free to submit. We’ll email you once approved.</p>
            </div>
            <Button kind="primary" href="/account/products/new">Submit your product</Button>
          </div>
        }
        footerMeta={<div style={{color:'#8fbfb0'}}>HEMPIN — Supermarket • violet/fuchsia accent</div>}
      />
    </>
  )
}

function HowNote() {
  return (
    <div>
      <h3 style={{marginBottom:8}}>How it works</h3>
      <p style={{color:'#9bdcc9'}}>The shelves are filling as submissions get approved.</p>
    </div>
  )
}

function BG() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:-1,background:'#0b0f12'}}>
      <div style={{
        position:'absolute',width:'60vw',height:'60vw',borderRadius:999,filter:'blur(60px)',opacity:.22,mixBlendMode:'screen',
        left:'-20vw',top:'-10vh',background:'radial-gradient(closest-side,#a64dff,transparent 70%)'
      }}/>
      <div style={{
        position:'absolute',width:'60vw',height:'60vw',borderRadius:999,filter:'blur(60px)',opacity:.22,mixBlendMode:'screen',
        right:'-15vw',bottom:'-20vh',background:'radial-gradient(closest-side,#ff5ad1,transparent 70%)'
      }}/>
    </div>
  )
}