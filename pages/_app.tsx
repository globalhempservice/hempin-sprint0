// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AccountRouteGuard } from '../lib/authGuard'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AccountRouteGuard>
      <Component {...pageProps} />
    </AccountRouteGuard>
  )
}