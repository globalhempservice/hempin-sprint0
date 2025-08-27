import { useAuthGuard } from '../../lib/authGuard'
import { useEntitlements } from '../../lib/useEntitlements'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type OrderRow = {
  id: string
  status: string
  total_cents: number
  currency: string
  paypal_order_id: string
  created_at: string
}

export default function BillingPage() {
  const ready = useAuthGuard()
  const entHook = useEntitlements()
  const [orders, setOrders] = useState<OrderRow[]>([])

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data, error } = await supabase
        .from('orders')
        .select('id,status,total_cents,currency,paypal_order_id,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error && data) setOrders(data as any)
    })()
  }, [])

  if (!ready) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Billing &amp; Entitlements</h1>

      {/* === Entitlements CTA Section === */}
      {entHook.data && (
        <div className="mb-8 rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Current entitlements</h2>
            {entHook.data.product_slots > 0 ? (
              <Link
                href="/account/products"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
              >
                Create product
              </Link>
            ) : (
              <Link
                href="/shop"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm"
              >
                Get more product slots
              </Link>
            )}
          </div>
          <ul className="mt-3 space-y-1 text-sm opacity-90">
            <li>Brand page: {entHook.data.brand_page ? '✅ enabled' : '—'}</li>
            <li>Product slots: {entHook.data.product_slots}</li>
            <li>Bangkok Pop-up 2025: {entHook.data.popup_bkk_2025 ? '✅ included' : '—'}</li>
            <li>Pop-up extras: {entHook.data.popup_extras}</li>
          </ul>
        </div>
      )}

      {/* === Purchase history === */}
      <div className="rounded-xl border border-white/10 p-4">
        <h2 className="font-medium mb-3">Purchase history</h2>
        {orders.length === 0 && (
          <div className="text-sm opacity-80">No purchases yet.</div>
        )}
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="flex justify-between items-center text-sm">
              <div>
                <div className="uppercase text-xs font-semibold">{o.status}</div>
                <div className="opacity-80">
                  {new Date(o.created_at).toLocaleString()}
                </div>
                <div className="opacity-50 text-xs">
                  PP ID: {o.paypal_order_id}
                </div>
              </div>
              <div className="font-medium">
                ${(o.total_cents / 100).toFixed(2)} {o.currency}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
