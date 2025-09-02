// pages/signin.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
export default function SigninRedirect() {
  const r = useRouter()
  useEffect(() => {
    const q = new URLSearchParams(r.query as any).toString()
    r.replace(`/join${q ? `?${q}` : ''}`)
  }, [r])
  return null
}