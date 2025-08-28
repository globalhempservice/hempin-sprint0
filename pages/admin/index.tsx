// pages/admin/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import AccountSidebar from '../../components/AccountSidebar'
import { useUser } from '../../lib/useUser'
import SignInPanel from '../../components/SignInPanel'

type Submission = {
  id: string
  status: string | null
  submitted_at: string | null
  notes_user: string | null
  brand: {
    name: string | null
    slug: string | null
    category: string | null
    approved: boolean | null
    owner_id: string | null
  } | null
}

export default function AdminPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const [items, setItems] = useState<Submission[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (loading) return
      if (!user) return // show SignInPanel instead of redirect
      setBusy(true)
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      setRole(prof?.role ?? null)

      if ((prof?.role ?? null) === 'admin') {
        const { data: subs } = await supabase
          .from('submissions')
          .select(`
            id,status,submitted_at,notes_user,
            brand:brands(name,slug,category,approved,owner_id)
          `)
          .order('submitted_at', { ascending: false })

        // Supabase returns brand as an object; be lenient for TS.
        setItems((subs as unknown as Submission[]) || [])
      }
      setBusy(false)
    }
    load()
  }, [loading, user])

  const approveBrand = async (slug?: string | null, submissionId?: string) => {
    if (!slug || !submissionId) return
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1 || e2)?.message)
    else setItems((list) => list.filter((i) => i.id !== submissionId))
  }

  const markNeedsChanges = async (submissionId?: string) => {
    if (!submissionId) return
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    else setItems((list) => list.filter((i) => i.id !== submissionId))
  }

  return (
    <div className="flex">
      <AccountSidebar admin />
      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin – Pending Submissions</h1>

        {loading && <p className="opacity-70">Loading…</p>}

        {!loading && !user && (
          <>
            <p className="opacity-80">Admin access requires sign-in.</p>
            <SignInPanel />
          </>
        )}

        {!loading && user && role !== 'admin' && (
          <div className="card p-5">
            <p className="opacity-80">You’re signed in, but this account isn’t an admin.</p>
            <div className="mt-3">
              <a className="btn btn-outline" href="/">Go home</a>
            </div>
          </div>
        )}

        {!loading && user && role === 'admin' && (
          <div className="grid gap-3">
            {items.map((it) => (
              <div key={it.id} className="card">
                <div className="flex flex-wrap gap-3 justify-between items-start">
                  <div className="min-w-[220px]">
                    <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                    <div className="text-xs opacity-70">
                      /{it.brand?.slug} • {it.brand?.category} • Approved: {String(it.brand?.approved)}
                    </div>
                    <div className="text-xs opacity-80 mt-1">Notes: {it.notes_user || '—'}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="btn btn-outline" onClick={() => markNeedsChanges(it.id)}>Needs changes</button>
                    <button className="btn btn-primary" onClick={() => approveBrand(it.brand?.slug, it.id)}>Approve</button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="opacity-70">{busy ? 'Loading…' : 'No submissions pending.'}</p>}
          </div>
        )}
      </main>
    </div>
  )
}