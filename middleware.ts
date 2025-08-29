// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes/assets
  if (
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/signin') ||
    pathname.startsWith('/logout') ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/shop')
  ) {
    return NextResponse.next()
  }

  // ✅ Only protect /admin on the server (avoid magic-link loops)
  if (pathname.startsWith('/admin')) {
    const authed =
      req.cookies.has('sb-access-token') ||
      req.cookies.has('supabase-auth-token') ||
      req.cookies.has('sb:token') ||
      !!req.headers.get('authorization')

    if (!authed) {
      const url = req.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}