// pages/signin.tsx
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // where to go after callback completes
      const next = (router.query.next as string) || '/account'
      const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(next)}`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Could not send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign in • HEMPIN</title></Head>
      <div className="min-h-screen grid place-items-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur">
          <h1 className="mb-2 text-xl font-semibold">Sign in</h1>
          <p className="mb-6 text-sm opacity-70">
            We’ll email you a magic link to sign in securely.
          </p>

          {sent ? (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
              Check your inbox for the magic link. You can close this tab.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none placeholder:opacity-50 focus:border-white/20"
              />
              {error && (
                <p className="text-sm text-rose-300">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Email me a magic link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm opacity-80">
            <Link href="/">← Back to site</Link>
          </div>
        </div>
      </div>
    </>
  )
}