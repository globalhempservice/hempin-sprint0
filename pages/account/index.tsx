// pages/account/index.tsx
import Head from 'next/head'
import AccountSidebar from '../../components/AccountSidebar'

export default function AccountHome() {
  return (
    <div className="flex">
      <Head><title>Account • HEMPIN</title></Head>
      <AccountSidebar />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Account home</h1>
        <div className="card">
          <div className="font-semibold mb-2">Welcome to your account</div>
          <p className="opacity-80">Manage your brand, products, and services.</p>
        </div>
      </main>
    </div>
  )
}