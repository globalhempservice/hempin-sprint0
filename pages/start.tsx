// pages/start.tsx
import Link from 'next/link'

export default function Start() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Create your brand page</h1>
      <p className="text-muted-foreground mb-8">
        Draft your brand now. We’ll save it locally and help you send a magic link to finish setup.
      </p>
      <div className="flex gap-3">
        <Link href="/account" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
          Start drafting
        </Link>
        <Link href="/" className="px-4 py-2 rounded-lg border hover:bg-white/5">Back home</Link>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        You can sign in later; your draft won’t be lost on this device.
      </p>
    </div>
  )
}