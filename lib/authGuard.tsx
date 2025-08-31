// lib/authGuard.ts
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

/**
 * Wrap /account pages with this guard.
 * - Renders a blocking loader while checking session
 * - Redirects guests to /signin?next=<current>
 * - Subscribes to auth changes to avoid flicker
 */
export function AccountRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>('checking')

  useEffect(() => {
    let alive = true
    if (!router.isReady) return

    async function run() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!alive) return

      if (session) {
        setStatus('authed')
      } else {
        setStatus('guest')
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
      }
    }

    run()

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!alive) return
      if (session) {
        setStatus('authed')
      } else {
        setStatus('guest')
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
      }
    })

    return () => {
      alive = false
      sub.subscription?.unsubscribe?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]) // only when router ready

  if (status === 'checking') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-zinc-400">Loading…</div>
      </div>
    )
  }

  if (status === 'guest') {
    // Router is already replacing; render nothing to prevent flicker
    return null
  }

  return <>{children}</>
}