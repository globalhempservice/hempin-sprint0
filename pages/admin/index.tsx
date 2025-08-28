// pages/admin/index.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'
import { useAuthGuard } from '../../lib/authGuard' // returns { ready, user, isAllowed }

export default function Admin() {
  const router = useRouter()
  const { ready, user } = useAuthGuard()   // no requiredRole option
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const init = async () => {
      if (!ready) return
      if (!user) { router.replace('/account'); return }

      // fetch role
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (error || prof?.role !== 'admin') {
        router.replace('/')
        return
      }

      // load submissions
      const { data: subs } = await supabase
        .from('submissions')
        .select('id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)')
        .order('submitted_at', { ascending: false })

      setItems(subs || [])
    }
    init()
  }, [ready, user, router])

  const approveBrand = async (slug:string, submissionId:string) => {
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1||e2)?.message)
    else setItems(list => list.filter(i => i.id !== submissionId))
  }

  const markNeedsChanges = async (submissionId:string) => {
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    else setItems(list => list.filter(i => i.id !== submissionId))
  }

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
                <button className="btn btn-outline" onClick={()=>markNeedsChanges(it.id)}>Needs changes</button>
                <button className="btn btn-primary" onClick={()=>approveBrand(it.brand?.slug, it.id)}>Approve</button>
              </div>
            </div>
          </div>
        ))}
        {items.length===0 && <p className="opacity-70">No submissions pending.</p>}
      </div>
    </main>
  )
}