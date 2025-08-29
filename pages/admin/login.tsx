// pages/admin/login.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { useUser } from '../../lib/useUser'

const SITE = process.env.NEXT_PUBLIC_SITE_URL

export default function AdminLogin() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // If already logged in, route based on role
  useEffect(() => {
    const go = async () => {
      if (loading) return
      if (!user) return
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (prof?.role === 'admin') router.replace('/admin')
      else router.replace('/account')
    }
    go()
  }, [user, loading, router])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE}/admin` },
    })
    setBusy(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">Admin Sign in</h1>
      <p className="mb-6 text-sm text-white/70">
        Admins only. You will be redirected to the admin dashboard after login.
      </p>

      {sent ? (
        <p className="rounded-md bg-green-500/10 p-3 text-green-300">
          Check your email for a magic link.
        </p>
      ) : (
        <form onSubmit={send} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yourcompany.com"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-white px-4 py-2 font-medium text-black disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
    </div>
  )
}