// pages/admin/payments.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminShell from '../../components/AdminShell'

type PaymentRow = {
  id: string
  created_at: string
  status: string
  amount: number
  currency: string
  user_email: string | null
  paypal_id: string | null
}

export default function AdminPayments() {
  const [rows, setRows] = useState<PaymentRow[]>([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('payments')
        .select('id,created_at,status,amount,currency,user_email,paypal_id')
        .order('created_at', { ascending: false })
      setRows((data as PaymentRow[]) || [])
    }
    load()
  }, [])

  return (
    <AdminShell title="Admin — Payments">
      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Currency</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">PayPal ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
                <td className="py-2 pr-4">{r.status}</td>
                <td className="py-2 pr-4">${r.amount.toFixed(2)}</td>
                <td className="py-2 pr-4">{r.currency}</td>
                <td className="py-2 pr-4">{r.user_email}</td>
                <td className="py-2 pr-4">{r.paypal_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}