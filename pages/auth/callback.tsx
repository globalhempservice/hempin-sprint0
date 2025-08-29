// pages/auth/callback.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

function parseHash() {
  if (typeof window === 'undefined') return {}
  const h = window.location.hash || ''
  const params = new URLSearchParams(h.startsWith('#') ? h.slice(1) : h)
  const access_token = params.get('access_token') || undefined
  const refresh_token = params.get('refresh_token') || undefined
  const token_type = params.get('token_type') || undefined
  return { access_token, refresh_token, token_type }
}

export default function AuthCallback() {
  const router = useRouter()
  const next = typeof router.query.next === 'string' ? router.query.next : '/account'

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const { access_token, refresh_token } = parseHash()

        if (access_token && refresh_token) {
          // Email OTP magic-link flow: restore session explicitly
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (error) throw error
          // Clean the hash to avoid confusion
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
          if (!mounted) return
          router.replace(next || '/account')
          return
        }

        // Fallback: if session already exists (e.g. different flow)
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          if (!mounted) return
          router.replace(next || '/account')
          return
        }

        // No session → go to signin
        if (!mounted) return
        router.replace(`/signin?next=${encodeURIComponent(next || '/account')}`)
      } catch {
        if (!mounted) return
        router.replace(`/signin?next=${encodeURIComponent(next || '/account')}`)
      }
    }

    run()
    return () => {
      mounted = false
    }
  }, [router, next])

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Head><title>Signing you in… • HEMPIN</title></Head>
      <div className="animate-pulse text-sm opacity-80">Signing you in…</div>
    </div>
  )
}