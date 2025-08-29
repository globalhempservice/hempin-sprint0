// pages/auth/logout.tsx
import Head from 'next/head'

export default function LoggedOut() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Head><title>Signed out • HEMPIN</title></Head>
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">You’ve been signed out</h1>
        <p className="opacity-80">Come back anytime. Want to jump back in?</p>
        <div className="flex gap-3 justify-center">
          <a href="/signin" className="btn btn-primary">Sign in</a>
          <a href="/" className="btn btn-outline">Go to homepage</a>
        </div>
      </div>
    </div>
  )
}