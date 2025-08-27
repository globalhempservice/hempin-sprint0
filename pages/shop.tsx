// pages/shop.tsx
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

declare global {
  interface Window { paypal: any }
}

function loadPayPalSdk(clientId: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.paypal) return resolve()
    const s = document.createElement('script')
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load PayPal SDK'))
    document.body.appendChild(s)
  })
}

export default function Shop() {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [orderID, setOrderID] = useState<string | null>(null)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  const buy = async (code: string) => {
    setError(null); setBusy(code); setSelectedCode(code)
    // ensure user is signed in to associate the order
    const { data } = await supabase.auth.getSession()
    const userId = data.session?.user?.id
    if (!userId) { setBusy(null); setError('Please sign in first'); return }

    // create order on server
    const resp = await fetch('/.netlify/functions/shop-create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, items: [{ code, qty: 1 }] })
    })
    if (!resp.ok) { setBusy(null); setError('Create order failed'); return }
    const { orderID } = await resp.json()
    setOrderID(orderID)

    // load PayPal SDK and render button
    try {
      await loadPayPalSdk(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!)
      const containerId = 'paypal-buttons'
      const el = document.getElementById(containerId)
      if (el) el.innerHTML = ''
      window.paypal.Buttons({
        createOrder: () => orderID,
        onApprove: async (data: any) => {
          await fetch('/.netlify/functions/shop-capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
          })
          window.location.href = '/account/billing?success=1&order=' + data.orderID
        },
        onError: (err: any) => setError('PayPal error: ' + (err?.message || 'unknown'))
      }).render('#' + containerId)
    } catch (e:any) {
      setError(e.message || 'PayPal SDK failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="container space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="opacity-80 text-sm">Bangkok kit closes after <b>2025-10-15</b>. Shipping deadline: <b>2025-10-25</b>.</p>
      </header>

      {error && <div className="card border border-red-500/40 text-red-300">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { code:'brand_page', title:'Brand page', price:'$50' },
          { code:'product', title:'Single product page', price:'$20' },
          { code:'bundle_1b5p', title:'Special Offer: 1 brand + 5 products', price:'$100' },
          { code:'popup_bkk_2025', title:'Pop-up kit (Bangkok 2025) — auto-priced by date', price:'$300/$400/$500' },
          { code:'popup_extra', title:'Pop-up extra', price:'$100' }
        ].map(it => (
          <div key={it.code} className="card space-y-2">
            <h2 className="text-lg font-semibold">{it.title}</h2>
            <p className="opacity-80 text-sm">Price: {it.price}</p>
            <button className="btn btn-primary" disabled={busy===it.code} onClick={() => buy(it.code)}>
              {busy===it.code ? 'Preparing…' : 'Buy'}
            </button>
          </div>
        ))}
      </div>

      {orderID && selectedCode && (
        <section className="card space-y-2">
          <h3 className="font-semibold">Complete your payment</h3>
          <div id="paypal-buttons" />
        </section>
      )}
    </main>
  )
}
