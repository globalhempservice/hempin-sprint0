// pages/admin/payments.tsx
import Head from 'next/head'
import AdminShell from '../../components/AdminShell'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// --- ADMIN SSR GUARD ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'

type OrderRow = {
  id: string
  user_id: string | null
  status: string | null
  total_cents: number | null
  currency: string | null
  paypal_order_id: string | null
  created_at: string | null
}

type Props = {
  initialRows: OrderRow[]
  ssrError: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) {
    return redirectToAdminLogin(ctx)
  }

  // Always return Props (or redirect). Never {}.
  let initialRows: OrderRow[] = []
  let ssrError: string | null = null

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id,user_id,status,total_cents,currency,paypal_order_id,created_at')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) ssrError = error.message
    else initialRows = data ?? []
  } catch (e: any) {
    ssrError = e?.message ?? 'Unknown error'
  }

  return { props: { initialRows, ssrError } }
}
// --- END GUARD ---

export default function AdminPayments({ initialRows, ssrError }: Props) {
  const [rows, setRows] = useState<OrderRow[]>(initialRows)
  const [loading, setLoading] = useState(false)
  const [clientErr, setClientErr] = useState<string | null>(null)

  // Optional client refresh after mount (keeps SSR fast + accurate)
  useEffect(() => {
    let alive = true
    const refresh = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('id,user_id,status,total_cents,currency,paypal_order_id,created_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!alive) return
      if (error) setClientErr(error.message)
      else setRows(data ?? [])
      setLoading(false)
    }
    refresh()
    return () => { alive = false }
  }, [])

  return (
    <AdminShell title="Admin — Payments">
      <Head><title>Admin — Payments • HEMPIN</title></Head>

      {(ssrError || clientErr) && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {clientErr || ssrError}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
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
            {loading && (
              <tr><td className="py-3 opacity-60" colSpan={6}>Loading…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td className="py-3 opacity-60" colSpan={6}>No payments yet.</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.id} className="border-t border-zinc-800/60">
                <td className="py-2 pr-4">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                <td className="py-2 pr-4">{r.status ?? '—'}</td>
                <td className="py-2 pr-4">{((r.total_cents ?? 0) / 100).toFixed(2)}</td>
                <td className="py-2 pr-4">{r.currency ?? '—'}</td>
                <td className="py-2 pr-4">{r.user_id ?? '—'}</td>
                <td className="py-2 pr-4">{r.paypal_order_id ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
