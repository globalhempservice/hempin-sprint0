// pages/admin/index.tsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuthGuard } from '../../lib/authGuard'

export default function Admin() {
  // enforce auth + role
  const { ready, isAllowed } = useAuthGuard({ requiredRole: 'admin' })

  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!isAllowed) return
    const load = async () => {
      const { data: subs } = await supabase
        .from('submissions')
        .select('id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)')
        .order('submitted_at', { ascending: false })
      setItems(subs || [])
    }
    load()
  }, [isAllowed])

  const approveBrand = async (slug: string, submissionId: string) => {
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1 || e2)?.message)
    else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Brand approved')
    }
  }

  const markNeedsChanges = async (submissionId: string) => {
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Marked as needs changes')
    }
  }

  if (!ready) return null      // waiting for guard
  if (!isAllowed) return null  // guard will redirect

  return (
    <main className="container space-y-6">
      <h1 className="text-2xl font-bold">Admin – Pending Submissions</h1>
      <div className="grid gap-3">
        {items.map((it) => (
          <div key={it.id} className="card">
            <div className="flex flex-wrap gap-3 justify-between items-start">
              <div className="min-w-[200px]">
                <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                <div className="text-xs opacity-70">/{it.brand?.slug} • {it.brand?.category} • Approved: {String(it.brand?.approved)}</div>
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
  )
}