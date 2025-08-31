// pages/auth/callback.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    let alive = true
    ;(async () => {
      const next = (router.query.next as string) || '/account'
      try {
        // --- 1) PKCE / OAuth: /auth/callback?code=... ---
        const code = router.query.code as string | undefined
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code) // <- expects string
          if (error) throw error
          if (!alive) return
          router.replace(next)
          return
        }

        // --- 2) Magic link: /auth/callback#access_token=...&refresh_token=... ---
        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = new URLSearchParams(window.location.hash.slice(1))
          const access_token = hash.get('access_token') || undefined
          const refresh_token = hash.get('refresh_token') || undefined

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error) throw error
            if (!alive) return
            // Clean the hash so it doesn't linger in history
            window.history.replaceState({}, document.title, window.location.pathname)
            router.replace(next)
            return
          }
        }

        // If we get here, we didn't find a usable token/code
        router.replace('/signin?error=missing_credentials')
      } catch (err: any) {
        const msg = encodeURIComponent(err?.message || 'auth_error')
        router.replace(`/signin?error=${msg}`)
      }
    })()
    return () => { alive = false }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Head><title>Signing you in… • HEMPIN</title></Head>
      <div className="text-center space-y-2">
        <div className="animate-pulse text-lg">Finishing sign-in…</div>
        <div className="opacity-70 text-sm">If this takes more than a few seconds, return to the email and tap the link again.</div>
      </div>
    </div>
  )
}