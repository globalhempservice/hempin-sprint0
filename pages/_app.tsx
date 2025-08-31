// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

// Site shell bits (keep your actual components/paths)
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

// Only protects /account/**
import { AccountRouteGuard } from '../lib/authGuard'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const path = router.pathname

  // Hide the public shell on auth and admin-login routes
  const hideShell =
    path === '/signin' ||
    path.startsWith('/auth/') ||
    path === '/admin/login'

  const Page = (
    <AccountRouteGuard>
      <Component {...pageProps} />
    </AccountRouteGuard>
  )

  if (hideShell) {
    return Page
  }

  // Default: show site shell
  return (
    <>
      <SiteNav />
      {Page}
      <SiteFooter />
    </>
  )
}