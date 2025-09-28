import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const plex = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-mono', display: 'swap' })

export default function App({ Component, pageProps }: AppProps) {
  // ensure dark baseline
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${inter.variable} ${spaceGrotesk.variable} ${plex.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}