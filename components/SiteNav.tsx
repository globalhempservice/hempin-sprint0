// components/SiteNav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../lib/useUser'

export default function SiteNav() {
  const router = useRouter()
  const { user } = useUser()

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/start', label: 'Start' },
    { href: '/bangkok-2025', label: 'Bangkok 2025' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-wide">
          HEMP’IN
        </Link>

        <nav className="hidden gap-6 md:flex">
          {nav.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`text-sm transition hover:opacity-80 ${
                router.pathname === i.href ? 'text-white' : 'text-white/80'
              }`}
            >
              {i.label}
            </Link>
          ))}
        </nav>

        {/* Primary CTA: Account if logged in, otherwise Sign in / Sign up */}
        {user ? (
          <Link
            href="/account"
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
          >
            Account
          </Link>
        ) : (
          <Link
            href="/signin"
            className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
          >
            Sign in / Sign up
          </Link>
        )}
      </div>
    </header>
  )
}