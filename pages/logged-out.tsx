// pages/logged-out.tsx
import Link from 'next/link'

export default function LoggedOut() {
  return (
    <main className="container p-8 space-y-4">
      <h1 className="text-2xl font-bold">You’re logged out</h1>
      <p className="opacity-80">Thanks for visiting. Come back soon!</p>
      <div className="flex gap-3">
        <Link href="/account" className="btn btn-primary">Sign in</Link>
        <Link href="/" className="btn btn-outline">Go to homepage</Link>
      </div>
    </main>
  )
}