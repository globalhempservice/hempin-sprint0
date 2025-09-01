// pages/auth/reset.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE_URL}/auth/update-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head><title>Reset password • HEMPIN</title></Head>
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="opacity-75 mt-1">Enter your email and we’ll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="card space-y-3">
            <p>We’ve sent a password reset link to <span className="font-medium">{email}</span>.</p>
            <p className="text-sm opacity-75">Open the link on this device to continue.</p>
            <Link href="/signin" className="btn btn-primary w-full">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card space-y-4">
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
                autoFocus
              />
            </label>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <div className="text-center">
              <Link href="/signin" className="text-sm text-zinc-400 hover:text-zinc-200">
                ← Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}