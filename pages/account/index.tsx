// pages/account/index.tsx
import Link from 'next/link'
import AccountSidebar from '../../components/AccountSidebar'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function AccountHome() {
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user
      if (!u) return
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle()
      setRole(prof?.role ?? null)
    }
    load()
  }, [])

  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Account</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="font-semibold mb-2">Brand</div>
            <p className="opacity-80 mb-3">
              Create or edit your brand so you’re ready for the directory launch.
            </p>
            <div className="flex gap-2">
              <Link href="/account/brand" className="btn btn-primary">Go to Brand Setup</Link>
            </div>
          </div>

          <div className="card">
            <div className="font-semibold mb-2">Billing & Kits</div>
            <p className="opacity-80 mb-3">Manage your plan and Bangkok showcase kit.</p>
            <Link href="/account/billing" className="btn btn-primary">View Billing</Link>
          </div>

          {role === 'admin' && (
            <div className="card md:col-span-2">
              <div className="font-semibold mb-2">Admin</div>
              <p className="opacity-80 mb-3">Moderate submissions and view payments.</p>
              <Link href="/admin" className="btn btn-outline">Go to Admin</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}