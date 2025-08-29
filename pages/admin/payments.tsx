// pages/admin/payments.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'

type Payment = {
  id: string
  created_at: string
  amount: number
  currency: string
  status: string
  payer_email: string | null
  paypal_id: string | null
}

export default function AdminPayments() {
  const [rows, setRows] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('id,created_at,amount,currency,status,payer_email,paypal_id')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!error) setRows((data || []) as any)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <AdminShell>
      <Head><title>Admin • Payments</title></Head>
      <h1 className="text-2xl font-bold mb-4">Admin — Payments</h1>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-400">
              <th className="py-2 pr-6">Date</th>
              <th className="py-2 pr-6">Status</th>
              <th className="py-2 pr-6">Amount</th>
              <th className="py-2 pr-6">Currency</th>
              <th className="py-2 pr-6">User</th>
              <th className="py-2">PayPal ID</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="py-3" colSpan={6}>Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td className="py-3" colSpan={6}>No payments yet.</td></tr>
            )}
            {rows.map(p => (
              <tr key={p.id} className="border-t border-zinc-800">
                <td className="py-2 pr-6">{new Date(p.created_at).toLocaleString()}</td>
                <td className="py-2 pr-6">{p.status}</td>
                <td className="py-2 pr-6">${(p.amount ?? 0).toFixed(2)}</td>
                <td className="py-2 pr-6">{p.currency}</td>
                <td className="py-2 pr-6">{p.payer_email || '—'}</td>
                <td className="py-2">{p.paypal_id || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}