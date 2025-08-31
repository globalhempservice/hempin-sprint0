// pages/admin/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import AdminShell from '../../components/AdminShell'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// --- ADMIN SSR GUARD + SSR DATA FETCH ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

type Props = {
  pendingCountSSR: number | null
  ssrError?: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { props: { pendingCountSSR: null, ssrError: 'Missing Supabase env vars' } }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { count, error } = await admin
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .in('status', ['submitted', 'review'])

  return { props: { pendingCountSSR: count ?? 0, ssrError: error?.message ?? null } }
}
// --- END GUARD + SSR FETCH ---

export default function AdminHome({ pendingCountSSR, ssrError }: Props) {
  // keep your existing state hook
  const [pendingCount, setPendingCount] = useState<number | null>(pendingCountSSR)

  // Optional client fallback (e.g., local dev without service key)
  useEffect(() => {
    if (pendingCountSSR !== null) return
    let alive = true
    const load = async () => {
      const { count, error } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .in('status', ['submitted', 'review'])
      if (!alive) return
      if (!error) setPendingCount(count ?? 0)
    }
    load()
    return () => { alive = false }
  }, [pendingCountSSR])

  return (
    <AdminShell title="Admin — Dashboard">
      <Head><title>Admin — Dashboard • HEMPIN</title></Head>

      {ssrError && <div className="mb-3 text-sm text-red-400">Server fetch error: {ssrError}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-70">Pending submissions</div>
              <div className="mt-1 text-2xl font-semibold">
                {pendingCount ?? '—'}
              </div>
            </div>
            <Link href="/admin/submissions" className="btn btn-primary">Review</Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-70">Payments</div>
              <div className="mt-1 opacity-70">See recent PayPal captures.</div>
            </div>
            <Link href="/admin/payments" className="btn btn-outline">Open</Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/" className="text-emerald-300 hover:underline">Back to site</Link>
      </div>
    </AdminShell>
  )
}
