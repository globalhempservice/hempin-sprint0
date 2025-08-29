// components/AdminShell.tsx
import type { ReactNode } from 'react'
import SidebarLayout from './SidebarLayout'
import Link from 'next/link'

type Props = {
  title?: string
  actions?: ReactNode
  children: ReactNode
}

export default function AdminShell({ title, actions, children }: Props) {
  return (
    <SidebarLayout variant="admin">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white/90">
            {title || 'Admin — Dashboard'}
          </h1>
          {actions}
        </div>
      )}

      {children}

      <div className="mt-6">
        <Link href="/" className="text-sm text-emerald-300 hover:underline">
          Back to site
        </Link>
      </div>
    </SidebarLayout>
  )
}