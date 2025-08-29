// pages/auth/callback.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // Parses the URL hash (? or #) for access/refresh tokens and stores session
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
        if (error) throw error

        // Go where the user intended, otherwise account
        const next = (router.query.next as string) || '/account'
        // cleanup: remove hash fragments
        window.history.replaceState({}, document.title, next)
        router.replace(next)
      } catch (e) {
        // fallback on error
        router.replace('/signin?error=callback_failed')
      }
    }
    run()
    // only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head><title>Signing you in… • HEMPIN</title></Head>
      <div className="min-h-screen grid place-items-center">
        <p className="opacity-70">Signing you in…</p>
      </div>
    </>
  )
}