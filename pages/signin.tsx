// pages/signin.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import { createBrowserClient } from '@supabase/ssr'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const next = (router.query.next as string) || '/account'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL // fallback for SSR/Netlify

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      console.error(error)
      setStatus('error')
      return
    }
    setStatus('sent')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md bg-zinc-900/60 border border-zinc-700 px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-md bg-emerald-600 px-3 py-2 font-medium disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send magic link'}
        </button>

        {status === 'sent' && (
          <p className="text-sm opacity-80">Check your email for the sign-in link.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400">There was a problem sending your link.</p>
        )}
      </form>
    </div>
  )
}