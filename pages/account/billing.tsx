// pages/account/billing.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import AccountShell from '../../components/AccountShell'
import { useUser } from '../../lib/useUser'
import { supabase } from '../../lib/supabaseClient'

type Row = {
  id: string
  created_at: string
  amount: number
  currency: string
  status: string
  payer_email: string | null
  paypal_id: string | null
}

export default function Billing() {
  const { user } = useUser()
  const [entitlements, setEntitlements] = useState<any | null>(null)
  const [invoices, setInvoices] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Entitlements — if you have a table for this; otherwise hardcode for now
      // Placeholder structure for the UI
      setEntitlements({
        brand_page: true,
        product_slots: 5,
        showroom_bkk: true,
        extra_popup_products: 0,
      })

      // Payments for this user
      if (user?.email) {
        const { data } = await supabase
          .from('payments')
          .select('id,created_at,amount,currency,status,payer_email,paypal_id')
          .eq('payer_email', user.email)
          .order('created_at', { ascending: false })
        setInvoices((data || []) as any)
      }
      setLoading(false)
    }
    load()
  }, [user?.email])

  return (
    <AccountShell>
      <Head><title>Billing • HEMPIN</title></Head>
      <h1 className="text-2xl font-bold mb-4">Billing & entitlements</h1>

      <div className="grid gap-4">
        <div className="card">
          <div className="text-lg font-semibold mb-2">Your entitlements</div>
          <ul className="space-y-2 text-sm">
            <li>Brand page: <b>{entitlements?.brand_page ? 'Enabled' : 'Disabled'}</b></li>
            <li>Product slots: <b>{entitlements?.product_slots ?? 0}</b></li>
            <li>Bangkok 2025 showroom: <b>{entitlements?.showroom_bkk ? 'Included' : '—'}</b></li>
            <li>Extra popup products: <b>{entitlements?.extra_popup_products ?? 0}</b></li>
          </ul>
        </div>

        <div className="card overflow-x-auto">
          <div className="text-lg font-semibold mb-2">Invoices & receipts</div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400">
                <th className="py-2 pr-6">Date</th>
                <th className="py-2 pr-6">Status</th>
                <th className="py-2 pr-6">Amount</th>
                <th className="py-2 pr-6">Currency</th>
                <th className="py-2 pr-6">PayPal ID</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-3" colSpan={5}>Loading…</td></tr>}
              {!loading && invoices.length === 0 && (
                <tr><td className="py-3" colSpan={5}>No invoices yet.</td></tr>
              )}
              {invoices.map(inv => (
                <tr key={inv.id} className="border-t border-zinc-800">
                  <td className="py-2 pr-6">{new Date(inv.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-6">{inv.status}</td>
                  <td className="py-2 pr-6">${(inv.amount ?? 0).toFixed(2)}</td>
                  <td className="py-2 pr-6">{inv.currency}</td>
                  <td className="py-2 pr-6">{inv.paypal_id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AccountShell>
  )
}