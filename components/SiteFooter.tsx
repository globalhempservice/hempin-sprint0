// components/SiteFooter.tsx
import Link from 'next/link'
import { useUser } from '../lib/useUser'

export default function SiteFooter() {
  const { user } = useUser()

  return (
    <footer className="border-t border-zinc-900/60 mt-16">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500 sm:flex sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Hemp’in</div>

        <div className="flex gap-4 mt-4 sm:mt-0">
          {user ? (
            <Link className="hover:text-zinc-300" href="/account">
              Account
            </Link>
          ) : (
            <Link className="hover:text-zinc-300" href="/signin">
              Sign in / Sign up
            </Link>
          )}
          <Link className="hover:text-zinc-300" href="/admin/login">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}