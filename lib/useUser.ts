// lib/useUser.ts
import { useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

type Profile = { role?: 'admin' | 'user' | string | null } | null

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile>(null)
  const [loading, setLoading] = useState(true)

  // signOut helper
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const s = data.session ?? null
        const u = s?.user ?? null
        if (cancelled) return
        setSession(s)
        setUser(u)

        if (u) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', u.id)
            .maybeSingle()
          if (!cancelled) setProfile(prof ?? { role: null })
        } else {
          setProfile(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      // refetch profile when auth changes
      if (newSession?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', newSession.user.id)
          .maybeSingle()
          .then(({ data: prof }) => setProfile(prof ?? { role: null }))
      } else {
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return { user, session, profile, loading, signOut }
}