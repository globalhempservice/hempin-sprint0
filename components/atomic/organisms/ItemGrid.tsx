// components/atomic/organisms/ItemGrid.tsx
import Link from 'next/link'
import CardFrame from '../../atomic/atoms/CardFrame'
import EmptyState from '../../atomic/molecules/EmptyState'
import { supabase } from '../../../lib/supabaseClient'
import { useEffect, useMemo, useState } from 'react'

type Product = {
  id:string; slug:string; name:string; description?:string|null; price_cents?:number|null
  images?:string[]|null; brand?:{ name:string; slug:string }|null
}

export default function ItemGrid({ q }:{ q:string }) {
  const [rows,setRows] = useState<Product[]|null>(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{ let alive=true;(async()=>{
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('id,slug,name,description,price_cents,images,brand:brands(name,slug)')
      .eq('approved', true).eq('is_cannabis', false)
      .order('created_at', { ascending:false }).limit(48)
    if (alive) { setRows(data||[]); setLoading(false) }
  })(); return()=>{alive=false}},[])

  const list = useMemo(()=>{
    if(!rows) return []
    const s = q.trim().toLowerCase()
    if(!s) return rows
    return rows.filter(p =>
      p.name?.toLowerCase().includes(s) ||
      (p.brand?.name || '').toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s)
    )
  },[rows,q])

  if (loading) return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:12}}>
      {Array.from({length:8}).map((_,i)=><CardFrame key={i}><div style={{paddingTop:'70%',background:'rgba(255,255,255,.06)'}}/></CardFrame>)}
    </div>
  )

  if (!list.length) return <EmptyState title="No products match your search" hint="Try a different word or reset filters." />

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:12}}>
      {list.map(p => <ProductCard key={p.id} p={p} />)}
    </div>
  )
}

function ProductCard({ p }:{p:Product}) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1520975794869-6451e67b9631?q=80&w=1200&auto=format&fit=crop'
  const price = (p.price_cents ?? 0) > 0 ? `€${((p.price_cents||0)/100).toFixed(2)}` : ''
  return (
    <Link href={`/products/${p.slug}`} style={{gridColumn:'span 3'}}>
      <CardFrame>
        <div style={{position:'relative',paddingTop:'70%',background:'#0e1315'}}>
          <img src={img} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        </div>
        <div style={{padding:12}}>
          <div style={{display:'flex',justifyContent:'space-between',color:'#a4e7d2',fontSize:'.9rem'}}>
            {p.brand?.slug ? <Link href={`/brands/${p.brand.slug}`} style={{textDecoration:'underline'}} onClick={e=>e.stopPropagation()}>{p.brand?.name}</Link> : <span>—</span>}
            {price && <span style={{color:'#eafff7',fontWeight:800}}>{price}</span>}
          </div>
          <div style={{fontWeight:800,marginTop:2}}>{p.name}</div>
          {p.description && <div style={{opacity:.8,marginTop:2,fontSize:'.92rem',maxHeight:'3em',overflow:'hidden'}}>{p.description}</div>}
        </div>
      </CardFrame>
    </Link>
  )
}