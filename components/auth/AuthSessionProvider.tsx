import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../../lib/supabaseClient'

type SessionState = {
  loading: boolean
  user: null | {
    id: string
    email?: string
    [k: string]: any
  }
  // raw session if you need it later
  session: any | null
}

const AuthCtx = createContext<SessionState>({ loading: true, user: null, session: null })

export function useAuthSession() {
  return useContext(AuthCtx)
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ loading: true, user: null, session: null })

  useEffect(() => {
    let alive = true

    ;(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!alive) return
      if (error) {
        console.warn('auth getSession error:', error.message)
        setState({ loading: false, user: null, session: null })
      } else {
        setState({ loading: false, user: data?.session?.user ?? null, session: data?.session ?? null })
      }
    })()

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return
      setState({ loading: false, user: session?.user ?? null, session: session ?? null })
    })

    return () => {
      alive = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => state, [state.loading, state.user, state.session])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}