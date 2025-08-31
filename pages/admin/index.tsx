// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

// --- ADMIN SSR GUARD (keep your existing imports below this) ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) {
    return redirectToAdminLogin(ctx)
  }
  return { props: {} }
}
// --- END GUARD ---

export default function AdminHome() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      // Count submissions that still require review.
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted','review'])
      if (!isMounted) return
      if (error) setPendingCount(null)
      else setPendingCount(count ?? 0)
    }
    load()
    return () => { isMounted = false }
  }, [])

  return (
    <AdminShell title="Admin — Dashboard">
      <Head><title>Admin — Dashboard • HEMPIN</title></Head>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Pending submissions</div>
              <p className="text-sm opacity-80">
                Review incoming brand submissions ({pendingCount ?? '…'}).
              </p>
            </div>
            <Link href="/admin/submissions" className="btn btn-primary">Review</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Payments</div>
              <p className="text-sm opacity-80">See recent PayPal captures.</p>
            </div>
            <Link href="/admin/payments" className="btn btn-outline">Open</Link>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
