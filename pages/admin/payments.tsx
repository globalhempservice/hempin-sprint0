import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'
import { useAuthGuard } from '../../lib/authGuard'

type Row = {
  id: string
  user_id: string | null
  status: string
  total_cents: number | null
  currency: string | null
  created_at: string
  paypal_order_id: string | null
  profiles?: { email?: string | null }
}

export default function AdminPayments() {
  const ready = useAuthGuard()
  const router = useRouter()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    ;(async () => {
      try {
        // gate: only admins
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return router.replace('/account')

        const { data: me } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (me?.role !== 'admin') {
          router.replace('/account')
          return
        }

        // orders with optional user email (join via RLS-friendly view: profiles)
        const { data, error } = await supabase
          .from('orders')
          .select('id,user_id,status,total_cents,currency,created_at,paypal_order_id,profiles!inner(email)')
          .order('created_at', { ascending: false })

        if (error) throw error
        setRows(data as any)
      } catch (e: any) {
        setErr(e?.message || 'Failed to load payments.')
      }
    })()
  }, [ready, router])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin — Payments</h1>
      {err && <div className="mb-4 rounded-md bg-red-500/15 border border-red-500/30 px-3 py-2 text-red-300">{err}</div>}
      {!rows && !err && <div className="opacity-70">Loading…</div>}

      {rows && (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-6 text-xs uppercase tracking-wide opacity-70 border-b border-white/10 px-3 py-2">
            <div>Date</div><div>Status</div><div>Amount</div><div>Currency</div><div>User</div><div>PayPal ID</div>
          </div>
          {rows.map(r => (
            <div key={r.id} className="grid grid-cols-6 text-sm px-3 py-2 border-b border-white/5">
              <div>{new Date(r.created_at).toLocaleString()}</div>
              <div className="font-medium">{r.status}</div>
              <div>{r.total_cents != null ? `$${(r.total_cents/100).toFixed(2)}` : '—'}</div>
              <div>{r.currency || ''}</div>
              <div>{(r as any).profiles?.email || r.user_id || '—'}</div>
              <div className="opacity-70">{r.paypal_order_id || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
