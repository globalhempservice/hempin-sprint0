// components/AccountShell.tsx
import Head from 'next/head'
import SidebarLayout from './SidebarLayout'

type Props = {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function AccountShell({ title, actions, children }: Props) {
  return (
    <SidebarLayout variant="account">
      <Head>{title ? <title>{title} • HEMPIN</title> : null}</Head>

      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          {title ? <h1 className="text-2xl font-semibold">{title}</h1> : <div />}
          {actions}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </SidebarLayout>
  )
}