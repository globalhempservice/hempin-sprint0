// pages/account/index.tsx
import Head from 'next/head'
import SidebarLayout from '../../components/SidebarLayout'
import RequireAuth from '../../components/RequireAuth'
import Link from 'next/link'

export default function AccountHome() {
  return (
   
      <SidebarLayout variant="account">
        <Head><title>Account • HEMPIN</title></Head>

        <h1 className="text-2xl font-bold mb-4">Welcome to your account</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="font-semibold mb-2">My brand</div>
            <p className="opacity-80 mb-4">Build or edit your brand page.</p>
            <Link href="/account/brand" className="btn btn-primary">Go to brand</Link>
          </div>

          <div className="card">
            <div className="font-semibold mb-2">My products</div>
            <p className="opacity-80 mb-4">Add and manage your product pages.</p>
            <Link href="/account/products" className="btn btn-primary">Go to products</Link>
          </div>

          <div className="card">
            <div className="font-semibold mb-2">Billing</div>
            <p className="opacity-80 mb-4">Manage your plan and pop-up kits.</p>
            <Link href="/account/billing" className="btn btn-primary">Open billing</Link>
          </div>

          <div className="card">
            <div className="font-semibold mb-2">HEMPIN services</div>
            <p className="opacity-80 mb-4">Buy brand/product pages and kits.</p>
            <Link href="/account/services" className="btn btn-primary">Browse services</Link>
          </div>
        </div>
      </SidebarLayout>
    
  )
}