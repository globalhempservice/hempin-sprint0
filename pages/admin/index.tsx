// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
      if (!error) setPendingCount(data ? (data as any).length ?? 0 : 0)
      // NOTE: count comes via header; if not available, we could do a non-head select and length.
    }
    load()
  }, [])

  return (
    <AdminShell>
      <Head><title>Admin • Dashboard</title></Head>
      <h1 className="text-2xl font-bold mb-4">Admin — Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">Pending submissions</div>
              <p className="text-sm text-zinc-400 mt-1">
                Review incoming brand submissions{typeof pendingCount === 'number' ? ` (${pendingCount})` : ''}.
              </p>
            </div>
            <Link href="/admin/submissions" className="btn btn-primary">Review</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold">Payments</div>
              <p className="text-sm text-zinc-400 mt-1">See recent PayPal captures.</p>
            </div>
            <Link href="/admin/payments" className="btn btn-outline">Open</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}