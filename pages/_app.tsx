// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AccountGuard } from '../lib/authGuard'
import { supabase } from '../lib/supabaseClient'

/** Debug tracer: logs route changes and auth events to the console */
function useDebugRouting() {
  const router = useRouter()

  useEffect(() => {
    const onStart = (url: string) => console.debug('[route] ->', url)
    router.events.on('routeChangeStart', onStart)
    return () => router.events.off('routeChangeStart', onStart)
  }, [router.events])

  useEffect(() => {
    console.debug('[auth] tracer mounted')
    const { data } = supabase.auth.onAuthStateChange((evt, session) => {
      console.debug('[auth]', evt, 'user=', session?.user?.id || null)
    })
    return () => data.subscription?.unsubscribe?.()
  }, [])
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useDebugRouting()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b0f12" />
      </Head>
      {/* Wrap EVERYTHING so the context is always present */}
      <AccountGuard>
        <Component {...pageProps} />
      </AccountGuard>
    </>
  )
}