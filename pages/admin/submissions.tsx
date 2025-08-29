// pages/admin/submissions.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { useUser } from '../../lib/useUser'
import AdminSidebar from '../../components/AdminSidebar'

type Brand = {
  name: string | null
  slug: string | null
  category: string | null
  approved: boolean | null
  owner_id: string | null
} | null

type Submission = {
  id: string
  status: string | null
  submitted_at: string | null
  notes_user: string | null
  brand: Brand
}

export default function AdminSubmissions() {
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [items, setItems] = useState<Submission[]>([])
  const [fetching, setFetching] = useState(true)

  // gate: only admins
  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/account')
      return
    }
    if (profile?.role !== 'admin') {
      router.replace('/account')
      return
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    const load = async () => {
      setFetching(true)
      const { data, error } = await supabase
        .from('submissions')
        .select('id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)')
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error(error)
        setItems([])
      } else {
        // Supabase returns joined table as an array; normalize to a single object
        const rows: Submission[] = (data ?? []).map((row: any) => ({
          id: String(row.id),
          status: row.status ?? null,
          submitted_at: row.submitted_at ?? null,
          notes_user: row.notes_user ?? null,
          brand: Array.isArray(row.brand) ? (row.brand[0] ?? null) : (row.brand ?? null),
        }))
        setItems(rows)
      }
      setFetching(false)
    }
    // only run after we know the viewer is (or is not) admin
    if (user && profile?.role === 'admin') load()
  }, [user, profile])

  const approveBrand = async (slug?: string | null, submissionId?: string) => {
    if (!slug || !submissionId) return
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1 || e2)?.message)
    else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Brand approved')
    }
  }

  const markNeedsChanges = async (submissionId?: string) => {
    if (!submissionId) return
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Marked as needs changes')
    }
  }

  // basic skeleton / loading
  if (loading || (user && profile?.role === 'admin' && fetching)) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Pending submissions</h1>
          <p className="opacity-70">Loading…</p>
        </main>
      </div>
    )
  }

  // non-admins will be redirected; render nothing here
  if (!user || profile?.role !== 'admin') return null

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Pending submissions</h1>
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="card">
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <div className="min-w-[200px]">
                  <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                  <div className="text-xs opacity-70">
                    /{it.brand?.slug || '—'} • {it.brand?.category || '—'} • Approved: {String(it.brand?.approved ?? false)}
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
          {items.length === 0 && <p className="opacity-70">No submissions pending.</p>}
        </div>
      </main>
    </div>
  )
}