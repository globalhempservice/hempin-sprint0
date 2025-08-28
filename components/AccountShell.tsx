// components/AccountShell.tsx
import { ReactNode } from 'react'
import AccountSidebar from './AccountSidebar'

export type AccountShellProps = {
  children: ReactNode
  admin?: boolean
  title?: string
  actions?: ReactNode
}

export default function AccountShell({ children, admin = false, title, actions }: AccountShellProps) {
  return (
    <div className="flex">
      <AccountSidebar admin={admin} />
      <main className="flex-1 p-6 space-y-4">
        {(title || actions) && (
          <div className="flex items-center justify-between">
            {title ? <h1 className="text-2xl font-bold">{title}</h1> : <div />}
            {actions ?? null}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}