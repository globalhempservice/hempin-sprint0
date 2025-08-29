// pages/account/brand/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import SidebarLayout from '../../../components/SidebarLayout'
import RequireAuth from '../../../components/RequireAuth'

export default function BrandPage() {
  return (
    
      <SidebarLayout variant="account">
        <Head><title>My brand • HEMPIN</title></Head>
        <h1 className="text-2xl font-bold mb-4">My brand</h1>

        <div className="card">
          <div className="font-semibold mb-2">Build or edit your brand</div>
          <p className="opacity-80 mb-4">
            Your public page will go live with the directory at launch.
          </p>
          <div className="flex gap-2">
            <Link href="/account/brand/edit" className="btn btn-primary">Open brand builder</Link>
          </div>
        </div>

        <div className="card">
          <div className="font-semibold mb-2">Next steps</div>
          <ul className="list-disc ml-5 space-y-1 opacity-90">
            <li>Add at least one product page</li>
            <li>Choose a kit (brand page + product slots)</li>
            <li>We’ll review your submission and confirm by email</li>
          </ul>
          <Link href="/account/products" className="btn btn-link mt-3">Go to Products</Link>
        </div>
      </SidebarLayout>
  
  )
}