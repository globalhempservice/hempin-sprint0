// pages/account/billing.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import AccountShell from '../../components/AccountShell'
import { supabase } from '../../lib/supabaseClient'

type PayRow = {
  id?: string
  created_at?: string
  status?: string | null
  amount?: number | null
  currency?: string | null
}

export default function Billing() {
  const [rows, setRows] = useState<PayRow[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: session } = await supabase.auth.getSession()
      const userId = session.session?.user?.id
      if (!userId) return

      // try user-scoped payments first
      let list: PayRow[] = []
      const { data } = await supabase
        .from('payments')
        .select('id,created_at,status,amount,currency,user_id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)
      if (data) list = data as any

      setRows(list)
    }
    load()
  }, [])

  return (
    <AccountShell title="Billing & entitlements" actions={null}>
      <Head><title>Billing • HEMPIN</title></Head>

      <div className="card">
        <div className="text-sm font-semibold mb-3">Your entitlements</div>
        <ul className="text-sm space-y-2">
          <li>Brand page: <strong>Enabled</strong></li>
          <li>Product slots: <strong>5</strong></li>
          <li>Bangkok 2025 showroom: <strong>Included</strong></li>
          <li>Extra popup products: <strong>0</strong></li>
        </ul>
      </div>

      <div className="card">
        <div className="text-sm font-semibold mb-3">Invoices & receipts</div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-zinc-400">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                <th>Date</th><th>Status</th><th>Amount</th><th>Currency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map(r => (
                <tr key={r.id} className="[&>td]:px-3 [&>td]:py-2">
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                  <td>{r.status ?? '—'}</td>
                  <td>{typeof r.amount === 'number' ? `$${r.amount.toFixed(2)}` : '—'}</td>
                  <td>{r.currency ?? '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-zinc-500">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AccountShell>
  )
}