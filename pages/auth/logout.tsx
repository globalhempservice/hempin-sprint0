// pages/auth/logout.tsx
import Link from 'next/link'
import Head from 'next/head'
import AppShell from '../../components/AppShell'

export default function LoggedOutPage() {
  return (
    <AppShell>
      <Head><title>Signed out • HEMPIN</title></Head>
      <div className="max-w-xl mx-auto mt-10 card text-center">
        <h1 className="text-2xl font-bold mb-2">You’re signed out</h1>
        <p className="text-zinc-400 mb-6">Thanks for visiting HEMPIN.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/signin" className="btn btn-primary">Sign in</Link>
          <Link href="/" className="btn btn-outline">Go to homepage</Link>
        </div>
      </div>
    </AppShell>
  )
}