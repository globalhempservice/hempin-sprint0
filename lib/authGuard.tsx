
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

export function useAuthGuard() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (!u) router.replace('/account')
      else setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (!u) router.replace('/account')
    })
    return () => { sub.subscription.unsubscribe() }
  }, [router])

  return { ready, user }
}
