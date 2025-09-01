// pages/account/profile.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type U = { email: string; name?: string | null }

export default function ProfilePage() {
  const [user, setUser] = useState<U | null>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      const u = data.user
      if (!u) return
      setUser({
        email: u.email || '',
        name: (u.user_metadata?.full_name as string | undefined) ?? null,
      })
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Head><title>Profile • HEMPIN</title></Head>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      {!user ? (
        <div className="card">Loading…</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="text-sm opacity-70">Name</div>
            <div className="mt-1 text-lg">{user.name || '—'}</div>
          </div>
          <div className="card">
            <div className="text-sm opacity-70">Email</div>
            <div className="mt-1 text-lg">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  )
}