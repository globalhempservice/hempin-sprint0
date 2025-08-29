// pages/_app.tsx
import '../styles/globals.css'                     // <-- brings Tailwind + global styles back
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { UserContextProvider } from '../lib/useUser'

// Any route not starting with /account or /admin is public.
// (/signin and auth routes are public too.)
const isProtectedPath = (path: string) =>
  path.startsWith('/account') || path.startsWith('/admin')

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const run = async () => {
      // Only guard protected paths
      if (!isProtectedPath(router.pathname)) {
        setReady(true)
        return
      }

      // Check current session
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace(`/signin?next=${encodeURIComponent(router.asPath)}`)
        return
      }

      // Watch auth state going forward
      const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
        if (!session && isProtectedPath(router.pathname)) {
          router.replace('/signin')
        }
      })
      unsub = () => sub.subscription.unsubscribe()
      setReady(true)
    }

    run()
    return () => { if (unsub) unsub() }
  }, [router.pathname, router.asPath])

  if (!ready) return null
  return <>{children}</>
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </UserContextProvider>
  )
}