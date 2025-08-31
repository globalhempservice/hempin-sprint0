// pages/signin.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Mode = 'signin' | 'signup'

export default function SignIn() {
  const router = useRouter()
  const next = typeof router.query.next === 'string' ? router.query.next : '/account'

  // url can preselect mode with ?mode=signup
  const initialMode = useMemo<Mode>(() => {
    const m = String(router.query.mode || '').toLowerCase()
    return m === 'signup' ? 'signup' : 'signin'
  }, [router.query.mode])

  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => setMode(initialMode), [initialMode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      if (mode === 'signup') {
        const { data, error: e } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              typeof window !== 'undefined'
                ? `${window.location.origin}/account`
                : undefined,
          },
        })
        if (e) throw e

        // If your project requires email confirmation, there will be no session yet.
        if (!data.session) {
          setInfo('Check your inbox to confirm your email. Then come back and sign in.')
          return
        }

        // If email confirmation is disabled and a session exists, go straight in.
        router.replace(next || '/account')
        return
      }

      // Sign in
      const { error: e } = await supabase.auth.signInWithPassword({ email, password })
      if (e) throw e
      router.replace(next || '/account')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head>
        <title>{mode === 'signin' ? 'Sign in' : 'Create account'} • HEMPIN</title>
      </Head>

      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {mode === 'signin' ? 'Sign in' : 'Create your account'}
          </h1>
          <p className="mt-1 text-zinc-400">
            {mode === 'signin'
              ? 'Welcome back.'
              : 'One password for your brand, products, and experiments.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <label className="block">
            <span className="text-sm text-zinc-400">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2 text-white
                         placeholder:text-zinc-500 outline-none ring-1 ring-white/10
                         focus:ring-2 focus:ring-violet-400"
            />
          </label>

          <label className="block">
            <span className="text-sm text-zinc-400">Password</span>
            <div className="mt-1 relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="w-full rounded-lg bg-white/5 px-3 py-2 pr-10 text-white
                           placeholder:text-zinc-500 outline-none ring-1 ring-white/10
                           focus:ring-2 focus:ring-violet-400"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-0 px-3 text-sm text-zinc-400 hover:text-zinc-200"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                title={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {info && <div className="text-emerald-400 text-sm">{info}</div>}

          <button
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div className="text-center text-sm text-zinc-400">
            {mode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  className="text-emerald-300 hover:underline"
                  onClick={() => {
                    setMode('signup')
                    setError(null)
                    setInfo(null)
                  }}
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
                  onClick={() => {
                    setMode('signin')
                    setError(null)
                    setInfo(null)
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}