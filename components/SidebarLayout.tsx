// components/SidebarLayout.tsx
import AdminSidebar from './AdminSidebar'
import Link from 'next/link'

export default function SidebarLayout({
  children,
  variant = 'account',
}: {
  children: React.ReactNode
  variant?: 'account' | 'admin'
}) {
  return (
    <div className="min-h-screen bg-[var(--app-bg,#0b0d0c)] text-white">
      <div className="mx-auto max-w-7xl flex">
        {variant === 'admin' ? (
          <AdminSidebar />
        ) : (
          <aside className="w-[240px] shrink-0 h-screen sticky top-0 p-3 bg-white/5 border-r border-white/10 backdrop-blur-xl">
            <div className="px-2 py-3 text-sm font-semibold tracking-wide text-[var(--text-2)]">HEMPIN</div>
            <nav className="grid gap-1">
              <Link href="/account/profile" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Profile</Link>
              <Link href="/account/brand" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Brands</Link>
              <Link href="/account/products" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Products</Link>
              <Link href="/supermarket" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Supermarket</Link> 
              <Link href="/account/events" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Events</Link>
              <Link href="/experiments" className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">Experiments</Link>
            </nav>
          </aside>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}