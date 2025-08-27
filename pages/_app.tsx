// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

import AdminSidebar from '../components/AdminSidebar'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAdmin = router.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex">
      {isAdmin && <AdminSidebar />}
      <main className="flex-1 min-w-0">
        <Component {...pageProps} />
      </main>
    </div>
  )
}