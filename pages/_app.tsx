// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  // In-app areas have their own shells/sidebars
  const isAppArea = pathname.startsWith('/account') || pathname.startsWith('/admin')

  return (
    <>
      {!isAppArea && <SiteNav />}
      <Component {...pageProps} />
      {!isAppArea && <SiteFooter />}
    </>
  )
}