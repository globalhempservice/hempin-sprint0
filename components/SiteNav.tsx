// components/SiteNav.tsx
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/start', label: 'Start' },
  { href: '/events/bangkok-2025', label: 'Bangkok 2025' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteNav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Hide on dashboards where we already have a custom layout
  const hide =
    router.pathname.startsWith('/account') ||
    router.pathname.startsWith('/admin')

  if (hide) return null

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          HEMP’IN
        </Link>

        {/* desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm hover:opacity-100 ${
                router.asPath === href ? 'opacity-100' : 'opacity-70'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/services#kits"
            className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-black hover:bg-emerald-400"
          >
            Get a kit / slots
          </Link>
        </nav>

        {/* mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm md:hidden"
          aria-label="Toggle menu"
        >
          Menu
          <span className="opacity-60">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-white/10 bg-neutral-950 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-2 text-sm hover:bg-white/5 ${
                  router.asPath === href ? 'opacity-100' : 'opacity-80'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/services#kits"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-black hover:bg-emerald-400"
            >
              Get a kit / slots
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}