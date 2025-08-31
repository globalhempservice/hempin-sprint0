// pages/auth/callback.tsx
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Finalizing sign-in…')

  useEffect(() => {
    async function run() {
      // Supabase v2 magic-link returns a `code` in the querystring
      const code = typeof router.query.code === 'string' ? router.query.code : null
      const next = typeof router.query.next === 'string' ? router.query.next : '/account'

      try {
        if (!code) {
          setMsg('Missing authorization code in URL.')
          return
        }

        const { error } = await supabase.auth.exchangeCodeForSession({ code })
        if (error) throw error

        router.replace(next || '/account')
      } catch (e: any) {
        setMsg(e?.message || 'Sign-in failed.')
      }
    }
    if (router.isReady) run()
  }, [router])

  return (
    <>
      <Head><title>Signing in… • HEMPIN</title></Head>
      <div className="min-h-screen grid place-items-center text-zinc-300">{msg}</div>
    </>
  )
}