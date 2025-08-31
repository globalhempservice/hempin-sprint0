// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import PublicShell from '../components/PublicShell'
import { AccountRouteGuard } from '../lib/authGuard'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAccount = router.pathname.startsWith('/account')
  const hidePublicShell =
    router.pathname === '/signin' || router.pathname.startsWith('/auth/')

  const page = isAccount ? (
    <AccountRouteGuard>
      <Component {...pageProps} />
    </AccountRouteGuard>
  ) : (
    <Component {...pageProps} />
  )

  // Don’t wrap signin/auth with the site shell (prevents double header/footer)
  if (hidePublicShell) return page

  return <PublicShell>{page}</PublicShell>
}