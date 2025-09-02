import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function AuthCallback() {
  const r = useRouter()
  const [msg, setMsg] = useState('Finalizing sign-in…')

  useEffect(() => {
    (async () => {
      try {
        // Prefer the "code" param (PKCE / email magic link)
        const code = (r.query.code as string) || ''
        const next = (r.query.next as string) || '/onboarding'

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          setMsg('Signed in. Redirecting…')
          r.replace(next)
          return
        }

        // Fallback for hash-based redirects (older flows)
        if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { error } = await supabase.auth.getSessionFromUrl({
            storeSession: true,
          } as any)
          if (error) throw error
          setMsg('Signed in. Redirecting…')
          r.replace(next)
          return
        }

        // Nothing to exchange — bounce to join
        r.replace('/join')
      } catch (e: any) {
        setMsg(e?.message || 'Could not complete sign-in.')
      }
    })()
  }, [r])

  return (
    <>
      <Head><title>Signing you in… • HEMPIN</title></Head>
      <div style={{
        minHeight:'60vh',display:'grid',placeItems:'center',
        color:'#eafff7',background:'#090b0d',fontFamily:'ui-sans-serif,system-ui'
      }}>
        <div style={{opacity:.9}}>{msg}</div>
      </div>
    </>
  )
}