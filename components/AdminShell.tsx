// components/AdminShell.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import AdminSidebar from './AdminSidebar'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminShell({ title, actions, children }: { title?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user
      if (!u) {
        if (mounted) { setIsAdmin(false); setReady(true) }
        router.replace('/admin/login')
        return
      }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle()
      const allowed = prof?.role === 'admin'
      if (!allowed) router.replace('/admin/login')
      if (mounted) { setIsAdmin(!!allowed); setReady(true) }
    })()
    return () => { mounted = false }
  }, [router])

  if (!ready || !isAdmin) return null

  return (
    <div className="min-h-screen flex">
      <div className="w-64 hidden lg:block p-6 border-r border-neutral-200 dark:border-neutral-800">
        <AdminSidebar />
      </div>
      <main className="flex-1 p-6 container space-y-5">
        {(title || actions) && (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex gap-2">{actions}</div>
          </div>
        )}
        {children}
        <div className="pt-6 text-xs opacity-70">
          <Link href="/">Back to site</Link>
        </div>
      </main>
    </div>
  )
}