// components/AccountSidebar.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../lib/useUser'

type Item = { href: string; label: string }

export default function AccountSidebar() {
  const router = useRouter()
  const { user, profile, signOut } = useUser()

  const common: Item[] = [
    { href: '/account', label: 'Account home' },
    { href: '/account/brand', label: 'My Brand' },
    { href: '/account/products', label: 'My Products' },
    { href: '/account/billing', label: 'Billing' },
    { href: '/account/services', label: 'HEMPIN Services' },
  ]

  async function handleLogout() {
    await signOut()
    router.push('/auth/logout')
  }

  return (
    <aside className="sticky top-24">
      <div className="mb-4 space-y-1">
        <div className="text-xs uppercase opacity-60">Signed in as</div>
        <div className="text-sm font-medium break-all">{user?.email ?? '—'}</div>
        {/* placeholder for future avatar/profile link */}
        <Link href="/account" className="text-xs underline opacity-80">
          View profile
        </Link>
      </div>

      <nav className="grid gap-1">
        {common.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              router.pathname === it.href ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' : ''
            }`}
          >
            {it.label}
          </Link>
        ))}

        {profile?.role === 'admin' && (
          <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <div className="text-xs uppercase opacity-60 mb-1">Admin</div>
            <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 block">
              Admin dashboard
            </Link>
          </div>
        )}

        <button onClick={handleLogout} className="btn btn-outline mt-4">Log out</button>
      </nav>
    </aside>
  )
}