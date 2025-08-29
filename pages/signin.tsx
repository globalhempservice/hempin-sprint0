// pages/signin.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabaseClient'

export default function SignIn() {
  const router = useRouter()
  const next = typeof router.query.next === 'string' ? router.query.next : '/account'
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already signed in, bounce to next
  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) router.replace(next || '/account')
    })
    return () => {
      mounted = false
    }
  }, [next, router])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      const site = process.env.NEXT_PUBLIC_SITE_URL || ''
      const redirectTo = `${site.replace(/\/$/, '')}/auth/callback?next=${encodeURIComponent(
        next || '/account'
      )}`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })

      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send magic link.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Head><title>Sign in • HEMPIN</title></Head>
      <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
      {sent ? (
        <p className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
          Check your inbox for a magic link.
        </p>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!!error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Email me a magic link'}
          </button>
        </form>
      )}
    </div>
  )
}