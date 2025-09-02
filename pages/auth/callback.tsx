// pages/auth/callback.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Finalizing sign-in…')

  useEffect(() => {
    if (!router.isReady) return
    ;(async () => {
      try {
        const next = (router.query.next as string) || '/onboarding'
        const code = router.query.code as string | undefined

        if (code) {
          // ✅ v2 API: exchange authorization code received in the email link
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          setMsg('Signed in! Redirecting…')
          router.replace(next)
          return
        }

        // (Optional) Legacy hash fallback (if some old links still contain tokens)
        // We’ll just bounce to /join which can start a new flow gracefully
        setMsg('No code found. Taking you to sign in…')
        router.replace(`/join?next=${encodeURIComponent(next)}`)
      } catch (e: any) {
        console.error(e)
        setMsg(e?.message || 'Could not complete sign-in.')
      }
    })()
  }, [router])

  return (
    <>
      <Head><title>Signing in… — HEMPIN</title></Head>
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: '#090b0d', color: '#eafff7', fontFamily: 'ui-sans-serif,system-ui'
      }}>
        <div style={{
          padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,.1)',
          background: 'rgba(255,255,255,.04)'
        }}>
          {msg}
        </div>
      </div>
    </>
  )
}