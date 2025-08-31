// components/SiteNav.tsx
import React, { useState } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/trade', label: 'Trade' },            // blue universe
  { href: '/supermarket', label: 'Supermarket' },// purple universe
  { href: '/events', label: 'Events' },          // amber/orange universe
  { href: '/research', label: 'Research' },      // teal universe
  { href: '/experiments', label: 'Experiments' } // rainbow lab
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">H</span>
          <span className="text-white">HEMPIN</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/signin" className="rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
            Sign in
          </Link>
          <Link
            href="/account"
            className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/25"
          >
            Account
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-zinc-300 hover:bg-white/5 lg:hidden"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-[80%] max-w-xs bg-black/90 p-4 ring-1 ring-white/10">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-white">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-zinc-300 hover:bg-white/5"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="grid gap-2 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 h-px bg-white/10" />
              <Link href="/signin" className="rounded-lg px-3 py-2 text-zinc-200 hover:bg-white/5" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/account" className="rounded-lg px-3 py-2 text-emerald-300 ring-1 ring-emerald-400/30 hover:bg-emerald-500/10" onClick={() => setOpen(false)}>
                Account
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}