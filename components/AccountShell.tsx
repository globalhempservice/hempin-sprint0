// components/AccountShell.tsx
import type { ReactNode } from 'react'
import SidebarLayout from './SidebarLayout'

type Props = {
  title?: string
  actions?: ReactNode
  children: ReactNode
}

export default function AccountShell({ title, actions, children }: Props) {
  return (
    <SidebarLayout variant="account">
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white/90">{title}</h1>
          {actions}
        </div>
      )}
      {children}
    </SidebarLayout>
  )
}