// lib/authGuard.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

type Role = 'admin' | 'user' | null

type Options = {
  requiredRole?: Role // pass 'admin' to restrict a page to admins
  redirectTo?: string // default '/account'
}

export function useAuthGuard(opts: Options = {}) {
  const { requiredRole, redirectTo = '/account' } = opts
  const router = useRouter()

  const [ready, setReady] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const [role, setRole] = useState<Role>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          // Not signed in — send them to the account page (signin happens there)
          if (!cancelled) {
            setIsAllowed(false)
            setReady(true)
            router.replace(redirectTo)
          }
          return
        }

        setUserId(user.id)

        // Load the profile role
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error

        const r = (prof?.role as Role) ?? 'user'
        if (!cancelled) setRole(r)

        // Check role if required
        if (requiredRole && r !== requiredRole) {
          if (!cancelled) {
            setIsAllowed(false)
            setReady(true)
            router.replace(redirectTo) // non-admins get bounced to /account
          }
          return
        }

        if (!cancelled) {
          setIsAllowed(true)
          setReady(true)
        }
      } catch {
        if (!cancelled) {
          setIsAllowed(false)
          setReady(true)
          router.replace(redirectTo)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [requiredRole, redirectTo, router])

  return { ready, isAllowed, role, userId }
}