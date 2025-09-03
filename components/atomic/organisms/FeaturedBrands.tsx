import Link from 'next/link'
import { supabase } from '../../../lib/supabaseClient'
import { useEffect, useState } from 'react'
import Pill from '../atoms/Pill'

export default function FeaturedBrands() {
  const [rows, setRows] = useState<{name:string;slug:string}[]>([])
  useEffect(()=>{ let alive=true;(async()=>{
    const { data, error } = await supabase
      .from('brands')
      .select('name,slug')
      .eq('approved', true)
      .eq('featured', true)
      .order('created_at', { ascending:false })
      .limit(8)
    if (!alive) return
    if (error) { console.error('[FeaturedBrands] supabase error:', error); setRows([]); return }
    setRows(data||[])
  })(); return ()=>{alive=false}},[])

  if (!rows.length) return null

  return (
    <section style={{ margin:'10px 0' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'16px 0 8px 0'}}>
        <h3>Featured brands</h3>
        <Link href="/brands" style={{color:'#9be9d3',textDecoration:'underline'}}>All brands →</Link>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {rows.map(b => (
          <Pill key={b.slug} as={Link as any} href={`/brands/${b.slug}`}>
            {b.name}
          </Pill>
        ))}
      </div>
    </section>
  )
}