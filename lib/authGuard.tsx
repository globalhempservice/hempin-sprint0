// lib/authGuard.tsx
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from './supabaseClient'

type AuthCtxShape = {
  loading: boolean
  user: null | { id: string; email?: string; [k: string]: any }
  session: any | null
}
const AuthCtx = createContext<AuthCtxShape>({ loading: true, user: null, session: null })
export const useAuth = () => useContext(AuthCtx)

export function AccountGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthCtxShape>({ loading: true, user: null, session: null })

  useEffect(() => {
    let alive = true
    let safety: any

    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!alive) return
        if (error) {
          console.warn('getSession error:', error.message)
          setState({ loading: false, user: null, session: null })
        } else {
          setState({ loading: false, user: data?.session?.user ?? null, session: data?.session ?? null })
        }
      } catch (e: any) {
        if (!alive) return
        console.warn('getSession threw:', e?.message || e)
        setState({ loading: false, user: null, session: null })
      }
    })()

    // safety valve: don’t allow endless loading
    safety = setTimeout(() => {
      if (alive) setState(s => (s.loading ? { ...s, loading: false } : s))
    }, 4000)

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return
      setState({ loading: false, user: session?.user ?? null, session: session ?? null })
    })

    return () => {
      alive = false
      clearTimeout(safety)
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(() => state, [state.loading, state.user, state.session])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function SignInRequiredCard({ nextPath = '/account' }: { nextPath?: string }) {
  const next = encodeURIComponent(nextPath)
  return (
    <div className="min-h-[40vh] grid place-items-center px-4">
      <div className="max-w-md w-full rounded-xl border border-white/10 bg-[var(--surface)]/80 backdrop-blur-md p-6 text-center">
        <div className="text-lg font-semibold mb-2">Sign in required</div>
        <p className="text-[var(--text-2)] mb-4">Please sign in to access your tools.</p>
        <a className="inline-block rounded-lg border border-white/15 px-4 py-2 bg-white/5 hover:bg-white/10 transition"
           href={`/signin?next=${next}`}>
          Go to Sign in
        </a>
      </div>
    </div>
  )
}