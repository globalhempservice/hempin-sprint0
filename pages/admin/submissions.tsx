// pages/admin/submissions.tsx
import Head from 'next/head'
import AdminShell from '../../components/AdminShell'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// --- ADMIN SSR GUARD + SSR DATA FETCH ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

type SubmissionRow = {
  id: string
  brand_id: string | null
  status: string | null
  created_at: string | null
  updated_at: string | null
}

type Props = {
  initialRows: SubmissionRow[]
  ssrError?: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return { props: { initialRows: [], ssrError: 'Missing Supabase env vars' } }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await admin
    .from('submissions')
    .select('id,brand_id,status,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(200)

  return { props: { initialRows: data ?? [], ssrError: error?.message ?? null } }
}
// --- END GUARD + SSR FETCH ---

export default function AdminSubmissions({ initialRows, ssrError }: Props) {
  const [rows, setRows] = useState<SubmissionRow[]>(initialRows)
  const [loading, setLoading] = useState(false)

  // Optional anon fallback if SSR didn’t run with service key (local dev)
  useEffect(() => {
    if (initialRows.length > 0) return
    let alive = true
    setLoading(true)
    const load = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id,brand_id,status,created_at,updated_at')
        .order('created_at', { ascending: false })
        .limit(200)
      if (!alive) return
      if (!error) setRows(data ?? [])
      setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [initialRows])

  return (
    <AdminShell title="Admin — Submissions">
      <Head><title>Admin — Submissions • HEMPIN</title></Head>

      {ssrError && (
        <div className="mb-3 text-sm text-red-400">Server fetch error: {ssrError}</div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Brand</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="py-3 opacity-60" colSpan={5}>Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td className="py-3 opacity-60" colSpan={5}>No submissions.</td></tr>
            )}
            {rows.map(r => (
              <tr key={r.id} className="border-t border-zinc-800/60">
                <td className="py-2 pr-4">{r.id}</td>
                <td className="py-2 pr-4">{r.brand_id ?? '—'}</td>
                <td className="py-2 pr-4">{r.status ?? '—'}</td>
                <td className="py-2 pr-4">{r.created_at ? new Date(r.created_at).toLocaleString() : '—'}</td>
                <td className="py-2 pr-4">{r.updated_at ? new Date(r.updated_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  )
}
