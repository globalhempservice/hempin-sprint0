// lib/adminAuth.ts
import crypto from 'crypto'
import type { GetServerSidePropsContext } from 'next'
import type { NextApiResponse } from 'next'

const ADMIN_COOKIE = 'hempin_admin'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? ''
const PASSWORD_SHA256 = process.env.ADMIN_PASSWORD_SHA256 ?? ''

// --- utils
function sha256Hex(s: string) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex')
}
function hmac(body: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('hex')
}
function findCookie(req: any, name: string): string | null {
  const raw = req?.headers?.cookie as string | undefined
  if (!raw) return null
  const part = raw.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='))
  return part ? decodeURIComponent(part.split('=').slice(1).join('=')) : null
}

// --- public API

// ✅ NEW: export used by /api/admin/login
export function passwordMatchesEnv(plaintext: string): boolean {
  if (!PASSWORD_SHA256) return false
  const digest = sha256Hex(plaintext)
  const a = Buffer.from(digest)
  const b = Buffer.from(PASSWORD_SHA256)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function setAdminCookie(res: NextApiResponse | { setHeader: Function }, days = 7) {
  const exp = Math.floor(Date.now() / 1000) + days * 86400
  const body = JSON.stringify({ exp })
  const sig = hmac(body)
  const value = Buffer.from(`${body}.${sig}`).toString('base64url')
  const cookie = `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${days *
    86400}`
  ;(res as any).setHeader('Set-Cookie', cookie)
}

export function clearAdminCookie(res: NextApiResponse | { setHeader: Function }) {
  const cookie = `${ADMIN_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  ;(res as any).setHeader('Set-Cookie', cookie)
}

export function hasValidAdminCookie(req: any): boolean {
  try {
    const raw = findCookie(req, ADMIN_COOKIE)
    if (!raw) return false
    const decoded = Buffer.from(raw, 'base64url').toString('utf8')
    const [body, sig] = decoded.split('.')
    if (!body || !sig) return false
    if (hmac(body) !== sig) return false
    const { exp } = JSON.parse(body)
    return typeof exp === 'number' && exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

export function redirectToAdminLogin(ctx: GetServerSidePropsContext) {
  const next = encodeURIComponent(ctx.resolvedUrl || '/admin')
  return { redirect: { destination: `/admin/login?next=${next}`, permanent: false } }
}

export function redirectToAdminRoot() {
  return { redirect: { destination: '/admin', permanent: false } }
}
