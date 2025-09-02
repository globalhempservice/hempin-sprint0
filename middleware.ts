import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE = 'hempin_admin'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  if (url.pathname.startsWith('/admin')) {
    const has = req.cookies.get(ADMIN_COOKIE)?.value
    if (!has && !url.pathname.startsWith('/admin/login')) {
      const next = encodeURIComponent(url.pathname + url.search)
      return NextResponse.redirect(new URL(`/admin/login?next=${next}`, req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}