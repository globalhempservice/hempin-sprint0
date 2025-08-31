// pages/admin/logout.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

export default function AdminLoggedOut() {
  // purely informative screen (cookie is cleared by /api/admin/logout)
  useEffect(() => {}, [])
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <Head><title>Admin signed out • HEMPIN</title></Head>
      <h1 className="text-2xl font-semibold mb-3">You’re signed out of Admin</h1>
      <p className="opacity-80 mb-8">
        Dear awesome Admin, you’ve been logged out. All safe. 🔐
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link className="btn btn-primary" href="/admin/login">Sign in again</Link>
        <Link className="btn" href="/">Go to homepage</Link>
      </div>
    </div>
  )
}
