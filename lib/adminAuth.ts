// lib/adminAuth.ts
import type { NextApiResponse } from 'next'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import crypto from 'crypto'

const ADMIN_COOKIE = 'hempin_admin_session'
const ADMIN_PASSWORD_SHA256 = process.env.ADMIN_PASSWORD_SHA256 || ''
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dev-secret'
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7 // 7 days

function b64(buf: Buffer) {
  return buf.toString('base64url')
}
function hmac(data: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest()
}

export function verifyAdminPassword(password: string) {
  const hash = crypto.createHash('sha256').update(password).digest('hex')
  // constant-time comparison
  const a = Buffer.from(hash)
  const b = Buffer.from(ADMIN_PASSWORD_SHA256)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function setAdminCookie(res: NextApiResponse) {
  const payload = 'ok'
  const sig = b64(hmac(payload))
  const value = `${payload}.${sig}`
  const cookie = [
    `${ADMIN_COOKIE}=${value}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${COOKIE_MAX_AGE_SEC}`,
    // restrict admin to /admin routes but still allow /api/admin/logout
    // keeping Path=/ is simplest; if you want /admin only, add a second cookie for /api.
  ].join('; ')
  res.setHeader('Set-Cookie', cookie)
}

export function clearAdminCookie(res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  )
}

export function hasValidAdminCookie(req: { headers: { cookie?: string } }) {
  const raw = req.headers.cookie || ''
  const match = raw.split(';').map(s => s.trim()).find(s => s.startsWith(`${ADMIN_COOKIE}=`))
  if (!match) return false
  const value = match.split('=')[1] || ''
  const [payload, sig] = value.split('.')
  if (payload !== 'ok' || !sig) return false
  const expected = b64(hmac(payload))
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export function redirectToAdminLogin(
  ctx: GetServerSidePropsContext
): GetServerSidePropsResult<Record<string, unknown>> {
  const next = encodeURIComponent(ctx.resolvedUrl || '/admin')
  return {
    redirect: {
      destination: `/admin/login?next=${next}`,
      permanent: false
    }
  }
}
