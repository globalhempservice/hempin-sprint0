// pages/admin/payments.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'

type Row = {
  id?: string
  created_at?: string
  status?: string | null
  amount?: number | null
  currency?: string | null
  payer_email?: string | null
  paypal_id?: string | null
}

// This works with either a normalized `payments` table
// OR falls back to a `paypal_events` view with similar columns.
export default function AdminPayments() {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    const load = async () => {
      // try payments first
      const { data, error } = await supabase
        .from('payments')
        .select('id,created_at,status,amount,currency,payer_email,paypal_id')
        .order('created_at', { ascending: false })
        .limit(200)

      if (!error && data) {
        setRows(data as Row[])
        return
      }

      // fallback
      const fb = await supabase
        .from('paypal_events')
        .select('id,created_at,status,amount,currency,payer_email,paypal_id')
        .order('created_at', { ascending: false })
        .limit(200)

      setRows((fb.data as Row[]) ?? [])
    }

    load()
  }, [])

  return (
    <AdminShell title="Payments">
      <Head><title>Admin • Payments</title></Head>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th>Date</th><th>Status</th><th>Amount</th><th>Currency</th>
              <th>User</th><th>PayPal ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map(r => (
              <tr key={r.id} className="[&>td]:px-3 [&>td]:py-2">
                <td>{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                <td>{r.status ?? '—'}</td>
                <td>{typeof r.amount === 'number' ? `$${r.amount.toFixed(2)}` : '—'}</td>
                <td>{r.currency ?? '—'}</td>
                <td>{r.payer_email ?? '—'}</td>
                <td className="font-mono text-xs">{r.paypal_id ?? '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-zinc-500">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}