// pages/auth/logout.tsx
import Link from 'next/link'
import Head from 'next/head'

export default function LoggedOut() {
  return (
    <>
      <Head><title>Signed out • HEMPIN</title></Head>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-3xl font-bold">You’re logged out</h1>
          <p className="text-zinc-400">Thanks for visiting. Come back anytime.</p>

          <div className="flex gap-3 justify-center">
            <Link href="/signin" className="btn btn-primary">Sign in</Link>
            <Link href="/" className="btn btn-outline">Go to homepage</Link>
          </div>
        </div>
      </main>
    </>
  )
}