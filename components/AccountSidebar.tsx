// components/AccountSidebar.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { useUser } from '../lib/useUser' // named export

type Item = { href: string; label: string }

export default function AccountSidebar() {
  const router = useRouter()
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)

  // Look up the user's role (client-side, lightweight)
  useEffect(() => {
    let cancelled = false
    async function loadRole() {
      if (!user) { setIsAdmin(false); return }
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (!cancelled) setIsAdmin(!!data && data.role === 'admin')
      if (error) console.warn('role lookup failed:', error.message)
    }
    loadRole()
    return () => { cancelled = true }
  }, [user])

  const items: Item[] = [
    { href: '/account', label: 'Account home' },
    { href: '/account/billing', label: 'Billing & entitlements' },
    { href: '/account/brand', label: 'My brand' },
    { href: '/account/products', label: 'Products (test)' },
    { href: '/shop', label: 'Shop' },
    // Admin link only for admins
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' } as Item] : []),
  ]

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/auth/logout') // simple confirmation page
  }

  return (
    <aside className="w-[230px] shrink-0 border-r border-white/10 p-4 space-y-4">
      <div className="text-xs opacity-70">
        Signed in as<br />{user?.email ?? 'Guest'}
      </div>

      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <Link key={i.href} href={i.href} className="hover:underline">
            {i.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="btn btn-outline w-full mt-4">
        Log out
      </button>
    </aside>
  )
}