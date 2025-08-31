// components/AdminShell.tsx
import Head from 'next/head'
import Link from 'next/link'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      {/* top bar (mobile only) */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 flex items-center justify-between border-b border-white/5 bg-black/60 px-4 py-3 backdrop-blur lg:hidden">
        <div className="text-sm font-medium">Admin</div>
        <Link href="/" className="rounded-lg px-2 py-1 text-sm text-zinc-300 hover:bg-white/5">
          Back to site
        </Link>
      </div>

      <Head><title>{title}</title></Head>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto,1fr]">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <main className="min-h-screen pb-16 pt-6 md:pt-8">
          <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  )
}
