// pages/admin/submissions.tsx
import Head from 'next/head'
import AdminShell from '../../components/AdminShell'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// --- ADMIN SSR GUARD ---
import type { GetServerSideProps } from 'next'
import { hasValidAdminCookie, redirectToAdminLogin } from '../../lib/adminAuth'
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!hasValidAdminCookie(ctx.req)) return redirectToAdminLogin(ctx)
  return { props: {} }
}
// --- END GUARD ---

type SubmissionRow = {
  id: string
  status?: string | null
  brand?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export default function AdminSubmissions() {
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*') // do not request columns that may not exist
        .order('created_at', { ascending: false })
        .limit(200)
      if (!alive) return
      if (error) setErrorMsg(error.message)
      setRows(data ?? [])
      setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [])

  return (
    <AdminShell title="Admin — Submissions">
      <Head><title>Admin — Submissions • HEMPIN</title></Head>

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Server fetch error: {errorMsg}
        </div>
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
            {!loading && rows.length === 0 && <tr><td className="py-3 opacity-60" colSpan={5}>No submissions.</td></tr>}
            {rows.map(r => (
              <tr key={r.id} className="border-t border-zinc-800/60">
                <td className="py-2 pr-4">{r.id}</td>
                <td className="py-2 pr-4">{r.brand ?? '—'}</td>
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
