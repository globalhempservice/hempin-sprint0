// pages/signin.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SITE = process.env.NEXT_PUBLIC_SITE_URL

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${SITE}/account` },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Sign in / Sign up</h1>
      {sent ? (
        <p className="rounded-md bg-green-500/10 p-3 text-green-300">
          Check your email for a magic link. You’ll land in your account.
        </p>
      ) : (
        <form onSubmit={send} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-white px-4 py-2 font-medium text-black disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      )}
      <p className="mt-6 text-sm text-white/60">
        By continuing you agree to our terms and privacy policy.
      </p>
    </div>
  )
}