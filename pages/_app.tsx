import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css' // keep your global styles
import { AuthSessionProvider } from '../components/auth/AuthSessionProvider'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0b0f12" />
      </Head>
      <AuthSessionProvider>
        <Component {...pageProps} />
      </AuthSessionProvider>
    </>
  )
}