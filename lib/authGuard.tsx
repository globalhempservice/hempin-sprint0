// lib/authGuard.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

type Options = {
  /** allowGuest true = don't block/redirect guests (for teaser flows) */
  allowGuest?: boolean
}

/** Simple guard used by account/admin pages */
export function useAuthGuard(options?: Options) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user ?? null
      if (!mounted) return

      setUser(u)

      if (!u && !options?.allowGuest) {
        setIsAllowed(false)
        setReady(true)
        router.replace('/account') // send guests to account/sign-in
        return
      }

      setIsAllowed(true)
      setReady(true)
    }

    init()

    // keep user in sync
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [router, options?.allowGuest])

  return { ready, isAllowed, user }
}