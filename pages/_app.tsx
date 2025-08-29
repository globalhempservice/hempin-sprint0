// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

// Guard only account/admin; everything else (marketing, signin, auth) is public
const isProtected = (p: string) => p.startsWith('/account') || p.startsWith('/admin')

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const run = async () => {
      if (!isProtected(router.pathname)) {
        setReady(true)
        return
      }

      // Check current session
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace(`/signin?next=${encodeURIComponent(router.asPath)}`)
        return
      }

      // Watch auth changes
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!session && isProtected(router.pathname)) {
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
    <RouteGuard>
      <Component {...pageProps} />
    </RouteGuard>
  )
}