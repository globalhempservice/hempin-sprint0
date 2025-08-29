// pages/account/services.tsx
import AccountSidebar from '../../components/AccountSidebar'
import Link from 'next/link'

export default function AccountServices() {
  return (
    <div className="flex">
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <div className="card">
          <p className="opacity-80">
            Access HEMP’IN services from your account. Need something else?
            Visit the public&nbsp;
            <Link className="underline" href="/services">services page</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}