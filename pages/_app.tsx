import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Starfield from '@/components/home/Starfield';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Starfield />
      <div className="app-shell">
        <Component {...pageProps} />
      </div>
    </>
  );
}