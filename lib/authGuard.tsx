// lib/authGuard.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

/**
 * Wrap /account pages with this guard.
 * - Shows a loader briefly while checking session
 * - If guest, renders a clear sign-in card (no redirect loop)
 * - Subscribes to auth changes and updates inline
 */
export function AccountRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>('checking')

  useEffect(() => {
    let alive = true

    const run = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!alive) return
      if (error) {
        console.warn('auth getSession error:', error.message)
        setStatus('guest')
        return
      }
      setStatus(data.session ? 'authed' : 'guest')
    }

    run()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!alive) return
      setStatus(session ? 'authed' : 'guest')
    })

    return () => {
      alive = false
      sub.subscription?.unsubscribe?.()
    }
  }, [router.isReady])

  if (status === 'checking') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-zinc-400">Loading…</div>
      </div>
    )
  }

  if (status === 'guest') {
    const next = encodeURIComponent(router.asPath || '/account')
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md w-full rounded-xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur-md p-6 text-center">
          <div className="text-lg font-semibold mb-2">Sign in required</div>
          <p className="text-[var(--text-2)] mb-4">Please sign in to access your tools.</p>
          <a
            className="inline-block rounded-lg border border-white/15 px-4 py-2 bg-white/5 hover:bg-white/10 transition"
            href={`/signin?next=${next}`}
          >
            Go to Sign in
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}