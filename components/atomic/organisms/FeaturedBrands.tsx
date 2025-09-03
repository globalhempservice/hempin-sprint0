// components/atomic/organisms/FeaturedBrands.tsx
import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function FeaturedBrands() {
  const [rows, setRows] = useState<{name:string;slug:string}[]>([])
  useEffect(()=>{(async()=>{
    const { data } = await supabase.from('brands').select('name,slug').eq('approved',true).eq('featured',true).order('created_at',{ascending:false}).limit(6)
    setRows(data||[])
  })()},[])
  if (!rows.length) return null
  return (
    <>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'16px 0 8px 0'}}>
        <h3>Featured brands</h3>
        <Link href="/brands" style={{color:'#9be9d3',textDecoration:'underline'}}>All brands →</Link>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {rows.map(b => <Link key={b.slug} href={`/brands/${b.slug}`} style={{
          padding:'.45rem .7rem', borderRadius:999, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.03)', color:'#eafff7'
        }}>{b.name}</Link>)}
      </div>
    </>
  )
}