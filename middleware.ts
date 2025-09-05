import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'hempin_admin'
const ARCH_COOKIE  = 'architect_session'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const path = url.pathname

  // ---- ADMIN GUARD (unchanged behavior) ----
  if (path.startsWith('/admin')) {
    const has = req.cookies.get(ADMIN_COOKIE)?.value
    if (!has && !path.startsWith('/admin/login')) {
      const next = encodeURIComponent(url.pathname + url.search)
      return NextResponse.redirect(new URL(`/admin/login?next=${next}`, req.url))
    }
    return NextResponse.next()
  }

  // ---- ARCHITECT GUARD (new) ----
  if (path.startsWith('/architect')) {
    // Allow the gate page itself and the login API to pass
    const allow =
      path === '/architect' ||
      path === '/architect/' ||
      path.startsWith('/api/architect/login') // in case middleware matches APIs in your setup

    if (allow) return NextResponse.next()

    const token = req.cookies.get(ARCH_COOKIE)?.value
    if (token === '1') return NextResponse.next()

    const next = encodeURIComponent(url.pathname + url.search)
    return NextResponse.redirect(new URL(`/architect?next=${next}`, req.url))
  }

  return NextResponse.next()
}

// Match both admin and architect areas (not /api by default)
export const config = {
  matcher: [
    '/admin/:path*',
    '/architect/:path*',
    // If your project applies middleware to API routes, include this:
    // '/api/architect/:path*',
  ],
}