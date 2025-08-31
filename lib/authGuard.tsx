// lib/authGuard.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

export function AccountRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const isAccountRoute = router.asPath.startsWith('/account')
  const [ready, setReady] = useState(!isAccountRoute) // public pages render immediately

  useEffect(() => {
    let alive = true
    if (!isAccountRoute) return

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const session = data?.session
      if (!alive) return
      if (!session) {
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
      } else {
        setReady(true)
      }
    })()

    return () => { alive = false }
  }, [isAccountRoute, router])

  if (!ready) {
    // minimal placeholder to avoid flicker
    return <div className="min-h-screen bg-black" />
  }
  return <>{children}</>
}