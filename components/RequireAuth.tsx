// components/RequireAuth.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUser } from '../lib/useUser'

type Props = {
  children: React.ReactNode
  // when true, also require profile.role === 'admin'
  adminOnly?: boolean
}

export default function RequireAuth({ children, adminOnly }: Props) {
  const { user, loading, profile } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      const next = encodeURIComponent(router.asPath || '/account')
      router.replace(`/signin?next=${next}`)
      return
    }
    if (adminOnly && profile?.role !== 'admin') {
      router.replace('/account')
    }
  }, [user, loading, adminOnly, profile?.role, router])

  if (loading) return null
  if (!user) return null
  if (adminOnly && profile?.role !== 'admin') return null

  return <>{children}</>
}