// components/PublicShell.tsx
import type { ReactNode } from 'react'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'

type Props = { children: ReactNode; className?: string }

export default function PublicShell({ children, className }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0b0c] text-zinc-200 selection:bg-emerald-500/40">
      <SiteNav />
      <main className={['mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10', className || ''].join(' ')}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}