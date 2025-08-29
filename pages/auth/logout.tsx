// pages/auth/logout.tsx
import Link from 'next/link'

export default function LoggedOut() {
  return (
    <main className="container max-w-lg mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-bold">You’re logged out</h1>
      <p className="opacity-80">Come back anytime.</p>
      <div className="flex justify-center gap-3">
        <Link href="/" className="btn btn-outline">Go to homepage</Link>
        <Link href="/account" className="btn btn-primary">Sign in</Link>
      </div>
    </main>
  )
}