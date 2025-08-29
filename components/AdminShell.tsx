// components/AdminShell.tsx
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ children, title }: { children: ReactNode; title?: string }) {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user
      if (!u) { router.replace('/account'); return }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle()
      if (prof?.role !== 'admin') { router.replace('/account'); }
    }
    run()
  }, [router])

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6 space-y-4">
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        {children}
      </main>
    </div>
  )
}