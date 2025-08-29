// components/RequireAuth.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

type Props = { children: ReactNode }

/**
 * Client-only auth guard:
 * - Renders nothing until we know the session (prevents flicker)
 * - If not signed in, redirects to /signin?next=<current path>
 * - If signed out later, sends back to /signin
 */
export default function RequireAuth({ children }: Props) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function check() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      const session = data?.session
      if (!session) {
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
        return
      }

      setReady(true)
    }

    check()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        const next = encodeURIComponent(router.asPath || '/account')
        router.replace(`/signin?next=${next}`)
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe()
    }
  }, [router])

  if (!ready) {
    // keep simple and invisible to prevent layout flicker
    return null
  }

  return <>{children}</>
}