// components/AccountShell.tsx
import Head from 'next/head'
import AccountSidebar from './AccountSidebar'
import { ReactNode } from 'react'

type Props = {
  title?: string
  actions?: ReactNode
  children: ReactNode
}

export default function AccountShell({ title, actions, children }: Props) {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <Head>
        {title ? <title>{title} • HEMPIN</title> : <title>Account • HEMPIN</title>}
      </Head>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-6">
              <AccountSidebar />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {(title || actions) && (
              <div className="mb-4 flex items-center justify-between gap-4">
                {title && <h1 className="text-2xl font-semibold">{title}</h1>}
                {actions}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}