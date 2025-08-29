// pages/account/billing.tsx
import Head from 'next/head'
import AccountShell from '../../components/AccountShell'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Order = {
  id: string
  created_at: string
  status: string | null
  amount: number | null
  currency: string | null
  paypal_order_id: string | null
  payer_email: string | null
}

export default function Billing() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: session } = await supabase.auth.getSession()
      const uid = session.session?.user?.id
      if (!uid) { setOrders([]); setLoading(false); return }
      const { data } = await supabase
        .from('orders')
        .select('id,created_at,status,amount,currency,paypal_order_id,payer_email')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
      if (mounted) { setOrders((data as Order[]) || []); setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <AccountShell title="Billing">
      <Head><title>Billing • HEMPIN</title></Head>

      <div className="card">
        <h3 className="font-semibold mb-3">Your payments</h3>
        {loading ? (
          <p className="opacity-70">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="opacity-70">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left opacity-60">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Payer</th>
                  <th className="py-2 pr-4">PayPal ID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-neutral-200 dark:border-neutral-800">
                    <td className="py-2 pr-4">{new Date(o.created_at).toLocaleString()}</td>
                    <td className="py-2 pr-4">{o.status ?? '—'}</td>
                    <td className="py-2 pr-4">{o.amount ? `${o.amount} ${o.currency ?? ''}` : '—'}</td>
                    <td className="py-2 pr-4">{o.payer_email ?? '—'}</td>
                    <td className="py-2 pr-4">{o.paypal_order_id ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountShell>
  )
}