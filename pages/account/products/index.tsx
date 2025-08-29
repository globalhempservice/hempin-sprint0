// pages/account/products/index.tsx
import Head from 'next/head'
import AccountShell from '../../../components/AccountShell'

export default function MyProducts() {
  return (
    <AccountShell title="My Products">
      <Head><title>My Products • HEMPIN</title></Head>

      <div className="card">
        <p className="opacity-80">Product management is coming next. You’ll be able to add up to five products to your brand page.</p>
      </div>
    </AccountShell>
  )
}