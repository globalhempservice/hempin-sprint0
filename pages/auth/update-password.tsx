// pages/auth/update-password.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function UpdatePassword() {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Supabase will open this page with a short-lived session from the email.
  // We wait until the session is present or we receive the PASSWORD_RECOVERY event.
  useEffect(() => {
    let mounted = true

    const prime = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      if (data.session) setReady(true)
    }
    prime()

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (password.length < 6) throw new Error('Use at least 6 characters.')
      if (password !== confirm) throw new Error('Passwords do not match.')

      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setDone(true)
    } catch (err: any) {
      setError(err?.message || 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head><title>Choose a new password • HEMPIN</title></Head>
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Choose a new password</h1>
          <p className="opacity-75 mt-1">Use the form below to finish resetting.</p>
        </div>

        {!ready && !done && (
          <div className="card">
            <p className="opacity-80">Preparing secure session…</p>
          </div>
        )}

        {ready && !done && (
          <form onSubmit={handleSubmit} className="card space-y-4">
            <label className="block">
              <span className="text-sm opacity-75">New password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            <label className="block">
              <span className="text-sm opacity-75">Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="input mt-1 w-full text-white placeholder:text-zinc-500"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={6}
              />
            </label>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>

            <div className="text-center">
              <Link href="/signin" className="text-sm text-zinc-400 hover:text-zinc-200">
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}

        {done && (
          <div className="card space-y-3">
            <p className="font-medium">Password updated!</p>
            <Link href="/signin" className="btn btn-primary w-full">Sign in</Link>
          </div>
        )}
      </div>
    </div>
  )
}