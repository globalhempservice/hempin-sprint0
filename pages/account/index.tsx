// pages/account/index.tsx
import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import AccountShell from '../../components/AccountShell'

export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Load session on mount + keep in sync
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
    }
    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setSending(true)
    try {
      // Use SITE_URL as the redirect, fallback to window if present
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (typeof window !== 'undefined' ? window.location.origin : undefined)

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: siteUrl, // Supabase will append the hash with tokens
        },
      })
      if (error) throw error
      setNotice('Check your inbox for a magic link to sign in.')
      setEmail('')
    } catch (err: any) {
      setError(err?.message || 'Failed to send magic link.')
    } finally {
      setSending(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setNotice('You are signed out.')
  }

  // --- Logged OUT view ---
  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-sm opacity-80 mb-6">
          We’ll email you a one-time magic link to log in.
        </p>

        <form onSubmit={sendMagicLink} className="space-y-3">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Send magic link'}
          </button>
        </form>

        {notice && <p className="mt-4 text-green-700 text-sm">{notice}</p>}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <div className="mt-8 text-sm">
          <Link href="/start" className="underline">
            Try building your brand page first
          </Link>{' '}
          — you can sign in after.
        </div>
      </main>
    )
  }

  // --- Logged IN view ---
  return (
    <AccountShell
      title="Account"
      actions={
        <button onClick={signOut} className="btn btn-outline">
          Logout
        </button>
      }
    >
      <div className="grid gap-4">
        <div className="card">
          <div className="font-semibold mb-1">You’re signed in</div>
          <div className="text-sm opacity-80">
            {user.email ?? user.id}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="font-semibold mb-1">Brand</div>
            <p className="text-sm opacity-80 mb-3">
              Create or edit your brand so you’re ready for the directory launch.
            </p>
            <Link href="/account/brand" className="btn btn-primary">
              Go to Brand Setup
            </Link>
          </div>

          <div className="card">
            <div className="font-semibold mb-1">Billing & Kits</div>
            <p className="text-sm opacity-80 mb-3">
              Get your HEMPIN page or the Bangkok showroom kit.
            </p>
            <Link href="/account/billing" className="btn btn-primary">
              View Billing
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="font-semibold mb-1">Admin</div>
          <p className="text-sm opacity-80 mb-3">
            Admins can review brand submissions and payments.
          </p>
          <Link href="/admin" className="btn btn-outline">
            Go to Admin
          </Link>
        </div>
      </div>
    </AccountShell>
  )
}
