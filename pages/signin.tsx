// pages/signin.tsx
import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = typeof router.query.next === 'string' ? router.query.next : '/account'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const redirectTo = `${SITE_URL}/auth/callback?next=${encodeURIComponent(next || '/account')}`

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })

    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <>
      <Head><title>Sign in • HEMPIN</title></Head>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur">
          <h1 className="mb-4 text-xl font-semibold">Sign in</h1>

          {sent ? (
            <div className="space-y-3">
              <p className="text-zinc-300">
                We’ve sent a magic link to <span className="font-medium">{email}</span>. Check your inbox.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => router.push('/')}
              >
                Go to homepage
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              {error && <div className="text-sm text-red-400">{error}</div>}
              <button className="btn btn-primary w-full" type="submit">
                Email me a magic link
              </button>
            </form>
          )}

          <div className="mt-6 text-xs text-zinc-500">You’ll be redirected back to: <code>{String(next)}</code></div>
        </div>
      </div>
    </>
  )
}