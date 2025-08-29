// pages/admin/index.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminShell from '../../components/AdminShell'
import Link from 'next/link'

export default function AdminHome() {
  const [pending, setPending] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { count } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'submitted')
      if (mounted) setPending(count ?? 0)
    })()
    return () => { mounted = false }
  }, [])

  return (
    <AdminShell title="Admin Dashboard">
      <Head><title>Admin • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Review incoming brand submissions {typeof pending === 'number' ? `(${pending})` : ''}</h3>
              <p className="opacity-80 text-sm">Approve or request changes for new brands.</p>
            </div>
            <Link href="/admin/submissions" className="btn btn-primary">Open</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">Payments</h3>
              <p className="opacity-80 text-sm">See captured orders.</p>
            </div>
            <Link href="/admin/payments" className="btn btn-outline">View</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}