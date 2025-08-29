// pages/_app.tsx
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import SiteFooter from '../components/SiteFooter'

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  // Hide footer inside authenticated shells
  const hideFooter =
    pathname.startsWith('/account') || pathname.startsWith('/admin')

  return (
    <>
      <Component {...pageProps} />
      {!hideFooter && <SiteFooter />}
    </>
  )
}