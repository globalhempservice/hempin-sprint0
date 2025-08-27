// pages/shop.tsx
import { useEffect, useMemo, useState } from 'react'

type Item = { id: string; title: string; desc: string; priceCents: number; variable?: boolean }

export default function Shop() {
  const [phaseLabel, setPhaseLabel] = useState('')
  const today = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth()+1).padStart(2,'0')
    const d = String(now.getDate()).padStart(2,'0')
    return `${y}-${m}-${d}`
  }, [])

  useEffect(() => {
    if (today <= '2025-09-01') setPhaseLabel('Early bird')
    else if (today <= '2025-09-30') setPhaseLabel('General')
    else if (today <= '2025-10-15') setPhaseLabel('Late')
    else setPhaseLabel('Closed')
  }, [today])

  const items: Item[] = [
    { id:'brand_page', title:'Brand page', desc:'Your brand page on HEMP’IN', priceCents:5000 },
    { id:'product', title:'Single product page', desc:'1 product page for 1 year', priceCents:2000 },
    { id:'bundle_1b5p', title:'Special Offer: 1 brand + 5 product pages', desc:'Best value starter pack', priceCents:10000 },
    { id:'popup_bkk_2025', title:`Pop-up kit (Bangkok 2025) — ${phaseLabel}`, desc:'Includes 5 exhibited products + brand page + 5 product pages', priceCents:0, variable:true },
    { id:'popup_extra', title:'Pop-up extra', desc:'1 extra exhibited + 1 product page', priceCents:10000 },
  ]

  return (
    <main className="container space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="opacity-80 text-sm">Prices in USD. Bangkok kit closes after <b>2025-10-15</b>. Shipping deadline: <b>2025-10-25</b>.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.id} className="card space-y-2">
            <h2 className="text-lg font-semibold">{it.title}</h2>
            <p className="opacity-80 text-sm">{it.desc}</p>
            <p className="text-xl font-bold">
              {it.id === 'popup_bkk_2025'
                ? (today <= '2025-09-01' ? '$300' : today <= '2025-09-30' ? '$400' : today <= '2025-10-15' ? '$500' : 'Closed')
                : `$${(it.priceCents/100).toFixed(0)}`}
            </p>
            <button className="btn btn-primary" disabled={it.id==='popup_bkk_2025' && today > '2025-10-15'} onClick={() => alert('TODO: Call create-order and render PayPal buttons')}>
              {it.id==='popup_bkk_2025' && today > '2025-10-15' ? 'Registration closed' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
