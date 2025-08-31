// lib/adminAuth.ts
import type { NextApiResponse, NextApiRequest } from 'next'
import type { GetServerSidePropsContext } from 'next'
import crypto from 'crypto'

const COOKIE = 'hempin_admin'
const MAX_AGE = 60 * 60 * 8 // 8h

// Final session token: HMAC(secret, hashedPassword)
const makeSessionToken = () => {
  const passHash = process.env.ADMIN_PASSWORD_SHA256 || ''
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  return crypto.createHmac('sha256', secret).update(passHash).digest('base64url')
}

function serializeCookie(name: string, val: string, opts: Record<string, any> = {}) {
  const enc = encodeURIComponent
  let cookie = `${name}=${enc(val)}`
  if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`
  cookie += `; Path=/; HttpOnly; Secure; SameSite=Lax`
  return cookie
}

export function setAdminSession(res: NextApiResponse) {
  res.setHeader('Set-Cookie', serializeCookie(COOKIE, makeSessionToken(), { maxAge: MAX_AGE }))
}

export function clearAdminSession(res: NextApiResponse) {
  res.setHeader('Set-Cookie', serializeCookie(COOKIE, '', { maxAge: 0 }))
}

export function hasValidAdminCookie(req: NextApiRequest | GetServerSidePropsContext['req']) {
  const cookie = req.headers.cookie || ''
  const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith(`${COOKIE}=`))
  if (!match) return false
  const val = decodeURIComponent(match.split('=')[1] || '')
  return val === makeSessionToken()
}

export function redirectToAdminLogin(ctx: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: `/admin/login?next=${encodeURIComponent(ctx.resolvedUrl || '/admin')}`,
      permanent: false,
    },
  }
}
