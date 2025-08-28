// components/SignInPanel.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SignInPanel() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) { setError('Please enter an email.'); return }
    setSending(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send magic link.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="card">
        <h3 className="font-semibold mb-2">Check your email ✉️</h3>
        <p>We sent a magic link to <span className="font-mono">{email}</span>. Open it on this device to finish signing in.</p>
      </div>
    )
  }

  return (
    <form onSubmit={sendMagicLink} className="card space-y-3">
      <h3 className="font-semibold">Sign in to save and continue</h3>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        autoComplete="email"
        required
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button className="btn btn-primary" disabled={sending}>
        {sending ? 'Sending…' : 'Send magic link'}
      </button>
      <p className="text-xs opacity-70">No password needed. We’ll attach any draft work on this device to your account after you click the link.</p>
    </form>
  )
}