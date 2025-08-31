// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

// --- ADMIN SSR GUARD ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}
// --- END GUARD ---

export default function AdminHome() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted','review'])
      if (!alive) return
      setPendingCount(error ? null : (count ?? 0))
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <AdminShell title="Admin — Dashboard">
      <Head><title>Admin — Dashboard • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="font-semibold mb-1">Pending submissions</div>
          <div className="text-4xl font-bold">{pendingCount ?? 0}</div>
          <Link className="btn btn-primary mt-4" href="/admin/submissions">Review</Link>
        </div>

        <div className="card">
          <div className="font-semibold mb-1">Payments</div>
          <p className="opacity-80">See recent PayPal captures.</p>
          <Link className="btn mt-4" href="/admin/payments">Open</Link>
        </div>
      </div>
    </AdminShell>
  )
}
