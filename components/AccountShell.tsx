// components/AccountShell.tsx
import AccountSidebar from './AccountSidebar'
import type { ReactNode } from 'react'

type Props = {
  title?: string
  actions?: ReactNode
  children: ReactNode
  // we *accept* admin but we don't need it anymore; keep it optional to avoid breakage
  admin?: boolean
}

export default function AccountShell({ title, actions, children }: Props) {
  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-4">
        {(title || actions) && (
          <div className="flex items-center justify-between">
            {title ? <h1 className="text-2xl font-bold">{title}</h1> : <div />}
            {actions ? <div className="flex gap-2">{actions}</div> : null}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}