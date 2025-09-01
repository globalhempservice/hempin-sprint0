// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import PublicShell from '../components/PublicShell'
import { AccountRouteGuard } from '../lib/authGuard'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAccount = router.pathname.startsWith('/account')

  // Public shell only for true public pages (no auth, no account, no admin)
  const shouldWrapWithPublicShell = !(
    router.pathname === '/signin' ||
    router.pathname.startsWith('/auth/') ||
    router.pathname.startsWith('/account') ||
    router.pathname.startsWith('/admin')
  )

  const page = isAccount ? (
    <AccountRouteGuard>
      <Component {...pageProps} />
    </AccountRouteGuard>
  ) : (
    <Component {...pageProps} />
  )

  return shouldWrapWithPublicShell ? <PublicShell>{page}</PublicShell> : page
}