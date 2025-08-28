// components/AccountSidebar.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export type AccountSidebarProps = {
  /** When true, show admin links instead of user links */
  admin?: boolean
}

export default function AccountSidebar({ admin = false }: AccountSidebarProps) {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setEmail(data.user?.email ?? null)
    })()
    return () => { mounted = false }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <aside className="w-56 shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-sm opacity-70">
        {email ? <>Signed in as<br /><span className="font-medium opacity-100">{email}</span></> : 'Guest'}
      </div>

      {!admin ? (
        <nav className="flex flex-col gap-2">
          <Link className="nav-link" href="/account">Account home</Link>
          <Link className="nav-link" href="/account/billing">Billing & entitlements</Link>
          <Link className="nav-link" href="/account/brand">My brand</Link>
          <Link className="nav-link" href="/account/products">Products (test)</Link>
          <Link className="nav-link" href="/services">Services</Link>
          <Link className="nav-link" href="/brand">Preview public brand</Link>
          <Link className="nav-link" href="/start">Start</Link>
          <Link className="nav-link" href="/">Home</Link>
          <button className="btn btn-outline mt-2" onClick={signOut}>Log out</button>
        </nav>
      ) : (
        <nav className="flex flex-col gap-2">
          <Link className="nav-link" href="/admin">Pending submissions</Link>
          <Link className="nav-link" href="/admin/payments">Payments</Link>
          <Link className="nav-link" href="/">Home</Link>
          <button className="btn btn-outline mt-2" onClick={signOut}>Log out</button>
        </nav>
      )}

      <style jsx>{`
        .nav-link {
          display: block;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: transparent;
          color: #cbd5e1;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.06);
          color: white;
        }
        .btn {
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
        }
        .btn-outline {
          border: 1px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
        }
        .btn-outline:hover {
          background: rgba(255,255,255,0.06);
        }
      `}</style>
    </aside>
  )
}