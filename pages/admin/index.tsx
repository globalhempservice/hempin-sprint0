// pages/admin/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import AccountShell from '../../components/AccountShell'

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

export default function Admin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Submission[]>([])

  useEffect(() => {
    let mounted = true

    const check = async () => {
      // 1) require session
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null
      if (!user) { router.replace('/account'); return }

      // 2) require admin role
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('profiles.role error:', error)
        router.replace('/'); return
      }
      if (prof?.role !== 'admin') { router.replace('/'); return }

      // 3) load pending submissions
      const { data: subs, error: subErr } = await supabase
        .from('submissions')
        .select('id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)')
        .order('submitted_at', { ascending: false })

      if (!mounted) return
      if (subErr) {
        console.error(subErr)
        setItems([])
      } else {
        setItems((subs as Submission[]) || [])
      }
      setLoading(false)
    }

    check()

    // also react to auth state changes (sign out from sidebar, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        router.replace('/account')
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  const approveBrand = async (slug: string | null, submissionId: string) => {
    if (!slug) return
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) {
      alert((e1 || e2)?.message)
    } else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Brand approved')
    }
  }

  const markNeedsChanges = async (submissionId: string) => {
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) {
      alert(error.message)
    } else {
      setItems(list => list.filter(i => i.id !== submissionId))
      alert('Marked as needs changes')
    }
  }

  return (
    <AccountShell admin title="Admin – Pending Submissions">
      {loading ? (
        <p className="opacity-70">Loading…</p>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="card">
              <div className="flex flex-wrap gap-3 justify-between items-start">
                <div className="min-w-[220px]">
                  <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                  <div className="text-xs opacity-70">
                    /{it.brand?.slug || '—'} • {it.brand?.category || '—'} • Approved: {String(it.brand?.approved)}
                  </div>
                  <div className="text-xs opacity-80 mt-1">Notes: {it.notes_user || '—'}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="btn btn-outline" onClick={() => markNeedsChanges(it.id)}>
                    Needs changes
                  </button>
                  <button className="btn btn-primary" onClick={() => approveBrand(it.brand?.slug ?? null, it.id)}>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="opacity-70">No submissions pending.</p>}
        </div>
      )}
    </AccountShell>
  )
}