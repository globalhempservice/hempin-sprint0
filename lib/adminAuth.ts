// lib/adminAuth.ts
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import crypto from 'crypto'

const COOKIE_NAME = 'hp_admin'
const MAX_AGE_SEC = 60 * 60 * 8 // 8 hours

const b64u = {
  enc: (buf: Buffer) =>
    buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'),
  dec: (str: string) => Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64'),
}

function sha256Hex(input: string) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex')
}

function sign(payloadB64: string, secret: string) {
  const mac = crypto.createHmac('sha256', secret).update(payloadB64).digest()
  return b64u.enc(mac)
}

export function createSessionToken(userAgent: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  if (!secret) throw new Error('ADMIN_SESSION_SECRET missing')

  const payload = {
    v: 1,
    iat: Math.floor(Date.now() / 1000),
    uah: sha256Hex(userAgent || ''), // bind to UA lightly
  }
  const payloadB64 = b64u.enc(Buffer.from(JSON.stringify(payload)))
  const sig = sign(payloadB64, secret)
  return `v1.${payloadB64}.${sig}`
}

export function verifySessionToken(token: string | undefined, userAgent: string): boolean {
  try {
    if (!token) return false
    const secret = process.env.ADMIN_SESSION_SECRET || ''
    if (!secret) return false

    const [v, payloadB64, sig] = token.split('.')
    if (v !== 'v1' || !payloadB64 || !sig) return false
    const expected = sign(payloadB64, secret)

    // timing-safe compare
    const a = b64u.dec(sig)
    const b = b64u.dec(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false

    const payload = JSON.parse(b64u.dec(payloadB64).toString('utf8')) as { iat: number; uah: string }
    // expiry
    if (payload.iat + MAX_AGE_SEC < Math.floor(Date.now() / 1000)) return false
    // bind to UA
    if (payload.uah !== sha256Hex(userAgent || '')) return false

    return true
  } catch {
    return false
  }
}

export function adminCookieHeader(token: string) {
  // Path limited to /admin, httpOnly so JS can’t read it
  return `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Secure; Path=/admin; Max-Age=${MAX_AGE_SEC}`
}

export function clearAdminCookieHeader() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Secure; Path=/admin; Max-Age=0`
}

export function getAdminTokenFromCtx(ctx: GetServerSidePropsContext) {
  const cookie = ctx.req.headers.cookie || ''
  const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith(`${COOKIE_NAME}=`))
  return match ? match.split('=')[1] : undefined
}

// Wrap any page's getServerSideProps with this guard
export function withAdminGuard<T extends Record<string, any> = {}>(
  inner?: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const ok = verifySessionToken(getAdminTokenFromCtx(ctx), ctx.req.headers['user-agent'] || '')
    if (!ok) {
      const next = encodeURIComponent(ctx.resolvedUrl || '/admin')
      return {
        redirect: { destination: `/admin/login?next=${next}`, permanent: false },
      }
    }
    return inner ? await inner(ctx) : { props: {} as T }
  }
}
