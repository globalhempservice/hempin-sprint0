// pages/auth/callback.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supaMaybe from '../../lib/supabaseClient'
const supabase = (supaMaybe as any)?.supabase || supaMaybe

export default function AuthCallback() {
  const router = useRouter()
  const [msg, setMsg] = useState('Finishing sign-in…')

  useEffect(() => {
    (async () => {
      try {
        // Exchange ?code= for a session (Supabase v2)
        const { error } = await (supabase as any).auth.exchangeCodeForSession(window.location.href)
        if (error) {
          setMsg(error.message)
          return
        }
        const next = (router.query.next as string) || '/onboarding'
        router.replace(next)
      } catch (e: any) {
        setMsg(e?.message || 'Could not complete sign-in.')
      }
    })()
  }, [router])

  return (
    <div style={{
      minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:'#0b0d0f',color:'#eafff7',fontFamily:'ui-sans-serif, system-ui'
    }}>
      {msg}
    </div>
  )
}