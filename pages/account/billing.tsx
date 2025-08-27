import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { useAuthGuard } from '../../lib/authGuard'

type Order = {
  id: string
  status: string
  total_cents: number | null
  currency: string | null
  created_at: string
  paypal_order_id: string | null
}

type Ent = {
  brand_page: boolean
  product_slots: number
  popup_bkk_2025: boolean
  popup_extras: number
}

export default function Billing() {
  const ready = useAuthGuard() // redirects to /account login if not authenticated
  const router = useRouter()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [ent, setEnt] = useState<Ent | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    ;(async () => {
      try {
        const { data: { user }, error: uErr } = await supabase.auth.getUser()
        if (uErr || !user) {
          router.replace('/account')
          return
        }

        const [{ data: oData, error: oErr }, { data: eData, error: eErr }] = await Promise.all([
          supabase.from('orders')
            .select('id,status,total_cents,currency,created_at,paypal_order_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase.from('entitlements')
            .select('brand_page,product_slots,popup_bkk_2025,popup_extras')
            .eq('user_id', user.id)
            .maybeSingle(),
        ])

        if (oErr) throw oErr
        if (eErr) throw eErr

        setOrders(oData || [])
        setEnt((eData as any) || { brand_page: false, product_slots: 0, popup_bkk_2025: false, popup_extras: 0 })
      } catch (e: any) {
        setErr(e?.message || 'Failed to load billing info.')
      } finally {
        setLoading(false)
      }
    })()
  }, [ready, router])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Billing & Entitlements</h1>

      {err && <div className="mb-4 rounded-md bg-red-500/15 border border-red-500/30 px-3 py-2 text-red-300">{err}</div>}
      {loading && <div className="opacity-70">Loading…</div>}

      {ent && (
        <div className="mb-8 rounded-xl border border-white/10 p-4">
          <h2 className="font-medium mb-2">Current entitlements</h2>
          <ul className="space-y-1 text-sm opacity-90">
            <li>Brand page: {ent.brand_page ? '✅ enabled' : '—'}</li>
            <li>Product slots: {ent.product_slots}</li>
            <li>Bangkok Pop-up 2025: {ent.popup_bkk_2025 ? '✅ included' : '—'}</li>
            <li>Pop-up extras: {ent.popup_extras}</li>
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-white/10 p-4">
        <h2 className="font-medium mb-2">Purchase history</h2>
        {!orders?.length && <div className="text-sm opacity-70">No orders yet.</div>}
        <div className="divide-y divide-white/10">
          {orders?.map((o) => (
            <div key={o.id} className="py-3 flex items-center justify-between text-sm">
              <div className="space-y-0.5">
                <div className="font-medium">{o.status.toUpperCase()}</div>
                <div className="opacity-70">{new Date(o.created_at).toLocaleString()}</div>
                {o.paypal_order_id && <div className="opacity-60">PP ID: {o.paypal_order_id}</div>}
              </div>
              <div className="font-medium">
                {o.total_cents != null ? `$${(o.total_cents / 100).toFixed(2)}` : '—'} {o.currency || ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
