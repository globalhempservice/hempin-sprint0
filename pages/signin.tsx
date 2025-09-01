// pages/signin.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Mode = 'signin' | 'signup'

export default function SignIn() {
  const router = useRouter()
  const nextParam = typeof router.query.next === 'string' ? router.query.next : '/account/profile'
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already signed in, bounce to next immediately
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      if (data.session) {
        router.replace(nextParam || '/account/profile')
      }
    })()
    return () => { mounted = false }
  }, [router, nextParam])

  const title = useMemo(
    () => (mode === 'signin' ? 'Sign in' : 'Create account'),
    [mode]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.replace(nextParam || '/account/profile')
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head><title>{title} • HEMPIN</title></Head>

      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
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
              inputMode="email"
            />
          </label>

          <label className="block">
            <span className="text-sm opacity-75">Password</span>
            <div className="relative mt-1">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input w-full pr-12 text-white placeholder:text-zinc-500"
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                minLength={6}
              />
              <button
                type="button"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                onClick={() => setShowPw(v => !v)}
                className="absolute inset-y-0 right-2 my-auto rounded px-2 text-xs opacity-70 hover:opacity-100"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-70"
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              className="text-emerald-300 hover:underline"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            >
              {mode === 'signin' ? 'Create an account' : 'Already have an account? Sign in'}
            </button>

            <Link href="/auth/reset" className="text-zinc-400 hover:text-zinc-200">
              Forgot password?
            </Link>
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