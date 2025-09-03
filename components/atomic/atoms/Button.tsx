// components/atomic/atoms/Button.tsx
import Link from 'next/link'
import { tokens } from '../particles/tokens'
export function Button({ children, onClick, href, kind='ghost' }:{
  children:any; onClick?:()=>void; href?:string; kind?:'primary'|'ghost'|'text'
}) {
  const base = {
    display:'inline-flex', alignItems:'center', gap:'.5rem',
    padding:'.65rem .9rem', borderRadius:12, border:'1px solid rgba(255,255,255,.12)',
    textDecoration:'none'
  } as any
  const style = kind==='primary'
    ? { ...base, background:`linear-gradient(135deg,${tokens.accent.supermarketA},${tokens.accent.supermarketB})`, color:'#090c0f', fontWeight:800 }
    : kind==='text'
      ? { ...base, color:'#9be9d3', border:'0', padding:0 }
      : { ...base, color:'#d7ffef', background:'transparent' }
  if (href) return <Link href={href} style={style}>{children}</Link>
  return <button onClick={onClick} style={style}>{children}</button>
}