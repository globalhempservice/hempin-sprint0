// pages/404.tsx
import Link from 'next/link'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-zinc-900 to-black text-zinc-200">
      <SiteNav />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-8xl font-extrabold text-emerald-400">404</h1>
          <p className="mb-6 text-xl font-medium text-white">
            Oops! This page is lost in the hemp fields 🌿
          </p>
          <p className="mb-10 text-zinc-400">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-emerald-500/20 px-6 py-3 text-lg font-medium text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/30"
          >
            Back to homepage
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}