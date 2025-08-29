// pages/auth/callback.tsx
import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

function getParamsFromLocation() {
  // Supabase magic link may arrive in the hash (#access_token=...) or in the query (?access_token=...)
  const raw =
    typeof window === 'undefined'
      ? ''
      : window.location.hash?.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.search?.startsWith('?')
      ? window.location.search.slice(1)
      : ''
  const p = new URLSearchParams(raw)
  return {
    access_token: p.get('access_token') || '',
    refresh_token: p.get('refresh_token') || p.get('refreshToken') || '',
    next: p.get('next') || '',
  }
}

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        const { access_token, refresh_token, next } = getParamsFromLocation()

        if (access_token && refresh_token) {
          // Store the session in Supabase
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) throw error

          // Clean the URL (remove tokens) and go to destination
          const dest = next || '/account'
          window.history.replaceState({}, document.title, dest)
          router.replace(dest)
          return
        }

        // If tokens aren’t present, maybe the session is already set (e.g. user clicked twice)
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          router.replace((router.query.next as string) || '/account')
        } else {
          router.replace('/signin?error=missing_tokens')
        }
      } catch {
        router.replace('/signin?error=callback_failed')
      }
    }
    run()
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