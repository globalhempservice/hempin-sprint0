// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Try to load the session from Supabase cookies (set by the callback)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Allow these paths without auth (static/assets/API/auth routes)
  const publicPaths = [
    '/',                        // homepage
    '/signin',                  // sign-in page
    '/auth/callback',           // supabase magic-link landing
    '/auth/logout',
    '/services',
    '/contact',
  ]

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api') ||           // your API routes handle auth themselves
    pathname.startsWith('/admin/login')      // your dedicated admin login

  // Protected areas:
  const requiresUser = pathname.startsWith('/account')
  const requiresAdmin = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')

  // If user is not signed in and is trying to access protected pages → send to /signin
  if (!isPublic && !session && (requiresUser || requiresAdmin)) {
    const url = req.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search) // go back after login
    return NextResponse.redirect(url)
  }

  // If signed in and on /signin, bounce to next or /account (avoid bouncing back & forth)
  if (session && pathname === '/signin') {
    const url = req.nextUrl.clone()
    url.pathname = req.nextUrl.searchParams.get('next') || '/account'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    /*
      Run the middleware on all routes except static files we already excluded above.
      Using a wide matcher is simplest; the code will early-return for public routes.
    */
    '/((?!.*\\..*).*)',
  ],
}