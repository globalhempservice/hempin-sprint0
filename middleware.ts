// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow public assets and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||   // your /auth/signin + /auth/logout
    pathname === '/' ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/logout') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/shop')
  ) {
    return NextResponse.next()
  }

  // ✅ Only enforce server-side auth for /admin to avoid magic-link loops
  if (pathname.startsWith('/admin')) {
    const hasAccessCookie =
      req.cookies.has('sb-access-token') ||               // auth-helpers v2
      req.cookies.has('supabase-auth-token') ||           // older helpers
      req.cookies.has('sb:token') ||                      // legacy
      !!req.headers.get('authorization')                  // just in case

    if (!hasAccessCookie) {
      const url = req.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Only run on /admin — leave /account to client-side guard to prevent loops
export const config = {
  matcher: ['/admin/:path*'],
}