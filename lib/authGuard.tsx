// lib/authGuard.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

// Client-side guard for /account/** pages.
// If no session, redirects to /signin?next=<current-path>
export function AccountRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!alive) return
      if (!session) {
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
      } else {
        setChecking(false)
      }
    })()
    return () => { alive = false }
  }, [router])

  // Lightweight loading state while we check/redirect
  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm opacity-70">Checking your session…</div>
      </div>
    )
  }

  return <>{children}</>
}