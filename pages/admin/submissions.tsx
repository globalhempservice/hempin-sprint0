// pages/admin/submissions.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminShell from '../../components/AdminShell'

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


type Submission = {
  id: string
  status: string | null
  submitted_at: string | null
  notes_user: string | null
  brand: { name: string | null; slug: string | null; category: string | null; approved: boolean | null; owner_id: string | null } | null
}

export default function AdminSubmissions() {
  const [items, setItems] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  async function reload() {
    const { data, error } = await supabase
      .from('submissions')
      .select('id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false })
    if (error) { console.error(error); setItems([]) }
    else setItems(((data as unknown) as Submission[]) || [])
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function approveBrand(slug: string | null, submissionId: string) {
    if (!slug) return
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1 || e2)?.message)
    await reload()
  }

  async function markNeedsChanges(submissionId: string) {
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    await reload()
  }

  return (
    <AdminShell title="Pending Submissions">
      <Head><title>Admin • Submissions</title></Head>
      {loading ? <p className="opacity-70">Loading…</p> : (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="card">
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <div className="min-w-[220px]">
                  <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                  <div className="text-xs opacity-70">/{it.brand?.slug} • {it.brand?.category} • Approved: {String(it.brand?.approved)}</div>
                  <div className="text-xs opacity-80 mt-1">Notes: {it.notes_user || '—'}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-outline" onClick={() => markNeedsChanges(it.id)}>Needs changes</button>
                  <button className="btn btn-primary" onClick={() => approveBrand(it.brand?.slug ?? null, it.id)}>Approve</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="opacity-70">No submissions pending.</p>}
        </div>
      )}
    </AdminShell>
  )
}
