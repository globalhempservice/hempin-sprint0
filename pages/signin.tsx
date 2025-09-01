// pages/signin.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignIn() {
  const router = useRouter()

  // Decide where to go after auth:
  // 1) explicit ?next= from header
  // 2) same-origin referrer (not /signin)
  // 3) /account
  const nextDest = useMemo(() => {
    const q = router.query.next
    if (typeof q === 'string' && q.trim()) return q

    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const ref = new URL(document.referrer)
        if (
          ref.origin === window.location.origin &&
          !ref.pathname.startsWith('/signin')
        ) {
          return ref.pathname + ref.search + ref.hash
        }
      } catch {
        /* ignore malformed referrer */
      }
    }
    return '/account'
  }, [router.query.next])

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signup') {
        const { error: e } = await supabase.auth.signUp({ email, password })
        if (e) throw e
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email, password })
        if (e) throw e
      }
      router.replace(nextDest || '/account')
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head>
        <title>{mode === 'signin' ? 'Sign in' : 'Create account'} • HEMPIN</title>
      </Head>

      {/* Fix browser autofill on dark backgrounds */}
      <style jsx global>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 9999s ease-out 0s;
          box-shadow: 0 0 0px 1000px transparent inset !important;
        }
      `}</style>

      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="opacity-75 mt-1">
            {mode === 'signin'
              ? 'Welcome back.'
              : 'One password for your brand, products, and experiments.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 card">
          <label className="block">
            <span className="text-sm opacity-75">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input mt-1 w-full text-white placeholder:text-zinc-500"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              inputMode="email"
            />
          </label>

          <label className="block">
            <span className="text-sm opacity-75">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input mt-1 w-full text-white placeholder:text-zinc-500"
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div className="text-center text-sm opacity-75">
            {mode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="text-emerald-300 hover:underline"
                  onClick={() => setMode('signup')}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-emerald-300 hover:underline"
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>

        <div className="text-center">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}