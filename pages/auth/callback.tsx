// pages/auth/callback.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createBrowserClient } from '@supabase/ssr' // or '@supabase/supabase-js' if that’s what you use

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      // Exchange the code in the URL for a session cookie
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      // Ignore "No code" error if user landed here accidentally

      const next = (router.query.next as string) || '/account'
      router.replace(next)
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen grid place-items-center text-zinc-300">
      <div className="opacity-80">Signing you in…</div>
    </div>
  )
}