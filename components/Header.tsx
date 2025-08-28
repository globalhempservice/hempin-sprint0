import { useState } from 'react'
import Link from 'next/link'
import BurgerPanel from './BurgerPanel'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="container py-3" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <Link href="/" className="text-2xl font-bold">HEMP’IN</Link>
      <button aria-expanded={open} aria-controls="burger-panel" onClick={()=>setOpen(true)} className="btn btn-outline">☰</button>
      <BurgerPanel open={open} onClose={()=>setOpen(false)} />
    </header>
  )
}