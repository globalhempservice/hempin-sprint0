// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useUser } from '../lib/useUser'

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading, profile } = useUser()

  const path = router.pathname
  const protectAccount = path.startsWith('/account')
  const protectAdmin = path.startsWith('/admin')
  const needsAuth = protectAccount || protectAdmin
  const adminOnly = protectAdmin

  useEffect(() => {
    if (!needsAuth || loading) return

    // Not signed in → send to signin, preserve intended destination
    if (!user) {
      const next = encodeURIComponent(router.asPath || '/account')
      router.replace(`/signin?next=${next}`)
      return
    }

    // Admin routes: require role=admin
    if (adminOnly && profile?.role !== 'admin') {
      router.replace('/account')
    }
  }, [needsAuth, adminOnly, loading, user, profile?.role, router])

  // While deciding auth, render nothing to avoid flicker
  if (needsAuth && (loading || !user || (adminOnly && profile?.role !== 'admin'))) {
    return null
  }

  return <>{children}</>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RouteGuard>
      <Component {...pageProps} />
    </RouteGuard>
  )
}