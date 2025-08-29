// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

import { supabase } from '../lib/supabaseClient'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import SidebarLayout from '../components/SidebarLayout'

// Simple route guards
const isPrivateRoute = (pathname: string) =>
  pathname.startsWith('/account') || pathname.startsWith('/admin')

// Tiny veil while we verify session for private routes
function Veil() {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/80 text-white">
      <div className="animate-pulse text-sm opacity-80">Loading…</div>
    </div>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [checking, setChecking] = useState(false)
  const [authed, setAuthed] = useState<boolean | null>(null) // null = unknown

  // Check auth only for private routes
  useEffect(() => {
    let isMounted = true

    async function check() {
      if (!isPrivateRoute(router.pathname)) {
        // Public page: no gate
        if (isMounted) {
          setAuthed(true)
          setChecking(false)
        }
        return
      }

      setChecking(true)
      const { data } = await supabase.auth.getSession()
      const hasSession = !!data.session

      if (!isMounted) return

      if (!hasSession) {
        setAuthed(false)
        // Send to signin with a return URL
        const next = router.asPath || router.pathname
        router.replace(`/signin?next=${encodeURIComponent(next)}`)
      } else {
        setAuthed(true)
      }
      setChecking(false)
    }

    check()
    return () => {
      isMounted = false
    }
  }, [router.pathname, router.asPath])

  const layout = useMemo<'public' | 'account' | 'admin'>(() => {
    if (router.pathname.startsWith('/admin')) return 'admin'
    if (router.pathname.startsWith('/account')) return 'account'
    return 'public'
  }, [router.pathname])

  // While deciding on private routes, show veil to avoid flashes
  const shouldVeil = isPrivateRoute(router.pathname) && (checking || authed === null)

  if (layout === 'public') {
    return (
      <>
        <SiteNav />
        <Component {...pageProps} />
        <SiteFooter />
      </>
    )
  }

  // Private shells
  return (
    <>
      {shouldVeil && <Veil />}
      <SidebarLayout variant={layout === 'admin' ? 'admin' : 'account'}>
        <Component {...pageProps} />
      </SidebarLayout>
    </>
  )
}