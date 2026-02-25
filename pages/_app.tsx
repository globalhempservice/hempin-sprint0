// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Starfield from '@/components/home/Starfield';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        {/* Mobile browser theme color */}
        <meta name="theme-color" content="#0a0a0a" />
      </Head>

      <Starfield />
      <div className="app-shell">
        <Component {...pageProps} />
      </div>
    </>
  );
}