// components/SiteFooter.tsx
import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/70">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">H</span>
              <span className="text-white">HEMPIN</span>
            </div>
            <p className="max-w-xs text-sm text-zinc-400">
              Building the hemp ecosystem—tools, marketplaces, research and playful experiments.
            </p>
          </div>

          {/* Universes */}
          <div>
            <div className="mb-3 font-semibold text-white">Universes</div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link className="hover:text-white" href="/trade">Trade</Link></li>
              <li><Link className="hover:text-white" href="/supermarket">Supermarket</Link></li>
              <li><Link className="hover:text-white" href="/events">Events</Link></li>
              <li><Link className="hover:text-white" href="/research">Research</Link></li>
              <li><Link className="hover:text-white" href="/experiments">Experiments</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="mb-3 font-semibold text-white">Company</div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link className="hover:text-white" href="/impactverse">About (Impactverse)</Link></li>
              <li><Link className="hover:text-white" href="/colorpalette">Brand guide / Colors</Link></li>
            </ul>
          </div>

          {/* Admin & Legal */}
          <div>
            <div className="mb-3 font-semibold text-white">Admin & Legal</div>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link className="hover:text-white" href="/admin/login">Admin</Link></li>
              <li>
                <Link className="hover:text-white" href="/legal">Legal hub</Link>
              </li>
              <li><Link className="hover:text-white" href="/legal/privacy">Privacy</Link></li>
              <li><Link className="hover:text-white" href="/legal/terms">Terms</Link></li>
            </ul>

            {/* Admin logout button (small) */}
            <div className="mt-3">
              <a
                href="/api/admin/logout"
                className="inline-block rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
              >
                Admin logout
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-zinc-400">
          HEMPIN 2025 — made with <span className="text-red-400">❤️</span> for <span className="text-emerald-300">🌍</span>
        </div>
      </div>
    </footer>
  )
}