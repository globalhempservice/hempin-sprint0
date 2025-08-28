// pages/admin/index.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import AccountSidebar from '../../components/AccountSidebar'

type BrandLite = {
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
  brand: BrandLite
}

export default function Admin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Submission[]>([])

  useEffect(() => {
    const init = async () => {
      // auth
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null
      if (!user) { router.replace('/account'); return }

      // role gate
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (profErr || prof?.role !== 'admin') { router.replace('/'); return }

      // load submissions
      const { data: subs, error } = await supabase
        .from('submissions')
        .select(
          'id,status,submitted_at,notes_user,brand:brands(name,slug,category,approved,owner_id)'
        )
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error(error)
        setItems([])
      } else {
        // Normalize brand: Supabase type inference can return an array for the relation.
        const normalized: Submission[] = (subs ?? []).map((row: any) => {
          const b = Array.isArray(row.brand) ? (row.brand[0] ?? null) : row.brand ?? null
          return {
            id: String(row.id),
            status: row.status ?? null,
            submitted_at: row.submitted_at ?? null,
            notes_user: row.notes_user ?? null,
            brand: b
          }
        })
        setItems(normalized)
      }

      setLoading(false)
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approveBrand = async (slug: string | null, submissionId: string) => {
    if (!slug) return alert('Missing brand slug')
    const { error: e1 } = await supabase.from('brands').update({ approved: true }).eq('slug', slug)
    const { error: e2 } = await supabase.from('submissions').update({ status: 'approved' }).eq('id', submissionId)
    if (e1 || e2) alert((e1 || e2)?.message)
    else setItems(list => list.filter(i => i.id !== submissionId))
  }

  const markNeedsChanges = async (submissionId: string) => {
    const { error } = await supabase.from('submissions').update({ status: 'needs_changes' }).eq('id', submissionId)
    if (error) alert(error.message)
    else setItems(list => list.filter(i => i.id !== submissionId))
  }

  return (
    <div className="flex">
      <AccountSidebar admin />
      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin – Pending Submissions</h1>

        {loading && <p className="opacity-70">Loading…</p>}

        {!loading && (
          <div className="grid gap-3">
            {items.map((it) => (
              <div key={it.id} className="card">
                <div className="flex flex-wrap gap-3 justify-between items-start">
                  <div className="min-w-[220px]">
                    <div className="font-semibold">{it.brand?.name || '(no name)'}</div>
                    <div className="text-xs opacity-70">
                      /{it.brand?.slug || '—'} • {it.brand?.category || '—'} • Approved: {String(it.brand?.approved ?? false)}
                    </div>
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
      </main>
    </div>
  )
}