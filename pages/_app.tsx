// pages/_app.tsx
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import SiteNav from '../components/SiteNav'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        <Component {...pageProps} />
      </main>
    </>
  )
}