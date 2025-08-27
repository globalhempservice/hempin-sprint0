// components/BuyButton.tsx
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    paypal: any
  }
}

type Props = {
  productId: 'brand' | 'product' | 'bundle_1brand_5products' | 'popup_kit' | 'popup_extra'
  label?: string
  className?: string
}

export default function BuyButton({ productId, label = 'Buy now', className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false

    async function ensureSdk() {
      if (typeof window === 'undefined') return
      if (window.paypal) return
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      const script = document.createElement('script')
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&intent=capture&currency=USD`
      script.async = true
      document.body.appendChild(script)
      await new Promise((res, rej) => {
        script.onload = () => res(true)
        script.onerror = rej
      })
    }

    async function renderButtons() {
      setBusy(true)
      setError(null)
      try {
        await ensureSdk()
        if (cancelled) return
        const paypal = window.paypal
        if (!paypal) throw new Error('PayPal SDK failed to load')

        if (!containerRef.current) return
        containerRef.current.innerHTML = ''

        paypal.Buttons({
          style: { shape: 'rect', layout: 'vertical' },
          createOrder: async () => {
            const res = await fetch('/.netlify/functions/shop-create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ product_id: productId })
            })
            if (!res.ok) {
              const t = await res.text()
              throw new Error(t || 'create order failed')
            }
            const { id } = await res.json()
            return id
          },
          onApprove: async (data: any) => {
            const res = await fetch('/.netlify/functions/shop-capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID })
            })
            if (!res.ok) {
              const t = await res.text()
              throw new Error(t || 'capture failed')
            }
            window.location.href = `/account/billing?success=1&order=${encodeURIComponent(data.orderID)}`
          },
          onError: (err: any) => {
            console.error(err)
            setError('PayPal error. Please try again.')
          }
        }).render(containerRef.current)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Something went wrong.')
      } finally {
        setBusy(false)
      }
    }

    renderButtons()
    return () => { cancelled = true }
  }, [open, productId])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className || 'rounded-lg bg-emerald-500 px-4 py-2 font-medium text-emerald-950 hover:bg-emerald-400'}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Checkout</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-zinc-200">Close</button>
            </div>
            <div ref={containerRef} />
            {busy && <div className="mt-3 text-sm text-zinc-400">Loading PayPal…</div>}
            {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
          </div>
        </div>
      )}
    </>
  )
}
