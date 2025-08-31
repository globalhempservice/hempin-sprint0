// pages/404.tsx
import Head from 'next/head'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Head>
        <title>Page not found • HEMPIN</title>
      </Head>

      <SiteNav />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-6">404</h1>
        <p className="text-xl opacity-80 mb-8">
          Oops… this page wandered off into the hemp fields.
        </p>
        <a
          href="/"
          className="rounded-xl bg-green-500 text-black px-6 py-3 font-semibold hover:bg-green-400 transition"
        >
          Back to homepage
        </a>
      </main>

      <SiteFooter />
    </div>
  )
}