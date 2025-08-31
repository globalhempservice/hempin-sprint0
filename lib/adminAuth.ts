// lib/adminAuth.ts
import type { GetServerSidePropsContext } from 'next'
import type { IncomingMessage, ServerResponse } from 'http'
import { createHmac, createHash, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE_NAME = 'hempin_admin'
const DEFAULT_TTL_SECONDS = 60 * 60 * 8 // 8 hours

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return b
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function sign(b64Payload: string, secret: string) {
  return b64url(createHmac('sha256', secret).update(b64Payload).digest())
}

function parseCookies(header?: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (!k) continue
    out[k] = decodeURIComponent(rest.join('=') || '')
  }
  return out
}

function setCookie(res: ServerResponse, cookie: string) {
  const prev = res.getHeader('Set-Cookie')
  if (Array.isArray(prev)) res.setHeader('Set-Cookie', [...prev, cookie])
  else if (typeof prev === 'string') res.setHeader('Set-Cookie', [prev, cookie])
  else res.setHeader('Set-Cookie', cookie)
}

function buildCookie(value: string, maxAgeSec: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${ADMIN_COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`
}

export function setAdminCookie(res: ServerResponse, maxAgeSec = DEFAULT_TTL_SECONDS) {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')

  const exp = Math.floor(Date.now() / 1000) + maxAgeSec
  const payload = b64url(Buffer.from(JSON.stringify({ v: 1, exp })))
  const signature = sign(payload, secret)
  const token = `${payload}.${signature}`

  setCookie(res, buildCookie(token, maxAgeSec))
}

export function clearAdminCookie(res: ServerResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  setCookie(res, `${ADMIN_COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`)
}

export function hasValidAdminCookie(req: IncomingMessage): boolean {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET || ''
    if (!secret) return false
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies[ADMIN_COOKIE_NAME]
    if (!token) return false
    const [payload, sig] = token.split('.')
    if (!payload || !sig) return false

    const expected = sign(payload, secret)
    const ok =
      expected.length === sig.length &&
      timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
    if (!ok) return false

    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    const { exp } = JSON.parse(json)
    if (typeof exp !== 'number' || exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export function redirectToAdminLogin(ctx: GetServerSidePropsContext) {
  const next = encodeURIComponent(ctx.resolvedUrl || '/admin')
  return { redirect: { destination: `/admin/login?next=${next}`, permanent: false as const } }
}

// Password check: compare SHA-256 of submitted password to ADMIN_PASSWORD_SHA256
export function passwordMatchesEnv(plain: string): boolean {
  const wantHex = (process.env.ADMIN_PASSWORD_SHA256 || '').toLowerCase().trim()
  if (!wantHex) return false
  const gotHex = createHash('sha256').update(plain, 'utf8').digest('hex').toLowerCase()
  const a = Buffer.from(wantHex)
  const b = Buffer.from(gotHex)
  return a.length === b.length && timingSafeEqual(a, b)
}
