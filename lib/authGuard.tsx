// lib/authGuard.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

/**
 * Hook to enforce authentication + optional role requirement
 * Redirects automatically if user is not allowed
 */
export function useAuthGuard({ requiredRole }: { requiredRole?: string } = {}) {
  const [ready, setReady] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user ?? null

      if (!user) {
        router.replace('/account') // not signed in
        return
      }

      if (requiredRole) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        if (prof?.role !== requiredRole) {
          router.replace('/account') // wrong role
          return
        }
      }

      setIsAllowed(true)
    }

    checkAuth().finally(() => setReady(true))
  }, [requiredRole, router])

  return { ready, isAllowed }
}