// components/AccountShell.tsx
import { ReactNode } from 'react'
import AccountSidebar from './AccountSidebar'

type Props = {
  title?: string
  actions?: ReactNode
  children: ReactNode
}

export default function AccountShell({ title, actions, children }: Props) {
  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-4">
        {(title || actions) && (
          <div className="flex items-center justify-between">
            {title ? <h1 className="text-2xl font-bold">{title}</h1> : <div />}
            {actions ? <div>{actions}</div> : null}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}