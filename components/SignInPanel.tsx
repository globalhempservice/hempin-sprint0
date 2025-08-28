// components/SignInPanel.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignInPanel() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/account`,
      },
    })
    setBusy(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-2">Check your inbox</h2>
        <p>We sent a magic link to <span className="font-medium">{email}</span>. Open it on this device to finish signing in.</p>
      </div>
    )
  }

  return (
    <form onSubmit={sendMagicLink} className="card p-5 space-y-3 max-w-md">
      <h2 className="text-lg font-semibold">Sign in to continue</h2>
      <p className="text-sm opacity-80">We’ll email you a magic link. No password needed.</p>
      <input
        type="email"
        required
        value={email}
        onChange={e=>setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send magic link'}</button>
    </form>
  )
}