// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import { AccountGuard } from '../lib/authGuard'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isAccountRoute = router.pathname.startsWith('/account')

  const inner = <Component {...pageProps} />

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b0f12" />
      </Head>
      {isAccountRoute ? <AccountGuard>{inner}</AccountGuard> : inner}
    </>
  )
}