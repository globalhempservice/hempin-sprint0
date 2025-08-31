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
// --- /ADMIN SSR GUARD ---

export default function AdminHome() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted', 'review'])
      if (!alive) return
      setPendingCount(error ? null : (count ?? 0))
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <AdminShell title="Admin — Dashboard">
      <Head><title>Admin — Dashboard • HEMPIN</title></Head>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pending submissions */}
          <div className="card">
            <div className="mb-1 text-sm font-semibold opacity-80">Pending submissions</div>
            <div className="mb-3 text-5xl font-bold leading-none">
              {pendingCount === null ? '—' : pendingCount}
            </div>
            <Link href="/admin/submissions" className="btn btn-primary">Review</Link>
          </div>

          {/* Payments */}
          <div className="card">
            <div className="mb-1 text-sm font-semibold opacity-80">Payments</div>
            <p className="mb-3 opacity-80">See recent PayPal captures.</p>
            <Link href="/admin/payments" className="btn btn-outline">Open</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
