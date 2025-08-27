// components/AdminSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function AdminSidebar() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/account') // kick back to account sign-in/home
  }

  const linkCls =
    'block px-4 py-2 rounded hover:bg-zinc-800 transition-colors'

  return (
    <aside className="w-56 shrink-0 border-r border-zinc-800 min-h-screen p-4 space-y-3">
      <div className="text-sm tracking-wider text-emerald-400 font-semibold mb-2">
        HEMP’IN
      </div>

      <nav className="space-y-1 text-sm">
        <Link className={linkCls} href="/admin">Pending submissions</Link>
        <Link className={linkCls} href="/admin/payments">Payments</Link>
        <Link className={linkCls} href="/shop">Shop</Link>
        <Link className={linkCls} href="/account">Go to Account</Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700"
      >
        Log out
      </button>
    </aside>
  )
}